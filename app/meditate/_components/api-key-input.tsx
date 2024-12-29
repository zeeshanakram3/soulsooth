"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

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
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="use-api-key" className="text-sm font-medium">
          Use Personal OpenAI API Key
        </Label>
        <Switch
          id="use-api-key"
          checked={useApiKey}
          onCheckedChange={handleToggleChange}
        />
      </div>

      {useApiKey && (
        <div className="space-y-2">
          <Label htmlFor="api-key">OpenAI API Key</Label>
          <Input
            id="api-key"
            type="password"
            value={apiKey}
            onChange={e => handleApiKeyChange(e.target.value)}
            placeholder="sk-..."
            className="font-mono"
          />
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  )
}
