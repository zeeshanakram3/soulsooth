"use server"

import { getMeditationsByUserIdAction } from "@/actions/db/meditations-actions"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/ui/pagination"
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
      <div className="py-8 text-center">
        <p className="text-muted-foreground text-lg">
          No meditations found. Start your first meditation now!
        </p>
        <Button className="mt-4" asChild>
          <a href="/meditate">Start Meditating</a>
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
        <Pagination page={page} totalPages={totalPages} baseUrl="/dashboard" />
      )}
    </div>
  )
}
