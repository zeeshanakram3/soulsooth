"use client"

import { useEffect, useState } from "react"
import { checkCreditsAction } from "@/actions/db/profiles-actions"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

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
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <h3 className="text-sm font-medium tracking-tight">
            Meditation Credits
          </h3>
          <p className="text-muted-foreground text-sm">
            {credits === 0
              ? "No credits remaining"
              : `${credits} credit${credits === 1 ? "" : "s"} remaining`}
          </p>
        </div>
        <div
          className={`text-2xl font-bold ${
            credits === 0 ? "text-destructive" : "text-primary"
          }`}
        >
          {credits}
        </div>
      </div>

      {showWarning && credits === 1 && (
        <Alert>
          <AlertCircle className="size-4" />
          <AlertDescription>
            You have 1 credit remaining. Consider upgrading to Pro for unlimited
            meditations.
          </AlertDescription>
        </Alert>
      )}

      {showWarning && credits === 0 && (
        <Alert variant="destructive">
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
