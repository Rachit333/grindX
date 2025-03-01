"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, LogOut, Settings } from "lucide-react";
import { cn } from "@/lib/utils"; 

export default function AuthComponent() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false); 
  const router = useRouter();

  async function getAuthToken() {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (!user) {
          reject(new Error(""));
        } else {
          const token = await user.getIdToken();
          resolve(token);
        }
        unsubscribe();
      });
    });
  }

  async function fetchUser() {
    try {
      setLoading(true);
      const token = await getAuthToken();

      const { data } = await axios.get("/api/saveUserData", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!data.success)
        throw new Error(data.message || "Failed to fetch user");

      setUser(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;

  if (!user && !loading) return null;

  return (
    <div className="fixed top-4 right-4 z-10 sensitive-cursor">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-12 w-12 rounded-full bg-white sensitive-cursor"
          >
            <Avatar className="h-12 w-12">
              {loading ? (
                
                <div className="w-12 h-12 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              ) : (
                <>
                  <AvatarImage
                    src={user?.profilePicture}
                    className={cn(
                      "h-12 w-12 opacity-0 scale-90 transition-all duration-500",
                      imageLoaded && "opacity-100 scale-100"
                    )}
                    onLoad={() => setImageLoaded(true)} 
                  />
                  <AvatarFallback>
                    {user?.name?.charAt(0) || "?"}
                  </AvatarFallback>
                </>
              )}
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="w-56 bg-white sensitive-cursor"
          align="end"
          forceMount
        >
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
