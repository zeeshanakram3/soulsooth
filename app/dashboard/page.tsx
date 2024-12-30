"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import MeditationHistory from "./_components/meditation-history"
import MeditationHistorySkeleton from "./_components/meditation-history-skeleton"
import CreditsDisplay from "@/components/ui/credits-display"
import { History, Star } from "lucide-react"

interface DashboardPageProps {
  searchParams: Promise<{ page?: string }>
}

export default async function DashboardPage({
  searchParams
}: DashboardPageProps) {
  const { userId } = await auth()
  const params = await searchParams

  if (!userId) {
    redirect("/login")
  }

  const page = params.page ? parseInt(params.page) : 1

  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2">
          <div className="h-[500px] w-[1000px] rounded-full bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-violet-500/10 blur-3xl" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div>
            <CreditsDisplay userId={userId} />
          </div>
        </div>

        {/* Title Section */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-violet-500/10">
              <History className="size-6 text-violet-500" />
            </div>
            <h1 className="text-3xl font-bold sm:text-4xl">
              Your Meditation History
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Review and replay your past meditation sessions. Click on any
            meditation to expand and listen to it again.
          </p>
        </div>

        {/* History Section */}
        <div className="rounded-xl border bg-white/50 p-6 backdrop-blur-sm">
          <Suspense fallback={<MeditationHistorySkeleton />}>
            <MeditationHistory userId={userId} page={page} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
