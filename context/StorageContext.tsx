"use client";

import React, { createContext, useContext } from "react";

// Create the context with an object
interface StorageContextType {
  storageUsed: number;
}

const StorageContext = createContext<StorageContextType | null>(null);

export const useStorage = () => {
  const context = useContext(StorageContext);
  if (context === null) {
    throw new Error("useStorage must be used within a StorageProvider");
  }
  return context;
};

export const StorageProvider = ({
  storageUsed,
  children,
}: {
  storageUsed: number;
  children: React.ReactNode;
}) => {
  return (
    <StorageContext.Provider value={{ storageUsed }}>
      {children}
    </StorageContext.Provider>
  );
};
