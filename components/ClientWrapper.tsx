"use client";
import { useEffect, useState } from "react";
import LoadingScreen from "./Loading";
import Cursor from "@/components/ui/Cursor";
import Navbar from "@/components/ui/navbar";
import ProfileView from "@/components/ProfileView";



export default function ClientWrapper({ children }) {
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

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <>
        
          <Cursor />
          <Navbar />
          <ProfileView />
        </>
      )}
      {!isLoading && children}
    </>
  );
}
