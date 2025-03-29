"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { MiniKit } from "@worldcoin/minikit-js";

interface WalletAuthButtonProps {
  onSuccess?: () => void;
}

export function WalletAuthButton({ onSuccess }: WalletAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleWalletAuth = async () => {
    if (!MiniKit.isInstalled()) {
      console.error("MiniKit is not installed");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/nonce");
      const { nonce } = await res.json();
      
      // Create a proper expiration time (1 hour from now)
      const expirationTime = new Date(Date.now() + 60 * 60 * 1000);
      
      const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
        nonce,
        expirationTime,
        statement: "Sign in with your World ID wallet",
      });

      if (!finalPayload || finalPayload.status === "error") {
        throw new Error(finalPayload?.error_code || "Unknown wallet auth error");
      }

      const verifyRes = await fetch("/api/complete-siwe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payload: finalPayload,
          nonce,
        }),
      });
      
      if (!verifyRes.ok) {
        throw new Error(`Verification failed with status: ${verifyRes.status}`);
      }
      
      const verification = await verifyRes.json();

      if (verification.isValid) {
        const signInResult = await signIn("worldcoin-wallet", {
          message: finalPayload.message,
          signature: finalPayload.signature,
          address: finalPayload.address,
          nonce,
          redirect: false,
        });

        if (signInResult?.error) {
          throw new Error(`Sign in failed: ${signInResult.error}`);
        }

        // Call onSuccess if provided
        if (onSuccess) onSuccess();
      } else {
        throw new Error("Verification failed: " + (verification.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Wallet auth error:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleWalletAuth}
      disabled={isLoading}
      className="relative w-full overflow-hidden bg-blue-500 font-serif text-lg font-bold uppercase tracking-widest text-white px-4 py-2 rounded-lg shadow-md transition-colors disabled:opacity-50"
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 mr-2 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
          <span className="relative z-10">CONNECTING...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <span className="relative z-10">CONNECT</span>
          {/* <div className="absolute -right-4 bottom-0 h-full w-20 transform skew-x-12 bg-[#d13438] opacity-70"></div> */}
        </div>
      )}
    </button>
  );
}
