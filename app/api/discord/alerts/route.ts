import { type NextRequest, NextResponse } from "next/server"
import { createDiscordService } from "@/lib/discord"
import { getRecentTransactions, getTransactionStats } from "@/lib/database"
import type { ApiError } from "@/lib/types"

/**
 * POST /api/discord/alerts
 * Send various Discord alerts
 * Body: {
 *   type: "daily_summary" | "market_alert" | "system_alert",
 *   data: any // Type-specific data
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    if (!type) {
      return NextResponse.json({ error: "Alert type is required", code: 400 } as ApiError, { status: 400 })
    }

    const service = createDiscordService()
    if (!service) {
      return NextResponse.json({ error: "Discord webhook not configured", code: 400 } as ApiError, { status: 400 })
    }

    switch (type) {
      case "daily_summary": {
        // Get today's trading stats
        const stats = await getTransactionStats()
        const recentTransactions = await getRecentTransactions(100)

        // Calculate top asset
        const assetCounts = recentTransactions.reduce(
          (acc, tx) => {
            acc[tx.asset] = (acc[tx.asset] || 0) + 1
            return acc
          },
          {} as Record<string, number>,
        )

        const topAsset = Object.entries(assetCounts).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A"

        await service.sendDailySummary({
          totalTrades: stats.totalTransactions,
          successfulTrades: stats.completedTransactions,
          totalVolume: stats.totalVolume,
          topAsset,
          pnl: data.pnl, // Optional P&L data
        })
        break
      }

      case "market_alert": {
        if (!data.marketData) {
          return NextResponse.json({ error: "Market data is required for market alerts", code: 400 } as ApiError, {
            status: 400,
          })
        }

        await service.sendMarketAlert(data.marketData, data.alertType || "significant_change", data.threshold)
        break
      }

      case "system_alert": {
        if (!data.title || !data.message) {
          return NextResponse.json(
            { error: "Title and message are required for system alerts", code: 400 } as ApiError,
            { status: 400 },
          )
        }

        await service.sendSystemAlert(data.alertLevel || "info", data.title, data.message)
        break
      }

      default:
        return NextResponse.json({ error: `Unknown alert type: ${type}`, code: 400 } as ApiError, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: `${type} alert sent successfully`,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error("Discord alerts API error:", error)
    return NextResponse.json(
      {
        error: "Failed to send Discord alert",
        code: 500,
        details: error.message,
      } as ApiError,
      { status: 500 },
    )
  }
}
