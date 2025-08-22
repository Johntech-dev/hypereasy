import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { TradingInterface } from "@/components/trading-interface"
import jest from "jest"

// Mock fetch
global.fetch = jest.fn()

describe("TradingInterface", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("should render trading form", () => {
    render(<TradingInterface />)

    expect(screen.getByText("Place Order")).toBeInTheDocument()
    expect(screen.getByLabelText("Asset")).toBeInTheDocument()
    expect(screen.getByLabelText("Amount (USD)")).toBeInTheDocument()
    expect(screen.getByText("Buy")).toBeInTheDocument()
    expect(screen.getByText("Sell")).toBeInTheDocument()
  })

  it("should handle form submission", async () => {
    const mockResponse = {
      success: true,
      orderId: "test-order-123",
      message: "Order placed successfully",
    }
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    render(<TradingInterface />)

    // Fill form
    fireEvent.change(screen.getByLabelText("Amount (USD)"), {
      target: { value: "100" },
    })

    // Submit form
    fireEvent.click(screen.getByText("Buy BTC"))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/place-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          asset: "BTC",
          amount: 100,
          price: 0,
          isBuy: true,
          orderType: "market",
        }),
      })
    })
  })

  it("should show validation errors", () => {
    render(<TradingInterface />)

    const submitButton = screen.getByText("Buy BTC")
    expect(submitButton).toBeDisabled()

    // Enter valid amount
    fireEvent.change(screen.getByLabelText("Amount (USD)"), {
      target: { value: "100" },
    })

    expect(submitButton).not.toBeDisabled()
  })

  it("should handle limit orders", () => {
    render(<TradingInterface />)

    // Switch to limit order
    fireEvent.click(screen.getByLabelText("Limit"))

    // Price field should appear
    expect(screen.getByLabelText("Price (USD)")).toBeInTheDocument()
  })
})
