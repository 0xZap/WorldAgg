import { MiniKit, WalletAuthInput } from "@worldcoin/minikit-js";
import type { User } from "@/lib/hooks/use-user";

const walletAuthInput = (nonce: string): WalletAuthInput => {
  return {
    nonce,
    requestId: "0",
    expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
    notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
    statement:
      "Zap World Agents is still in development. Keep an eye out for updates!",
  };
};

export type AuthResult = {
  success: boolean;
  error?: string;
  user?: User;
};

/**
 * Helper function to handle wallet authentication
 * @returns Promise with authentication result
 */
export const authenticateWithWallet = async (): Promise<AuthResult> => {
  if (!MiniKit.isInstalled()) {
    console.warn('Tried to invoke "walletAuth", but MiniKit is not installed.');
    return {
      success: false,
      error: "WorldApp is not installed or not running",
    };
  }

  try {
    // In test environment, skip the nonce fetch
    let nonce = "test-nonce";
    if (process.env.NEXT_PUBLIC_APP_ENV !== "test") {
      const res = await fetch(`/api/nonce`);
      if (!res.ok) {
        throw new Error("Failed to generate authentication nonce");
      }
      const data = await res.json();
      nonce = data.nonce;
    }

    const { commandPayload: generateMessageResult, finalPayload } =
      await MiniKit.commandsAsync.walletAuth(walletAuthInput(nonce));

    if (finalPayload.status === "error") {
      throw new Error("Authentication failed");
    } else {
      if (process.env.NEXT_PUBLIC_APP_ENV !== "test") {
        const response = await fetch("/api/complete-siwe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            payload: finalPayload,
            nonce,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Authentication verification failed"
          );
        }
      }

      // Check if MiniKit.user exists and has required properties
      if (MiniKit.user && typeof MiniKit.user.walletAddress === "string") {
        const userData: User = {
          walletAddress: MiniKit.user.walletAddress,
          username: MiniKit.user.username || null,
          profilePictureUrl: MiniKit.user.profilePictureUrl || null,
        };

        return {
          success: true,
          user: userData,
        };
      }

      return {
        success: true,
      };
    }
  } catch (err: any) {
    console.error("Authentication error:", err);
    return {
      success: false,
      error: err.message || "Failed to authenticate wallet",
    };
  }
};

/**
 * Check if user is already authenticated
 */
export const checkAuthStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch("/api/check-auth", {
      // Include credentials to ensure cookies are sent with the request
      credentials: "include",
      // Add cache: no-store to prevent caching the auth status
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn("Auth check failed with status:", response.status);
      return false;
    }

    const data = await response.json();
    return !!data.isAuthenticated;
  } catch (err) {
    console.error("Error checking auth status:", err);
    return false;
  }
}; 