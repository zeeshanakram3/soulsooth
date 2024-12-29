"use client"

import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Coins } from "lucide-react"
import { checkCreditsAction } from "@/actions/db/profiles-actions"

interface CreditsDisplayProps {
  userId: string
  showWarning?: boolean
}

export default function CreditsDisplay({
  userId,
  showWarning = true
}: CreditsDisplayProps) {
  const [credits, setCredits] = useState<number | null>(null)

  useEffect(() => {
    async function fetchCredits() {
      const result = await checkCreditsAction(userId)
      if (result.isSuccess) {
        setCredits(result.data.credits)
      }
    }

    fetchCredits()
  }, [userId])

  if (credits === null) {
    return null
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <div className="flex flex-1 items-center gap-2">
          <Coins className="text-muted-foreground size-4" />
          <span className="text-sm font-medium">Meditation Credits</span>
        </div>
        <div className={credits === 0 ? "text-destructive" : "text-primary"}>
          <span className="text-sm font-medium">
            {credits === 0
              ? "No credits"
              : `${credits} credit${credits === 1 ? "" : "s"}`}
          </span>
        </div>
      </div>

      {showWarning && credits === 1 && (
        <Alert className="py-2">
          <AlertCircle className="size-4" />
          <AlertDescription>
            You have 1 credit remaining. Consider upgrading to Pro for unlimited
            meditations.
          </AlertDescription>
        </Alert>
      )}

      {showWarning && credits === 0 && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="size-4" />
          <AlertDescription>
            You have no credits remaining. Upgrade to Pro for unlimited
            meditations.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
