"use server"

import fs from "fs"
import path from "path"

export default async function TermsPage() {
  const termsContent = fs.readFileSync(
    path.join(process.cwd(), "app/terms/terms-content.txt"),
    "utf-8"
  )

  return (
    <div className="container max-w-4xl py-12">
      <div className="prose prose-sm dark:prose-invert">
        <pre className="whitespace-pre-wrap font-sans">{termsContent}</pre>
      </div>
    </div>
  )
}
