import { type NextRequest, NextResponse } from "next/server"
import { HyperliquidClient } from "@/lib/hyperliquid-client"
import { logVaultOperation, logApiUsage } from "@/lib/database"
import type { VaultAction, ApiError } from "@/lib/types"

/**
 * POST /api/manage-vault
 * Manage Hyperliquid vault operations (deposit/withdraw) with database logging
 * Body: VaultAction - Action details including action type and amount
 */
export async function POST(request: NextRequest) {
  try {
    const body: VaultAction = await request.json()

    // Validate request body
    if (!body.action || !["deposit", "withdraw"].includes(body.action)) {
      await logApiUsage({
        endpoint: "/api/manage-vault",
        method: "POST",
        status: 400,
      })

      return NextResponse.json({ error: 'Action must be "deposit" or "withdraw"', code: 400 } as ApiError, {
        status: 400,
      })
    }

    if (!body.amount || body.amount <= 0) {
      await logApiUsage({
        endpoint: "/api/manage-vault",
        method: "POST",
        status: 400,
      })

      return NextResponse.json({ error: "Amount must be a positive number", code: 400 } as ApiError, { status: 400 })
    }

    const apiKey = process.env.HYPERLIQUID_API_KEY
    if (!apiKey) {
      await logApiUsage({
        endpoint: "/api/manage-vault",
        method: "POST",
        status: 500,
      })

      return NextResponse.json({ error: "Hyperliquid API key not configured", code: 500 } as ApiError, { status: 500 })
    }

    await logVaultOperation({
      action: body.action,
      amount: body.amount,
      status: "pending",
    })

    const client = new HyperliquidClient(apiKey)
    const result = await client.manageVault(body)

    if (result.success) {
      await logVaultOperation({
        action: body.action,
        amount: body.amount,
        status: "completed",
      })
    }

    await logApiUsage({
      endpoint: "/api/manage-vault",
      method: "POST",
      status: 200,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Vault management API error:", error)

    await logApiUsage({
      endpoint: "/api/manage-vault",
      method: "POST",
      status: 500,
    })

    return NextResponse.json(
      {
        error: "Failed to manage vault",
        code: 500,
        details: error.message,
      } as ApiError,
      { status: 500 },
    )
  }
}
