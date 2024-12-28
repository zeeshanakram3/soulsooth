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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <CreditsDisplay userId={userId} />
      </div>

      <h1 className="mb-8 text-4xl font-bold">Generate a Meditation</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Tell us how you're feeling and we'll generate a personalized meditation
        just for you.
      </p>

      <UserInputForm userId={userId} />
    </div>
  )
}
