"use server"

import { cookies } from "next/headers"
import { ActionState } from "@/types"

const API_KEY_COOKIE = "openai-api-key"

export async function setApiKeyAction(
  apiKey: string | null
): Promise<ActionState<void>> {
  try {
    const cookieStore = await cookies()

    if (!apiKey) {
      cookieStore.delete(API_KEY_COOKIE)
      return {
        isSuccess: true,
        message: "API key removed successfully",
        data: undefined
      }
    }

    if (!apiKey.startsWith("sk-")) {
      return {
        isSuccess: false,
        message: "Invalid API key format"
      }
    }

    cookieStore.set(API_KEY_COOKIE, apiKey)

    return {
      isSuccess: true,
      message: "API key stored successfully",
      data: undefined
    }
  } catch (error) {
    console.error("Error setting API key:", error)
    return {
      isSuccess: false,
      message: "Failed to store API key"
    }
  }
}

export async function getApiKeyAction(): Promise<ActionState<string | null>> {
  try {
    const cookieStore = await cookies()
    const apiKey = cookieStore.get(API_KEY_COOKIE)?.value

    return {
      isSuccess: true,
      message: "API key retrieved successfully",
      data: apiKey || null
    }
  } catch (error) {
    console.error("Error getting API key:", error)
    return {
      isSuccess: false,
      message: "Failed to retrieve API key"
    }
  }
} 