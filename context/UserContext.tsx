"use client";

import { createContext, useContext, ReactNode } from "react";
import { Models } from "node-appwrite";

// Define the type for the user object
interface UserContextType {
  currentUser: Models.Document | null;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Hook to access the user context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

// Provider component
export const UserProvider = ({
  currentUser,
  children,
}: {
  currentUser: Models.Document | null;
  children: ReactNode;
}) => {
  return (
    <UserContext.Provider value={{ currentUser }}>
      {children}
    </UserContext.Provider>
  );
};
