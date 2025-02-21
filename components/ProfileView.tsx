"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { User, LogOut, Settings } from "lucide-react";
import { Users } from "firebase/auth"; 

const getRandomAvatarUrl = () => {
  const getRandom = (max = 10) => Math.floor(Math.random() * max) + 1;

  const params = new URLSearchParams(
    Object.entries({
      face: getRandom(),
      nose: getRandom(),
      mouth: getRandom(),
      eyes: getRandom(),
      eyebrows: getRandom(),
      glasses: getRandom(),
      hair: getRandom(),
      accessories: getRandom(),
      details: getRandom(),
      beard: getRandom(),
      halloween: "0",
      christmas: "0",
    }).map(([key, value]) => [key, value.toString()]) // Convert numbers to strings
  );

  return `https://notion-avatars.netlify.app/api/avatar/?${params.toString()}`;
};


export default function AuthComponent() {
  const [user, setUser] = useState<Users | null>(null);
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setAvatarUrl(getRandomAvatarUrl());
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleDropdownOpen = () => {
      document.body.style.overflow = "auto";
    };

    handleDropdownOpen();

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user) {
    return (
      <Button
        onClick={() => router.push("/login")}
        className="bg-white text-black hover:bg-gray-100 transition fixed top-4 right-4 sensitive-cursor"
      >
        Log in
      </Button>
    );
  }

  const handleCursorReset = () => {
    document.documentElement.dataset.cursorTheme = "default";
  };

  return (
    <div className="fixed top-4 right-4 cursor-none sensitive-cursor z-10">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-12 w-12 rounded-full bg-white"
          >
            <Avatar className="h-12 w-12">
              <AvatarImage src={avatarUrl} className="h-12 w-12" />
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 bg-white sensitive-cursor cursor-none"
          align="end"
          forceMount
          onClick={() =>
            (document.documentElement.dataset.cursorTheme = "default")
          }
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.displayName || "User"}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() =>
              (document.documentElement.dataset.cursorTheme = "default")
            }
          >
            <User className="mr-2 h-4 w-4" />
            <span className="cursor-none">Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              (document.documentElement.dataset.cursorTheme = "default")
            }
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              document.documentElement.dataset.cursorTheme = "default";
              handleLogout();
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
