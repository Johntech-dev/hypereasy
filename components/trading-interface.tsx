"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, TrendingUp, TrendingDown, Info } from "lucide-react"
import { HYPERLIQUID_ASSETS } from "@/lib/constants"
import type { OrderRequest, OrderResponse } from "@/lib/types"

export function TradingInterface() {
  const [formData, setFormData] = useState<Partial<OrderRequest>>({
    asset: "BTC",
    amount: 0,
    price: 0,
    isBuy: true,
    orderType: "market",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/place-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data: OrderResponse = await response.json()

      if (response.ok && data.success) {
        setResult({ success: true, message: data.message })
        // Reset form on success
        setFormData({
          asset: "BTC",
          amount: 0,
          price: 0,
          isBuy: true,
          orderType: "market",
        })
      } else {
        setResult({ success: false, message: data.message || "Order failed" })
      }
    } catch (error) {
      setResult({ success: false, message: "Network error. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid =
    formData.asset &&
    formData.amount &&
    formData.amount > 0 &&
    (formData.orderType === "market" || (formData.orderType === "limit" && formData.price && formData.price > 0))

  return (
    <Card className="bg-[#0A0F1C] border-gray-800 hyperliquid-glow">
      <CardHeader>
        <CardTitle className="text-[#00D4FF] flex items-center gap-2">
          {formData.isBuy ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          Place Order
        </CardTitle>
        <CardDescription className="text-gray-400">Trade cryptocurrencies on Hyperliquid with ease</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Asset Selection */}
          <div className="space-y-2">
            <Label htmlFor="asset" className="text-gray-300">
              Asset
            </Label>
            <Select
              value={formData.asset}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, asset: value }))}
            >
              <SelectTrigger className="bg-[#121212] border-gray-700 text-white">
                <SelectValue placeholder="Select asset" />
              </SelectTrigger>
              <SelectContent className="bg-[#121212] border-gray-700">
                {HYPERLIQUID_ASSETS.map((asset) => (
                  <SelectItem key={asset} value={asset} className="text-white hover:bg-gray-800">
                    {asset}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Buy/Sell Selection */}
          <div className="space-y-2">
            <Label className="text-gray-300">Order Side</Label>
            <RadioGroup
              value={formData.isBuy ? "buy" : "sell"}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, isBuy: value === "buy" }))}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="buy" id="buy" className="border-[#00D4FF] text-[#00D4FF]" />
                <Label htmlFor="buy" className="text-[#00D4FF] font-medium">
                  Buy
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sell" id="sell" className="border-[#FF00A8] text-[#FF00A8]" />
                <Label htmlFor="sell" className="text-[#FF00A8] font-medium">
                  Sell
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Order Type */}
          <div className="space-y-2">
            <Label className="text-gray-300">Order Type</Label>
            <RadioGroup
              value={formData.orderType}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, orderType: value as "market" | "limit" }))}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="market" id="market" className="border-gray-400 text-gray-400" />
                <Label htmlFor="market" className="text-gray-300">
                  Market
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="limit" id="limit" className="border-gray-400 text-gray-400" />
                <Label htmlFor="limit" className="text-gray-300">
                  Limit
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-gray-300">
              Amount (USD)
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount, e.g., 100"
              value={formData.amount || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, amount: Number.parseFloat(e.target.value) || 0 }))}
              className="bg-[#121212] border-gray-700 text-white placeholder-gray-500"
              min="1"
              step="0.01"
            />
          </div>

          {/* Price Input (for limit orders) */}
          {formData.orderType === "limit" && (
            <div className="space-y-2">
              <Label htmlFor="price" className="text-gray-300">
                Price (USD)
              </Label>
              <Input
                id="price"
                type="number"
                placeholder="Enter limit price"
                value={formData.price || ""}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) || 0 }))}
                className="bg-[#121212] border-gray-700 text-white placeholder-gray-500"
                min="0.01"
                step="0.01"
              />
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full bg-gradient-to-r from-[#00D4FF] to-[#FF00A8] hover:from-[#33E0FF] hover:to-[#FF33B8] text-white font-medium hyperliquid-glow-hover"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Placing Order...
              </>
            ) : (
              `${formData.isBuy ? "Buy" : "Sell"} ${formData.asset}`
            )}
          </Button>
        </form>

        {/* Result Display */}
        {result && (
          <Alert className={`${result.success ? "border-green-500 bg-green-500/10" : "border-red-500 bg-red-500/10"}`}>
            <Info className="w-4 h-4" />
            <AlertDescription className={result.success ? "text-green-400" : "text-red-400"}>
              {result.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Help Text */}
        <div className="text-sm text-gray-500 space-y-1">
          <p>• Market orders execute immediately at current price</p>
          <p>• Limit orders execute only at your specified price or better</p>
          <p>• Minimum order size: $1, Maximum: $1,000,000</p>
        </div>
      </CardContent>
    </Card>
  )
}
