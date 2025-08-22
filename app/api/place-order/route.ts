import { type NextRequest, NextResponse } from "next/server"
import { HyperliquidClient } from "@/lib/hyperliquid-client"
import { logTransaction, logApiUsage, updateTransactionStatus } from "@/lib/database"
import type { OrderRequest, OrderResponse, ApiError } from "@/lib/types"
import { HYPERLIQUID_ASSETS, MIN_ORDER_SIZE, MAX_ORDER_SIZE } from "@/lib/constants"

/**
 * POST /api/place-order
 * Place a trading order on Hyperliquid with database logging
 * Body: OrderRequest - Order details including asset, amount, price, isBuy, orderType
 */
export async function POST(request: NextRequest) {
  let transactionId: string | undefined

  try {
    const body: OrderRequest = await request.json()

    // Validate request body
    const validation = validateOrderRequest(body)
    if (!validation.valid) {
      await logApiUsage({
        endpoint: "/api/place-order",
        method: "POST",
        status: 400,
      })

      return NextResponse.json({ error: validation.error, code: 400 } as ApiError, { status: 400 })
    }

    const apiKey = process.env.HYPERLIQUID_API_KEY
    if (!apiKey) {
      await logApiUsage({
        endpoint: "/api/place-order",
        method: "POST",
        status: 500,
      })

      return NextResponse.json({ error: "Hyperliquid API key not configured", code: 500 } as ApiError, { status: 500 })
    }

    const dbTransaction = await logTransaction({
      asset: body.asset,
      amount: body.amount,
      price: body.price || 0,
      isBuy: body.isBuy,
      orderType: body.orderType,
      status: "pending",
    })
    transactionId = dbTransaction.id

    const client = new HyperliquidClient(apiKey)
    const result = await client.placeOrder(body)

    if (result.success && result.orderId) {
      await updateTransactionStatus(transactionId, "completed", result.orderId)
    } else {
      await updateTransactionStatus(transactionId, "failed")
    }

    // Send Discord notification if webhook is configured
    if (process.env.DISCORD_WEBHOOK_URL) {
      await sendDiscordNotification(body, result)
    }

    // Log successful API usage
    await logApiUsage({
      endpoint: "/api/place-order",
      method: "POST",
      status: 200,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Place order API error:", error)

    if (transactionId) {
      try {
        await updateTransactionStatus(transactionId, "failed")
      } catch (dbError) {
        console.error("Failed to update transaction status:", dbError)
      }
    }

    await logApiUsage({
      endpoint: "/api/place-order",
      method: "POST",
      status: 500,
    })

    return NextResponse.json(
      {
        error: "Failed to place order",
        code: 500,
        details: error.message,
      } as ApiError,
      { status: 500 },
    )
  }
}

function validateOrderRequest(order: OrderRequest): { valid: boolean; error?: string } {
  if (!order.asset || !HYPERLIQUID_ASSETS.includes(order.asset as any)) {
    return { valid: false, error: `Invalid asset. Supported: ${HYPERLIQUID_ASSETS.join(", ")}` }
  }

  if (!order.amount || order.amount <= 0) {
    return { valid: false, error: "Amount must be a positive number" }
  }

  if (order.amount < MIN_ORDER_SIZE || order.amount > MAX_ORDER_SIZE) {
    return { valid: false, error: `Amount must be between $${MIN_ORDER_SIZE} and $${MAX_ORDER_SIZE}` }
  }

  if (order.orderType === "limit" && (!order.price || order.price <= 0)) {
    return { valid: false, error: "Price is required for limit orders" }
  }

  if (typeof order.isBuy !== "boolean") {
    return { valid: false, error: "isBuy must be a boolean" }
  }

  return { valid: true }
}

async function sendDiscordNotification(order: OrderRequest, result: OrderResponse) {
  try {
    const webhookUrl = process.env.DISCORD_WEBHOOK_URL
    if (!webhookUrl) return

    const embed = {
      title: "🚀 HyperEasy Trade Alert",
      description: `${order.isBuy ? "BUY" : "SELL"} order placed`,
      color: result.success ? 0x00d4ff : 0xff4444,
      fields: [
        { name: "Asset", value: order.asset, inline: true },
        { name: "Amount", value: `$${order.amount}`, inline: true },
        { name: "Type", value: order.orderType.toUpperCase(), inline: true },
        { name: "Status", value: result.success ? "✅ Success" : "❌ Failed", inline: false },
      ],
      timestamp: new Date().toISOString(),
      footer: { text: "HyperEasy SDK" },
    }

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
    })
  } catch (error) {
    console.error("Discord notification failed:", error)
  }
}
