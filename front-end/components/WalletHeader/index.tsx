"use client";
import { Button } from "@worldcoin/mini-apps-ui-kit-react";
// import { useWallet } from "@/context/WalletContext";
import { User, Wallet, LogOut, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useSession } from "next-auth/react";

export const MissionsDiv = () => {
  const user = useSession();
  const [copied, setCopied] = useState(false);


  return (
    <div className="relative bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl shadow-sm p-4 mb-6 max-w-md mx-auto w-full">
      <div>
        <h1 className="text-2xl font-bold mb-2 text-white">Missions</h1>
        <p className="text-sm text-white/90">
          Complete tasks to earn rewards
        </p>
      </div>
      </div>
  );
};