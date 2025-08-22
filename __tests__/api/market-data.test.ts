import { GET } from "@/app/api/market-data/route"
import { NextRequest } from "next/server"
import jest from "jest"

// Mock the HyperliquidClient
jest.mock("@/lib/hyperliquid-client", () => ({
  HyperliquidClient: jest.fn().mockImplementation(() => ({
    getMarketData: jest.fn().mockResolvedValue({
      asset: "BTC",
      price: 45000,
      volume24h: 1000000000,
      change24h: 2.5,
      high24h: 46000,
      low24h: 44000,
      timestamp: Date.now(),
    }),
  })),
}))

describe("/api/market-data", () => {
  it("should return market data for valid asset", async () => {
    const request = new NextRequest("http://localhost:3000/api/market-data?asset=BTC")
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.asset).toBe("BTC")
    expect(data.price).toBe(45000)
    expect(typeof data.volume24h).toBe("number")
  })

  it("should return 400 for missing asset parameter", async () => {
    const request = new NextRequest("http://localhost:3000/api/market-data")
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe("Asset parameter is required")
  })

  it("should return 500 for missing API key", async () => {
    delete process.env.HYPERLIQUID_API_KEY

    const request = new NextRequest("http://localhost:3000/api/market-data?asset=BTC")
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe("Hyperliquid API key not configured")

    // Restore API key
    process.env.HYPERLIQUID_API_KEY = "test-api-key"
  })
})
