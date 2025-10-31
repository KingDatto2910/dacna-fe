"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { verifyUser } from "@/lib/users";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const user = verifyUser(email, password);
    if (user) {
      //Might add pop up notification for successful login
      router.push("/home");
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center py-12 md:py-24 lg:py-32">
        <form onSubmit={handleLogin} className="w-full max-w-lg">
          <Card className="w-full">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Welcome back! Please sign in to continue.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="password123"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && (
                <p className="text-sm font-medium text-destructive">{error}</p>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full">
                Sign In
              </Button>
              <div className="text-center text-sm">
                <Link href="#" className="underline">
                  Forgot your password?
                </Link>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
      <Footer />
    </>
  );
}
