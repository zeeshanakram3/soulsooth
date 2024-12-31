/*
<ai_context>
This client component provides the providers for the app.
</ai_context>
*/

"use client"

import * as React from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps
} from "next-themes"
import { CSPostHogProvider } from "./posthog/posthog-provider"

export const Providers = ({ children, ...props }: ThemeProviderProps) => {
  return (
    <NextThemesProvider {...props}>
      <TooltipProvider>
        <CSPostHogProvider>{children}</CSPostHogProvider>
      </TooltipProvider>
    </NextThemesProvider>
  )
}
