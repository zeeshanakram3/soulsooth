"use client"

import { Button } from "@/components/ui/button"
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs"
import { Brain, History, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Nav() {
  const { isSignedIn } = useAuth()
  const pathname = usePathname()

  return (
    <nav className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold">
            MindfulAI
          </Link>

          <div className="flex items-center gap-4">
            <Button
              variant={pathname === "/" ? "default" : "ghost"}
              size="sm"
              asChild
            >
              <Link href="/" className="gap-2">
                <Home className="size-4" />
                Home
              </Link>
            </Button>

            {isSignedIn && (
              <>
                <Button
                  variant={pathname === "/meditate" ? "default" : "ghost"}
                  size="sm"
                  asChild
                >
                  <Link href="/meditate" className="gap-2">
                    <Brain className="size-4" />
                    Meditate
                  </Link>
                </Button>

                <Button
                  variant={pathname === "/dashboard" ? "default" : "ghost"}
                  size="sm"
                  asChild
                >
                  <Link href="/dashboard" className="gap-2">
                    <History className="size-4" />
                    History
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </SignInButton>

              <SignUpButton mode="modal">
                <Button size="sm">Get Started</Button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
