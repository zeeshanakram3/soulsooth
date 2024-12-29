"use server"

import { cookies } from "next/headers"
import { ActionState } from "@/types"

const API_KEY_COOKIE = "openai-api-key"

export async function setApiKeyAction(
  apiKey: string | null
): Promise<ActionState<void>> {
  try {
    if (!apiKey) {
      cookies().delete(API_KEY_COOKIE)
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

    cookies().set(API_KEY_COOKIE, apiKey, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/"
    })

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
    const apiKey = cookies().get(API_KEY_COOKIE)?.value

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