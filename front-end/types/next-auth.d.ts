import "next-auth"

declare module "next-auth" {
  interface Session {
    data: {
      walletAddress?: string
    }
  }
} 