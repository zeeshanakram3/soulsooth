"use server"

import { Button } from "@/components/ui/button"
import { Footer } from "@/components/ui/footer"
import { SignUpButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"
import { Brain, History, Sparkles } from "lucide-react"
import Link from "next/link"

export default async function LandingPage() {
  const { userId } = await auth()

  if (userId) {
    return (
      <>
        <div className="container">
          <section className="py-20 text-center">
            <h1 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl">
              Welcome Back to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                MeditateGPT
              </span>
            </h1>
            <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg sm:text-xl">
              Ready for your next meditation session? Choose an option below to
              continue your mindfulness journey.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild size="lg" className="gap-2">
                <Link href="/meditate">
                  <Brain className="size-4" />
                  Start Meditating
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href="/dashboard">
                  <History className="size-4" />
                  View History
                </Link>
              </Button>
            </div>
          </section>

          <section className="pb-20">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border p-6">
                <Brain className="mb-4 size-8 text-blue-600" />
                <h2 className="mb-2 text-xl font-semibold">New Meditation</h2>
                <p className="text-muted-foreground">
                  Start a new meditation session tailored to your current
                  emotional state.
                </p>
              </div>

              <div className="rounded-lg border p-6">
                <History className="mb-4 size-8 text-emerald-600" />
                <h2 className="mb-2 text-xl font-semibold">Past Sessions</h2>
                <p className="text-muted-foreground">
                  Review and replay your previous meditation sessions.
                </p>
              </div>

              <div className="rounded-lg border p-6">
                <Sparkles className="mb-4 size-8 text-violet-600" />
                <h2 className="mb-2 text-xl font-semibold">Daily Practice</h2>
                <p className="text-muted-foreground">
                  Build a consistent meditation practice with personalized
                  guidance.
                </p>
              </div>
            </div>
          </section>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <div className="container">
        <section className="py-20 text-center">
          <h1 className="mb-4 text-4xl font-bold sm:text-5xl md:text-6xl">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
              MeditateGPT
            </span>
          </h1>
          <p className="text-muted-foreground mx-auto mb-8 max-w-2xl text-lg sm:text-xl">
            Your personal AI meditation guide. Share your emotional state and
            let MeditateGPT create a custom meditation experience with
            personalized scripts and soothing audio guidance.
          </p>
          <SignUpButton mode="modal">
            <Button size="lg" className="gap-2">
              <Sparkles className="size-4" />
              Start Your Journey
            </Button>
          </SignUpButton>
        </section>

        <section className="pb-20">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border p-6">
              <Brain className="mb-4 size-8 text-blue-600" />
              <h2 className="mb-2 text-xl font-semibold">
                Personalized Meditations
              </h2>
              <p className="text-muted-foreground">
                Share your current emotional state, and our AI will create a
                meditation script perfectly suited to your needs.
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <Sparkles className="mb-4 size-8 text-violet-600" />
              <h2 className="mb-2 text-xl font-semibold">
                AI Voice Generation
              </h2>
              <p className="text-muted-foreground">
                Listen to your meditation script brought to life with soothing,
                natural-sounding AI voice guidance.
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <History className="mb-4 size-8 text-emerald-600" />
              <h2 className="mb-2 text-xl font-semibold">Track Your Journey</h2>
              <p className="text-muted-foreground">
                Access your meditation history, replay past sessions, and see
                how your practice evolves over time.
              </p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
