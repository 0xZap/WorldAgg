"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { WalletAuthButton } from "@/components/wallet-auth-button"
import Image from "next/image"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [floatingIcons, setFloatingIcons] = useState<{ id: number; x: number; y: number; scale: number; rotation: number; image: string }[]>([])

  useEffect(() => {
    // List of all image paths from the public folder
    const imagePaths = [
      '/Asado_Wld.jpg',
      '/Clip_World.png',
      '/DNA_World.png',
      '/Egg_World.png',
      '/Free_World.png',
      '/Golden_Wld.png',
      '/Learn_world.png',
      '/Orb-World.png',
      '/Oro-World.png',
      '/Sapien_World.jpg'
    ]
    
    // Create an array of floating icons with random positions
    const icons = Array.from({ length: 10 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: 0.5 + Math.random() * 1.5,
      rotation: Math.random() * 360,
      image: imagePaths[i % imagePaths.length] // Cycle through all available images
    }))
    
    setFloatingIcons(icons)
  }, [])

  const handleWalletConnected = () => {
    setIsLoading(false)
    router.push("/")
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-white text-black">
      {/* Background elements */}
      {/* <div className="absolute -right-20 top-0 h-screen w-1/2 bg-[#4ecdc4] opacity-80 transform -skew-x-12"></div> */}
      <div className="absolute -left-40 bottom-0 h-40 w-full bg-[#4ecdc4] rounded-xl opacity-60 transform skew-x-12"></div>
      
      {/* Floating background icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingIcons.map((icon) => (
          <motion.div
            key={icon.id}
            className="absolute"
            initial={{
              x: `${icon.x}vw`,
              y: `${icon.y}vh`,
              scale: icon.scale,
              rotate: icon.rotation,
            }}
            animate={{
              y: [`${icon.y}vh`, `${(icon.y + 20) % 100}vh`],
              x: [`${icon.x}vw`, `${(icon.x + (Math.random() * 10 - 5)) % 100}vw`],
              rotate: [icon.rotation, icon.rotation + 360],
            }}
            transition={{
              repeat: Infinity,
              duration: 15 + Math.random() * 20,
              ease: "linear",
              repeatType: "reverse",
            }}
          >
            <div className="relative w-16 h-16 filter blur-[1px] opacity-15">
              <Image
                src={icon.image}
                alt="World icon"
                fill
                style={{ objectFit: "contain" }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Content container */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6">
        {/* Logo/Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 text-center"
        >
          <h1 className="font-serif text-6xl font-bold italic tracking-tighter text-black">WorldAgg</h1>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mb-12 text-center"
        >
          <p className="font-serif text-lg italic text-black/80">Gotta claim'em all</p>
        </motion.div>

        {/* Login form */}
        <div className="w-full max-w-md">
          {/* Login button with Worldcoin Wallet */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="relative"
          >
            <WalletAuthButton onSuccess={handleWalletConnected} />
            
            <div className="mt-4 text-center text-sm text-black/60">
              <p>Connect with your Worldcoin Wallet to continue</p>
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-6 right-6 flex items-center gap-2 text-xs">
          <div className="h-2 w-2 rounded-full bg-[#4ecdc4]"></div>
          <span className="font-mono">v1.0.0</span>
        </div>

        <div className="absolute bottom-10 left-10 font-serif text-xs uppercase">
          <div className="transform -skew-x-12 text-[#d13438]">SYSTÈME</div>
          <div className="transform skew-x-12 text-[#4ecdc4]">CONNECTÉ</div>
        </div>
      </div>
    </div>
  )
}

