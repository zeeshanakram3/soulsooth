"use server"

import fs from "fs"
import path from "path"

export default async function PrivacyPage() {
  const privacyContent = fs.readFileSync(
    path.join(process.cwd(), "app/privacy/privacy-content.txt"),
    "utf-8"
  )

  return (
    <div className="container max-w-4xl py-12">
      <div className="prose prose-sm dark:prose-invert">
        <pre className="whitespace-pre-wrap font-sans">{privacyContent}</pre>
      </div>
    </div>
  )
}
