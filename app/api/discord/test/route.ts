import { type NextRequest, NextResponse } from "next/server"
import { createDiscordService } from "@/lib/discord"
import type { ApiError } from "@/lib/types"

/**
 * POST /api/discord/test
 * Test Discord webhook connection
 * Body: { webhookUrl?: string } - Optional custom webhook URL for testing
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const webhookUrl = body.webhookUrl || process.env.DISCORD_WEBHOOK_URL

    if (!webhookUrl) {
      return NextResponse.json(
        {
          error: "Discord webhook URL not configured",
          code: 400,
          details: "Please set DISCORD_WEBHOOK_URL environment variable or provide webhookUrl in request body",
        } as ApiError,
        { status: 400 },
      )
    }

    const service = createDiscordService(webhookUrl)
    if (!service) {
      return NextResponse.json({ error: "Failed to create Discord service", code: 500 } as ApiError, { status: 500 })
    }

    const result = await service.testConnection()

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        timestamp: new Date().toISOString(),
      })
    } else {
      return NextResponse.json(
        {
          error: "Discord webhook test failed",
          code: 400,
          details: result.message,
        } as ApiError,
        { status: 400 },
      )
    }
  } catch (error: any) {
    console.error("Discord test API error:", error)
    return NextResponse.json(
      {
        error: "Failed to test Discord webhook",
        code: 500,
        details: error.message,
      } as ApiError,
      { status: 500 },
    )
  }
}
