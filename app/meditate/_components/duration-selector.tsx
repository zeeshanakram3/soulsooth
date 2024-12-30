"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DurationSelectorProps {
  duration: number
  onChange: (duration: number) => void
  disabled?: boolean
}

const durations = [
  { value: 1, label: "1 min" },
  { value: 2, label: "2 min" },
  { value: 5, label: "5 min" },
  { value: 10, label: "10 min" }
]

export default function DurationSelector({
  duration,
  onChange,
  disabled
}: DurationSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {durations.map(({ value, label }) => (
          <Button
            key={value}
            type="button"
            variant={duration === value ? "default" : "outline"}
            onClick={() => onChange(value)}
            disabled={disabled}
            className={cn(
              "min-w-[80px] flex-1",
              duration === value && "bg-blue-600 hover:bg-blue-700"
            )}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  )
}
