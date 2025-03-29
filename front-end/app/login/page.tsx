"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { WalletAuthButton } from "@/components/wallet-auth-button"
import Image from "next/image"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
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

  const handleWalletConnected = () => {
    setIsLoading(false)
    router.push("/home")
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

