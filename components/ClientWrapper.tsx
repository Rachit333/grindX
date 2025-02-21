"use client";
import { useEffect, useState, ReactNode } from "react";
import LoadingScreen from "./Loading";
import Cursor from "@/components/ui/Cursor";
import Navbar from "@/components/ui/navbar";
import ProfileView from "@/components/ProfileView";

interface ClientWrapperProps {
  children: ReactNode;
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => setIsLoading(false);

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Cursor />
      <Navbar />
      <ProfileView />
      {children}
    </>
  );
}
