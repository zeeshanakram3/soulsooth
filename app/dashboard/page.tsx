"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import MeditationHistory from "./_components/meditation-history"
import MeditationHistorySkeleton from "./_components/meditation-history-skeleton"
import CreditsDisplay from "@/components/ui/credits-display"

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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <CreditsDisplay userId={userId} />
      </div>

      <h1 className="mb-8 text-4xl font-bold">Your Meditation History</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Review and replay your past meditation sessions. Click on any meditation
        to expand and listen to it again.
      </p>

      <Suspense fallback={<MeditationHistorySkeleton />}>
        <MeditationHistory userId={userId} page={page} />
      </Suspense>
    </div>
  )
}
