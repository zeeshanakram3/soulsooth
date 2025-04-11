"use client"

import { Button } from "@/components/ui/button"
import { SignInButton, SignUpButton, UserButton, useAuth } from "@clerk/nextjs"
import { Brain, History, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function Nav() {
  const { isSignedIn } = useAuth()
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`bg-background/80 sticky top-0 z-50 border-b backdrop-blur-md transition-all duration-200 ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold transition-colors hover:text-blue-600"
          >
            <Brain className="size-6 text-blue-600" />
            SoulSooth
          </Link>

          <div className="flex items-center gap-4">
            <Button
              variant={pathname === "/" ? "default" : "ghost"}
              size="sm"
              asChild
              className="transition-all duration-200 hover:scale-105"
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
                  className="transition-all duration-200 hover:scale-105"
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
                  className="transition-all duration-200 hover:scale-105"
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

        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {isSignedIn ? (
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox:
                    "size-8 hover:scale-105 transition-all duration-200"
                }
              }}
            />
          ) : (
            <>
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  size="sm"
                  className="transition-all duration-200 hover:scale-105"
                >
                  Log In
                </Button>
              </SignInButton>

              <SignUpButton mode="modal">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-violet-600 transition-all duration-200 hover:scale-105"
                >
                  Sign up
                </Button>
              </SignUpButton>
            </>
          )}
        </motion.div>
      </div>
    </motion.nav>
  )
}
