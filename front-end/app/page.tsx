"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect, useRef } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { WalletAuthButton } from "@/components/wallet-auth-button"
import Image from "next/image"
import { useUser } from "@/lib/hooks/use-user";
import { useToast, Toaster } from "@worldcoin/mini-apps-ui-kit-react/Toast";
import { MiniKit } from "@worldcoin/minikit-js";
import { authenticateWithWallet } from "@/lib/auth";

export default function LoginPage() {

  const [isLoading, setIsLoading] = useState(false)
  const [authLoading, setAuthLoading] = useState(false);
  const { toast } = useToast();
  const { setUser } = useUser();
  const checkingMiniKit = useRef(false);
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const imagePaths = [
    '/Asado_Wld.jpg',
    '/Clip_World.png',
    '/DNA_World.png',
    '/Egg_World.png',
    '/Free_World.png',
    '/Golden_Wld.png',
    '/Learn_world.png',
    '/Orb_World.png',
    '/Oro_World.jpg',
    '/Sapien_Wld.jpg'
  ]

const handleWalletConnected = async () => {
    setAuthLoading(true);

    try {
      const result = await authenticateWithWallet();

      if (result.success) {
        // Store user data from authentication result
        if (result.user) {
          setUser(result.user);
        }
        toast.success({
          title: `Welcome ${result.user?.username || "User"}`,
          duration: 3000,
        });
        // Navigate to chat page on successful auth
        router.push("/home");
        // router.push(`/chat/${welcomeAgentId}`);
      } else {
        toast.error({
          title: "Authentication failed",
          duration: 2000,
        });
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      toast.error({
        title: "Authentication failed",
        duration: 2000,
      });
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    // Skip if we already started checking MiniKit
    if (checkingMiniKit.current) return;
    checkingMiniKit.current = true;
    
    const init = async () => {
      // Check MiniKit installation
      const checkMiniKit = async () => {
        const isInstalled = MiniKit.isInstalled();
        if (isInstalled) {
          setIsLoading(false);
        } else {
          // Use a more controlled approach to avoid rapid state updates
          setTimeout(checkMiniKit, 1000);
        }
      };

      if (
        process.env.NEXT_PUBLIC_APP_ENV === "test" ||
        process.env.NEXT_PUBLIC_APP_ENV === "development"
      ) {
        // Skip MiniKit check in dev/test
        setIsLoading(false);
        console.log("Development mode -> minikit check skipped");
      } else {
        checkMiniKit();
      }
    };

    init();
  }, []);

  if (isLoading) {
    return (
      <main
        className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 lg:p-12
          bg-gradient-to-br from-slate-50 to-gray-100"
      >
        <div className="flex flex-col items-center justify-center text-center">
          <svg
            className="animate-spin h-10 w-10 text-slate-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-4 text-lg font-medium text-slate-700">
            Loading MiniKit...
          </p>
        </div>
      </main>
    );
  }

  // Auto-rotate images every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagePaths.length)
    }, 3000)
    
    return () => clearInterval(interval)
  }, [imagePaths.length])

  return (
    <div className="relative h-screen w-full overflow-hidden bg-white text-black">
      {/* Background elements */}
      {/* <div className="absolute -right-20 top-0 h-screen w-1/2 bg-[#4ecdc4] opacity-80 transform -skew-x-12"></div> */}
      <div className="absolute -left-40 bottom-0 h-40 w-full bg-blue-500 rounded-xl opacity-60 transform skew-x-12"></div>
      
      {/* Content container */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
        {/* Logo/Title - removed motion */}
        {/* Image Carousel - moved here */}
        <div className="w-48 h-48 mb-6">
          {imagePaths.map((path, index) => (
            <div 
              key={path}
              className={`absolute transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div className="w-48 h-48 rounded-full overflow-hidden">
                <Image 
                  src={path} 
                  alt={`Carousel image ${index + 1}`} 
                  width={75} 
                  height={75}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Login form */}
        <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="font-serif text-6xl font-bold italic tracking-tighter text-blue-500">WorldAgg</h1>
        </div>
          {/* Login button with Worldcoin Wallet - removed motion */}
          <div className="relative">
            <WalletAuthButton onSuccess={handleWalletConnected} />
            
            <div className="mt-4 text-center text-sm text-black/60">
              <p>Claim all tokens in one place</p>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-6 right-6 flex items-center gap-2 text-xs">
          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
          <span className="font-mono">v1.0.0</span>
        </div>
      </div>
    </div>
  )
}

