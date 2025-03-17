"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Code, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showSuccessNotification } from "@/components/success-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserInputData } from "@/types/types";
import { useSignInHook } from "@/hooks/signin";

export default function SignInPage() {
  const router = useRouter();
  const { isLoading, loginUser } = useSignInHook();

  const [formData, setFormData] = useState<UserInputData>({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await loginUser(formData);
    if (result) {
      const authToken = result.authToken;
      localStorage.setItem("authToken", authToken);
      router.push("/dashboard");
      showSuccessNotification("Signed in successfully!");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      router.push("/dashboard");
    }
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <Link href="/" className="mb-8 flex items-center gap-2">
            <motion.div
              initial={{ rotate: -20 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <Code className="h-8 w-8 text-primary" />
            </motion.div>
            <span className="text-2xl font-bold">ContestTracker</span>
          </Link>
          <h1 className="text-2xl font-bold">Sign in to your account</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-lg border bg-card p-6 shadow-sm"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="Enter your username"
                required
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </motion.div>
        <div className="mt-6 flex justify-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
