import { type NextRequest, NextResponse } from "next/server"
import { HyperliquidClient } from "@/lib/hyperliquid-client"
import type { ApiError } from "@/lib/types"

/**
 * GET /api/user-state
 * Get user's trading state and positions
 * Query params: user (string) - User address
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user = searchParams.get("user")

    if (!user) {
      return NextResponse.json({ error: "User address parameter is required", code: 400 } as ApiError, { status: 400 })
    }

    const apiKey = process.env.HYPERLIQUID_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Hyperliquid API key not configured", code: 500 } as ApiError, { status: 500 })
    }

    const client = new HyperliquidClient(apiKey)
    const userState = await client.getUserState(user)

    return NextResponse.json(userState, {
      headers: {
        "Cache-Control": "private, s-maxage=5, stale-while-revalidate=10",
      },
    })
  } catch (error: any) {
    console.error("User state API error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch user state",
        code: 500,
        details: error.message,
      } as ApiError,
      { status: 500 },
    )
  }
}
