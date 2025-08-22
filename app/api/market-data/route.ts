import { type NextRequest, NextResponse } from "next/server"
import { HyperliquidClient } from "@/lib/hyperliquid-client"
import type { ApiError } from "@/lib/types"

/**
 * GET /api/market-data
 * Fetch market data for a specific asset
 * Query params: asset (string) - The asset symbol (e.g., "BTC", "ETH")
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const asset = searchParams.get("asset")

    if (!asset) {
      return NextResponse.json({ error: "Asset parameter is required", code: 400 } as ApiError, { status: 400 })
    }

    const apiKey = process.env.HYPERLIQUID_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Hyperliquid API key not configured", code: 500 } as ApiError, { status: 500 })
    }

    const client = new HyperliquidClient(apiKey)
    const marketData = await client.getMarketData(asset.toUpperCase())

    return NextResponse.json(marketData, {
      headers: {
        "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30",
      },
    })
  } catch (error: any) {
    console.error("Market data API error:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch market data",
        code: 500,
        details: error.message,
      } as ApiError,
      { status: 500 },
    )
  }
}
