"use client";
import Link from "next/link";
import { ArrowRight, Code, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      router.push("/dashboard");
    }
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center px-4 pt-16">
        <div className="container flex max-w-5xl flex-col items-center justify-center gap-8 py-16 md:py-24">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Track Coding Contests
            </h1>
            <p className="max-w-[42rem] text-muted-foreground sm:text-xl">
              Stay updated with the latest contests from LeetCode, CodeForces,
              CodeChef and more. Never miss a coding competition again!
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/signup">
              <Button size="lg" className="gap-2">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/signin">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                icon: <Code className="h-8 w-8 text-primary" />,
                title: "Multiple Platforms",
                description:
                  "Track contests from LeetCode, CodeForces, CodeChef and more in one place.",
              },
              {
                icon: <Trophy className="h-8 w-8 text-primary" />,
                title: "Live Countdowns",
                description:
                  "See exactly when contests start with live countdowns in your local time.",
              },
              {
                icon: <Code className="h-8 w-8 text-primary" />,
                title: "Bookmark Contests",
                description:
                  "Save contests you're interested in and get quick access to them.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 rounded-lg border border-border/50 bg-card p-6 text-center shadow-sm transition-all hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
