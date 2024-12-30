"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import UserInputForm from "./_components/user-input-form"
import CreditsDisplay from "@/components/ui/credits-display"
import { Brain, Sparkles } from "lucide-react"

export default async function MeditatePage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/login")
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2">
          <div className="h-[500px] w-[1000px] rounded-full bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-violet-500/10 blur-3xl" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid h-full grid-cols-1 gap-8 lg:grid-cols-[1fr,600px]">
          {/* Left Column */}
          <div
            className="mx-auto w-full max-w-2xl lg:max-w-none"
            id="input-container"
          >
            <div className="mb-8">
              <div className="mb-2 flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-blue-500/10">
                  <Brain className="size-6 text-blue-500" />
                </div>
                <h1 className="text-3xl font-bold sm:text-4xl">
                  Generate a Meditation
                </h1>
              </div>
              <p className="text-muted-foreground mt-4 text-lg">
                Tell us how you're feeling and we'll generate a personalized
                meditation just for you.
              </p>
            </div>

            <div className="rounded-xl border bg-white/50 p-6 backdrop-blur-sm">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
                    <Sparkles className="size-5 text-violet-500" />
                  </div>
                  <CreditsDisplay userId={userId} />
                </div>
                <UserInputForm userId={userId} />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div
            id="meditation-container"
            className="hidden h-full rounded-xl border bg-white/50 p-6 backdrop-blur-sm lg:block"
          />
        </div>
      </div>
    </div>
  )
}
