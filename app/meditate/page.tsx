"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import UserInputForm from "./_components/user-input-form"
import CreditsDisplay from "@/components/ui/credits-display"
import { Feather, Sparkles } from "lucide-react"

export default async function MeditatePage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/login")
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      {/* Enhanced Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2">
          <div className="h-[600px] w-[1200px] rounded-full bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-violet-500/10 blur-3xl" />
        </div>
        <div className="absolute right-0 top-1/4">
          <div className="size-[400px] rounded-full bg-blue-400/10 blur-3xl" />
        </div>
        <div className="absolute bottom-0 left-0">
          <div className="size-[400px] rounded-full bg-violet-400/10 blur-3xl" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid h-full grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Column */}
          <div className="w-full" id="input-container">
            {/* Header Section with enhanced styling */}
            <div className="mb-8">
              <div className="mb-4 inline-flex items-center gap-3 rounded-2xl bg-white/50 p-2 backdrop-blur-sm">
                <div className="flex size-12 items-center justify-center rounded-xl bg-violet-500/10">
                  <Feather className="size-6 text-violet-500" />
                </div>
                <h1 className="text-3xl font-bold sm:text-4xl">
                  Generate a Meditation
                </h1>
              </div>
              <p className="text-muted-foreground mt-4 max-w-xl text-lg">
                Tell us how you're feeling and we'll generate a personalized
                meditation just for you.
              </p>
            </div>

            {/* Main Input Card with enhanced styling */}
            <div className="rounded-2xl border border-gray-100 bg-white/50 p-8 shadow-sm backdrop-blur-sm">
              <div className="space-y-8">
                {/* Credits Display with enhanced styling */}
                <div>
                  <CreditsDisplay userId={userId} />
                </div>

                {/* Form Component */}
                <UserInputForm userId={userId} />
              </div>
            </div>
          </div>

          {/* Right Column - Meditation Display with enhanced styling */}
          <div
            id="meditation-container"
            className="hidden h-full rounded-2xl border border-gray-100 bg-white/60 p-8 shadow-sm backdrop-blur-sm lg:block"
          />
        </div>
      </div>
    </div>
  )
}
