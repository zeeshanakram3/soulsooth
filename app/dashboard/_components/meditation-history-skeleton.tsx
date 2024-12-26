"use client"

import { Skeleton } from "@/components/ui/skeleton"

export default function MeditationHistorySkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="space-y-4 rounded-lg border p-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-10 w-48" />
        </div>
      ))}
    </div>
  )
}
