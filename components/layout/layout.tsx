import React from "react";
import { useEntryStore } from "../../hooks/useEntryStore";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isLoading } = useEntryStore();
  return <>{isLoading ? <h1>Loading...</h1> : <>{children}</>}</>;
};
