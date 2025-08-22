import { POST } from "@/app/api/place-order/route"
import { NextRequest } from "next/server"
import jest from "jest"

// Mock dependencies
jest.mock("@/lib/hyperliquid-client")
jest.mock("@/lib/database")

describe("/api/place-order", () => {
  it("should place a valid market order", async () => {
    const orderData = {
      asset: "BTC",
      amount: 100,
      isBuy: true,
      orderType: "market",
    }

    const request = new NextRequest("http://localhost:3000/api/place-order", {
      method: "POST",
      body: JSON.stringify(orderData),
      headers: { "Content-Type": "application/json" },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
  })

  it("should validate order parameters", async () => {
    const invalidOrder = {
      asset: "INVALID",
      amount: -100,
      isBuy: true,
      orderType: "market",
    }

    const request = new NextRequest("http://localhost:3000/api/place-order", {
      method: "POST",
      body: JSON.stringify(invalidOrder),
      headers: { "Content-Type": "application/json" },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain("Invalid asset")
  })

  it("should require price for limit orders", async () => {
    const limitOrder = {
      asset: "BTC",
      amount: 100,
      isBuy: true,
      orderType: "limit",
      // Missing price
    }

    const request = new NextRequest("http://localhost:3000/api/place-order", {
      method: "POST",
      body: JSON.stringify(limitOrder),
      headers: { "Content-Type": "application/json" },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain("Price is required for limit orders")
  })
})
