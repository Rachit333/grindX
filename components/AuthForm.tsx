// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { auth, googleProvider, githubProvider } from "@/lib/firebase";
// import {
//   signInWithPopup,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   onAuthStateChanged
// } from "firebase/auth";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Separator } from "@/components/ui/separator";

// import { User } from "firebase/auth";

// export default function AuthForm() {
//   const [isSignUp, setIsSignUp] = useState(true);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [name, setName] = useState("");
//   const [error, setError] = useState("");
//   const [user, setUser] = useState<User | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     setError("");
//   }, [isSignUp]);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       if (currentUser) {
//         setUser(currentUser);
//         router.push("/");
//       }
//     });
//     return () => unsubscribe();
//   }, [router]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     try {
//       if (isSignUp) {
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//         console.log("User signed up:", userCredential.user);
//         router.push("/");
//       } else {
//         const userCredential = await signInWithEmailAndPassword(auth, email, password);
//         console.log("User signed in:", userCredential.user);
//         router.push("/");
//       }
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   const handleGoogleAuth = async () => {
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       console.log("Google Sign-In successful:", result.user);
//       router.push("/");
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   const handleGitHubAuth = async () => {
//     try {
//       const result = await signInWithPopup(auth, githubProvider);
//       console.log("GitHub Sign-In successful:", result.user);
//       router.push("/");
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   return (
//     <Card className="w-[350px] sensitive-cursor">
//       <CardHeader>
//         <CardTitle>{isSignUp ? "Create an account" : "Welcome back"}</CardTitle>
//         <CardDescription>
//           {isSignUp ? "Enter your details below to create your account" : "Enter your credentials to access your account"}
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Tabs value={isSignUp ? "signup" : "signin"} className="w-full">
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="signup" onClick={() => setIsSignUp(true)}>Sign Up</TabsTrigger>
//             <TabsTrigger value="signin" onClick={() => setIsSignUp(false)}>Sign In</TabsTrigger>
//           </TabsList>
//           <TabsContent value="signup">
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {error && <p className="text-red-500 text-sm">{error}</p>}
//               <div className="space-y-2">
//                 <Label htmlFor="name">Name</Label>
//                 <Input id="name" type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <Input id="email" type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//               </div>
//               <Button type="submit" className="w-full">Create Account</Button>
//             </form>
//           </TabsContent>
//           <TabsContent value="signin">
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {error && <p className="text-red-500 text-sm">{error}</p>}
//               <div className="space-y-2">
//                 <Label htmlFor="signin-email">Email</Label>
//                 <Input id="signin-email" type="email" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="signin-password">Password</Label>
//                 <Input id="signin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
//               </div>
//               <Button type="submit" className="w-full">Sign In</Button>
//             </form>
//           </TabsContent>
//         </Tabs>
//         <Separator className="my-4" />
//         <div className="space-y-4">
//           <Button variant="outline" className="w-full" onClick={handleGoogleAuth}>
//             Sign {isSignUp ? "up" : "in"} with Google
//           </Button>
//           <Button variant="outline" className="w-full" onClick={handleGitHubAuth}>
//             Sign {isSignUp ? "up" : "in"} with GitHub
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, googleProvider, githubProvider } from "@/lib/firebase";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Github, Eye, EyeOff } from "lucide-react"


import type { User } from "firebase/auth";

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter();

  useEffect(() => {
    setError("");
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log("User signed up:", userCredential.user);
        router.push("/");
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log("User signed in:", userCredential.user);
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google Sign-In successful:", result.user);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleGitHubAuth = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      console.log("GitHub Sign-In successful:", result.user);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Card className="w-[350px] shadow-lg sensitive-cursor">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          {isSignUp ? "Create an account" : "Welcome back"}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {isSignUp
            ? "Enter your details to create your account"
            : "Enter your credentials to access your account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={isSignUp ? "signup" : "signin"} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="signup" onClick={() => setIsSignUp(true)}>
              Sign Up
            </TabsTrigger>
            <TabsTrigger value="signin" onClick={() => setIsSignUp(false)}>
              Sign In
            </TabsTrigger>
          </TabsList>
          <TabsContent value="signup">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Ligma Bawls"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="sigmaboi@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="off"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pr-10"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="signin">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="space-y-2">
                <Label htmlFor="signin-email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="sigmaboi@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="off"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="signin-password"
                  className="text-sm font-medium"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    className="w-full pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        <div className="relative my-4">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-2 text-xs text-muted-foreground">
            Or continue with
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 items-center">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleAuth}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Google
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGitHubAuth}
          >
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
