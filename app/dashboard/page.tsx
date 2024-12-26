"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import MeditationHistory from "./_components/meditation-history"
import MeditationHistorySkeleton from "./_components/meditation-history-skeleton"

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
    <div className="container py-8">
      <h1 className="mb-8 text-4xl font-bold">Your Meditation History</h1>

      <Suspense fallback={<MeditationHistorySkeleton />}>
        <MeditationHistory userId={userId} page={page} />
      </Suspense>
    </div>
  )
}
