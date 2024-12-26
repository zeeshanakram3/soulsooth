"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Button } from "./button"

interface PaginationProps {
  page: number
  totalPages: number
  baseUrl: string
}

export function Pagination({ page, totalPages, baseUrl }: PaginationProps) {
  return (
    <div className="flex items-center justify-center space-x-6">
      <Button variant="outline" size="icon" asChild disabled={page <= 1}>
        <Link href={`${baseUrl}?page=${page - 1}`} aria-label="Previous page">
          <ChevronLeft className="size-4" />
        </Link>
      </Button>

      <div className="text-sm">
        Page {page} of {totalPages}
      </div>

      <Button
        variant="outline"
        size="icon"
        asChild
        disabled={page >= totalPages}
      >
        <Link href={`${baseUrl}?page=${page + 1}`} aria-label="Next page">
          <ChevronRight className="size-4" />
        </Link>
      </Button>
    </div>
  )
}
