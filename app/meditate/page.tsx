"use server"

import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import UserInputForm from "./_components/user-input-form"
import CreditsDisplay from "@/components/ui/credits-display"

export default async function MeditatePage() {
  const { userId } = await auth()

  if (!userId) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto h-[calc(100vh-4rem)] px-4 py-8">
      <div className="grid h-full grid-cols-1 gap-8 lg:grid-cols-[1fr,600px]">
        {/* Left Column */}
        <div
          className="mx-auto w-full max-w-2xl lg:max-w-none"
          id="input-container"
        >
          <div className="mb-6">
            <h1 className="mb-4 text-3xl font-bold">Generate a Meditation</h1>
            <p className="text-muted-foreground">
              Tell us how you're feeling and we'll generate a personalized
              meditation just for you.
            </p>
          </div>

          <div className="space-y-4">
            <CreditsDisplay userId={userId} />
            <UserInputForm userId={userId} />
          </div>
        </div>

        {/* Right Column */}
        <div id="meditation-container" className="hidden h-full lg:block" />
      </div>
    </div>
  )
}
