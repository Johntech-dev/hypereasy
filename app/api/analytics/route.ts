import { type NextRequest, NextResponse } from "next/server"
import { prisma, logApiUsage } from "@/lib/database"
import type { ApiError } from "@/lib/types"

/**
 * GET /api/analytics
 * Get analytics data for the HyperEasy platform
 * Query params:
 *   - period (string): Time period for analytics (24h, 7d, 30d) - default: 24h
 *   - userId (string): Filter by user ID (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get("period") || "24h"
    const userId = searchParams.get("userId") || undefined

    // Calculate time range
    const now = new Date()
    let startDate: Date

    switch (period) {
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      default: // 24h
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    }

    const whereClause = {
      timestamp: { gte: startDate },
      ...(userId ? { userId } : {}),
    }

    // Fetch analytics data
    const [transactionCount, transactionVolume, vaultOperations, apiCalls, assetBreakdown, orderTypeBreakdown] =
      await Promise.all([
        // Transaction count and success rate
        prisma.transaction.groupBy({
          by: ["status"],
          where: whereClause,
          _count: { status: true },
        }),

        // Transaction volume
        prisma.transaction.aggregate({
          where: { ...whereClause, status: "completed" },
          _sum: { amount: true },
          _avg: { amount: true },
        }),

        // Vault operations
        prisma.vaultOperation.groupBy({
          by: ["action", "status"],
          where: whereClause,
          _count: { action: true },
          _sum: { amount: true },
        }),

        // API usage
        prisma.apiUsage.groupBy({
          by: ["endpoint"],
          where: whereClause,
          _count: { endpoint: true },
        }),

        // Asset breakdown
        prisma.transaction.groupBy({
          by: ["asset"],
          where: { ...whereClause, status: "completed" },
          _count: { asset: true },
          _sum: { amount: true },
        }),

        // Order type breakdown
        prisma.transaction.groupBy({
          by: ["orderType"],
          where: whereClause,
          _count: { orderType: true },
        }),
      ])

    // Process data for response
    const analytics = {
      period,
      timeRange: {
        start: startDate.toISOString(),
        end: now.toISOString(),
      },
      transactions: {
        total: transactionCount.reduce((sum, item) => sum + item._count.status, 0),
        byStatus: transactionCount.reduce(
          (acc, item) => {
            acc[item.status] = item._count.status
            return acc
          },
          {} as Record<string, number>,
        ),
        volume: {
          total: transactionVolume._sum.amount || 0,
          average: transactionVolume._avg.amount || 0,
        },
        byAsset: assetBreakdown.map((item) => ({
          asset: item.asset,
          count: item._count.asset,
          volume: item._sum.amount || 0,
        })),
        byOrderType: orderTypeBreakdown.reduce(
          (acc, item) => {
            acc[item.orderType] = item._count.orderType
            return acc
          },
          {} as Record<string, number>,
        ),
      },
      vault: {
        operations: vaultOperations.map((item) => ({
          action: item.action,
          status: item.status,
          count: item._count.action,
          volume: item._sum.amount || 0,
        })),
      },
      api: {
        calls: apiCalls.map((item) => ({
          endpoint: item.endpoint,
          count: item._count.endpoint,
        })),
      },
    }

    // Log API usage
    await logApiUsage({
      endpoint: "/api/analytics",
      method: "GET",
      status: 200,
      userId,
    })

    return NextResponse.json(analytics, {
      headers: {
        "Cache-Control": "private, s-maxage=300, stale-while-revalidate=600", // 5 min cache
      },
    })
  } catch (error: any) {
    console.error("Analytics API error:", error)

    await logApiUsage({
      endpoint: "/api/analytics",
      method: "GET",
      status: 500,
    })

    return NextResponse.json(
      {
        error: "Failed to fetch analytics",
        code: 500,
        details: error.message,
      } as ApiError,
      { status: 500 },
    )
  }
}
