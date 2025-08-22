"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, History, TrendingUp, TrendingDown } from "lucide-react"
import type { Transaction } from "@/lib/types"

export function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/transactions")
      const data = await response.json()

      if (response.ok) {
        setTransactions(data)
      } else {
        setError(data.error || "Failed to fetch transactions")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  return (
    <Card className="bg-[#0A0F1C] border-gray-800 hyperliquid-glow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-[#00D4FF] flex items-center gap-2">
              <History className="w-5 h-5" />
              Transaction History
            </CardTitle>
            <CardDescription className="text-gray-400">Your recent trading activity</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={fetchTransactions}
            disabled={isLoading}
            className="text-gray-400 hover:text-[#00D4FF]"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-[#00D4FF]" />
            <span className="ml-2 text-gray-400">Loading transactions...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-400">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchTransactions}
              className="mt-2 text-[#00D4FF] hover:text-[#33E0FF]"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && transactions.length === 0 && (
          <div className="text-center py-8">
            <History className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No transactions yet</p>
            <p className="text-sm text-gray-500 mt-1">Your trading history will appear here</p>
          </div>
        )}

        {/* Transactions List */}
        {!isLoading && !error && transactions.length > 0 && (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-[#121212] rounded-lg border border-gray-800"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${transaction.isBuy ? "bg-[#00D4FF]/20" : "bg-[#FF00A8]/20"}`}>
                    {transaction.isBuy ? (
                      <TrendingUp className="w-4 h-4 text-[#00D4FF]" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-[#FF00A8]" />
                    )}
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {transaction.isBuy ? "Buy" : "Sell"} {transaction.asset}
                    </p>
                    <p className="text-sm text-gray-400">
                      ${transaction.amount} at {formatPrice(transaction.price)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary" className={getStatusColor(transaction.status)}>
                    {transaction.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{new Date(transaction.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
