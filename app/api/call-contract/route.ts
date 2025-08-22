import { type NextRequest, NextResponse } from "next/server"
import { HyperliquidClient } from "@/lib/hyperliquid-client"
import type { ContractCall, ApiError } from "@/lib/types"

/**
 * POST /api/call-contract
 * Call a smart contract on HyperEVM
 * Body: ContractCall - Contract address, function name, and parameters
 */
export async function POST(request: NextRequest) {
  try {
    const body: ContractCall = await request.json()

    // Validate request body
    if (!body.contractAddress || !body.functionName) {
      return NextResponse.json({ error: "Contract address and function name are required", code: 400 } as ApiError, {
        status: 400,
      })
    }

    if (!Array.isArray(body.params)) {
      return NextResponse.json({ error: "Params must be an array", code: 400 } as ApiError, { status: 400 })
    }

    const apiKey = process.env.HYPERLIQUID_API_KEY
    const evmRpcUrl = process.env.HYPERVM_RPC_URL

    if (!apiKey || !evmRpcUrl) {
      return NextResponse.json({ error: "API configuration missing", code: 500 } as ApiError, { status: 500 })
    }

    const client = new HyperliquidClient(apiKey, undefined, evmRpcUrl)
    const result = await client.callContract(body)

    return NextResponse.json({
      success: true,
      result,
      timestamp: Date.now(),
    })
  } catch (error: any) {
    console.error("Contract call API error:", error)
    return NextResponse.json(
      {
        error: "Failed to call contract",
        code: 500,
        details: error.message,
      } as ApiError,
      { status: 500 },
    )
  }
}
