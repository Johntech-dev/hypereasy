import { type NextRequest, NextResponse } from "next/server"
import { getRecentTransactions, getTransactionStats, logApiUsage } from "@/lib/database"
import type { ApiError } from "@/lib/types"

/**
 * GET /api/transactions
 * Fetch transaction history with optional filtering
 * Query params:
 *   - limit (number): Number of transactions to return (default: 10, max: 100)
 *   - userId (string): Filter by user ID (optional)
 *   - stats (boolean): Include transaction statistics (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Math.min(Number.parseInt(searchParams.get("limit") || "10"), 100)
    const userId = searchParams.get("userId") || undefined
    const includeStats = searchParams.get("stats") === "true"

    // Log API usage
    await logApiUsage({
      endpoint: "/api/transactions",
      method: "GET",
      status: 200,
      userId,
    })

    const [transactions, stats] = await Promise.all([
      getRecentTransactions(limit, userId),
      includeStats ? getTransactionStats(userId) : null,
    ])

    const response = {
      transactions,
      ...(stats ? { stats } : {}),
      pagination: {
        limit,
        count: transactions.length,
      },
    }

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "private, s-maxage=30, stale-while-revalidate=60",
      },
    })
  } catch (error: any) {
    console.error("Transactions API error:", error)

    // Log failed API usage
    await logApiUsage({
      endpoint: "/api/transactions",
      method: "GET",
      status: 500,
    })

    return NextResponse.json(
      {
        error: "Failed to fetch transactions",
        code: 500,
        details: error.message,
      } as ApiError,
      { status: 500 },
    )
  }
}
