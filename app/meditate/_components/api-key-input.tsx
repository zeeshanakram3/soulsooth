"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Key } from "lucide-react"

interface ApiKeyInputProps {
  onApiKeyChange: (key: string | null) => void
}

export function ApiKeyInput({ onApiKeyChange }: ApiKeyInputProps) {
  const [useApiKey, setUseApiKey] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleApiKeyChange = (value: string) => {
    setApiKey(value)
    setError(null)

    if (value && !value.startsWith("sk-")) {
      setError("API key must start with 'sk-'")
      onApiKeyChange(null)
      return
    }

    onApiKeyChange(value || null)
  }

  const handleToggleChange = (checked: boolean) => {
    setUseApiKey(checked)
    if (!checked) {
      setApiKey("")
      onApiKeyChange(null)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <div className="flex flex-1 items-center gap-2">
          <Key className="text-muted-foreground size-4" />
          <Label htmlFor="use-api-key" className="text-sm font-medium">
            Use Personal OpenAI API Key
          </Label>
        </div>
        <Switch
          id="use-api-key"
          checked={useApiKey}
          onCheckedChange={handleToggleChange}
        />
      </div>

      {useApiKey && (
        <div className="space-y-2">
          <div className="text-muted-foreground text-sm">
            Get API key from{" "}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              platform.openai.com/api-keys
            </a>
          </div>
          <Input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={e => handleApiKeyChange(e.target.value)}
            placeholder="sk-..."
            className="font-mono"
          />
          {error && (
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="size-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  )
}
