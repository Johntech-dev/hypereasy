"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader2, RefreshCw, TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react"
import { HYPERLIQUID_ASSETS } from "@/lib/constants"
import type { MarketData } from "@/lib/types"

export function MarketDataDisplay() {
  const [selectedAsset, setSelectedAsset] = useState("BTC")
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMarketData = async (asset: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/market-data?asset=${asset}`)
      const data = await response.json()

      if (response.ok) {
        setMarketData(data)
      } else {
        setError(data.error || "Failed to fetch market data")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMarketData(selectedAsset)
  }, [selectedAsset])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(2)}B`
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(2)}M`
    if (volume >= 1e3) return `$${(volume / 1e3).toFixed(2)}K`
    return `$${volume.toFixed(2)}`
  }

  return (
    <Card className="bg-[#0A0F1C] border-gray-800 hyperliquid-glow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[#00D4FF] flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Market Data
            </CardTitle>
            <CardDescription className="text-gray-400">Real-time price and volume information</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchMarketData(selectedAsset)}
            disabled={isLoading}
            className="text-gray-400 hover:text-[#00D4FF]"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Asset Selector */}
        <div className="space-y-2">
          <Select value={selectedAsset} onValueChange={setSelectedAsset}>
            <SelectTrigger className="bg-[#121212] border-gray-700 text-white">
              <SelectValue />
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

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-[#00D4FF]" />
            <span className="ml-2 text-gray-400">Loading market data...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-400">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fetchMarketData(selectedAsset)}
              className="mt-2 text-[#00D4FF] hover:text-[#33E0FF]"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Market Data Display */}
        {marketData && !isLoading && (
          <div className="space-y-4">
            {/* Price Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Current Price</p>
                <p className="text-2xl font-bold text-white flex items-center gap-1">
                  <DollarSign className="w-5 h-5" />
                  {formatPrice(marketData.price)}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-400">24h Change</p>
                <div className="flex items-center gap-1">
                  {marketData.change24h >= 0 ? (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                  <Badge
                    variant="secondary"
                    className={`${
                      marketData.change24h >= 0
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-red-500/20 text-red-400 border-red-500/30"
                    }`}
                  >
                    {marketData.change24h >= 0 ? "+" : ""}
                    {marketData.change24h.toFixed(2)}%
                  </Badge>
                </div>
              </div>
            </div>

            {/* High/Low Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-400">24h High</p>
                <p className="text-lg font-semibold text-green-400">{formatPrice(marketData.high24h)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-400">24h Low</p>
                <p className="text-lg font-semibold text-red-400">{formatPrice(marketData.low24h)}</p>
              </div>
            </div>

            {/* Volume Section */}
            <div className="space-y-1">
              <p className="text-sm text-gray-400">24h Volume</p>
              <p className="text-xl font-semibold text-[#FF00A8]">{formatVolume(marketData.volume24h)}</p>
            </div>

            {/* Last Updated */}
            <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-800">
              Last updated: {new Date(marketData.timestamp).toLocaleTimeString()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
