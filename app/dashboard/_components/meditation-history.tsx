"use server"

import { getMeditationsByUserIdAction } from "@/actions/db/meditations-actions"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/ui/pagination"
import { Music2, Plus } from "lucide-react"
import MeditationCard from "./meditation-card"

interface MeditationHistoryProps {
  userId: string
  page: number
}

export default async function MeditationHistory({
  userId,
  page
}: MeditationHistoryProps) {
  const limit = 10

  const { data } = await getMeditationsByUserIdAction(userId, page, limit)

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-violet-500/10">
          <Music2 className="size-8 text-violet-500" />
        </div>
        <h3 className="mb-2 text-lg font-semibold">No Meditations Yet</h3>
        <p className="text-muted-foreground mb-6 max-w-sm text-base">
          Start your mindfulness journey by creating your first personalized
          meditation.
        </p>
        <Button
          className="gap-2 bg-gradient-to-r from-blue-600 to-violet-600"
          asChild
        >
          <a href="/meditate">
            <Plus className="size-4" />
            Start Meditating
          </a>
        </Button>
      </div>
    )
  }

  const { meditations, total } = data
  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        {meditations.map(meditation => (
          <MeditationCard key={meditation.id} meditation={meditation} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            page={page}
            totalPages={totalPages}
            baseUrl="/dashboard"
          />
        </div>
      )}
    </div>
  )
}
