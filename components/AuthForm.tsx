"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import Next.js Router
import { auth, googleProvider, githubProvider } from "@/lib/firebase";
import { 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged 
} from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const router = useRouter(); 

  useEffect(() => {
    setError(""); 
  }, [isSignUp]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        router.push("/"); // Redirect to Home Page after login
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("User signed up:", userCredential.user);
        router.push("/"); // Redirect after signup
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("User signed in:", userCredential.user);
        router.push("/"); // Redirect after login
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google Sign-In successful:", result.user);
      router.push("/"); // Redirect after login
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGitHubAuth = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      console.log("GitHub Sign-In successful:", result.user);
      router.push("/"); // Redirect after login
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{isSignUp ? "Create an account" : "Welcome back"}</CardTitle>
        <CardDescription>
          {isSignUp ? "Enter your details below to create your account" : "Enter your credentials to access your account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={isSignUp ? "signup" : "signin"} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signup" onClick={() => setIsSignUp(true)}>Sign Up</TabsTrigger>
            <TabsTrigger value="signin" onClick={() => setIsSignUp(false)}>Sign In</TabsTrigger>
          </TabsList>
          <TabsContent value="signup">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full">Create Account</Button>
            </form>
          </TabsContent>
          <TabsContent value="signin">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input id="signin-email" type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input id="signin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full">Sign In</Button>
            </form>
          </TabsContent>
        </Tabs>
        <Separator className="my-4" />
        <div className="space-y-4">
          <Button variant="outline" className="w-full" onClick={handleGoogleAuth}>
            Sign {isSignUp ? "up" : "in"} with Google
          </Button>
          <Button variant="outline" className="w-full" onClick={handleGitHubAuth}>
            Sign {isSignUp ? "up" : "in"} with GitHub
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
