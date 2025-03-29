"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { MiniKit } from "@worldcoin/minikit-js";

export type User = {
  walletAddress: string;
  username: string | null;
  profilePictureUrl: string | null;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  logout: () => void;
  syncWithMiniKit: () => void;
};

// Create context with default values
const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  isLoading: true,
  logout: () => {},
  syncWithMiniKit: () => {},
});

// Local storage key
const USER_STORAGE_KEY = "worldagents_user";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to update user - no localStorage persistence
  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    // Skip localStorage persistence to force authentication each time
  };

  // Function to log user out
  const logout = () => {
    setUser(null);
    // Clear any cookies that might be set
    document.cookie =
      "auth-session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };

  // Function to sync with MiniKit user data
  const syncWithMiniKit = () => {
    if (
      MiniKit.isInstalled() &&
      MiniKit.user &&
      typeof MiniKit.user.walletAddress === "string"
    ) {
      setUser({
        walletAddress: MiniKit.user.walletAddress,
        username: MiniKit.user.username || null,
        profilePictureUrl: MiniKit.user.profilePictureUrl || null,
      });
    }
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, isLoading, logout, syncWithMiniKit }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Hook to use the user context
export const useUser = () => useContext(UserContext);

// Helper hook to get just the user data
export const useUserData = () => {
  const { user } = useUser();
  return user;
};