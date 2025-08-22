"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Wallet, ArrowUpCircle, ArrowDownCircle, Info } from "lucide-react"
import type { VaultAction } from "@/lib/types"

export function VaultManager() {
  const [formData, setFormData] = useState<VaultAction>({
    action: "deposit",
    amount: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/manage-vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setResult({ success: true, message: data.message })
        setFormData({ action: "deposit", amount: 0 })
      } else {
        setResult({ success: false, message: data.error || "Operation failed" })
      }
    } catch (error) {
      setResult({ success: false, message: "Network error. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = formData.amount > 0

  return (
    <Card className="bg-[#0A0F1C] border-gray-800 hyperliquid-glow">
      <CardHeader>
        <CardTitle className="text-[#FF00A8] flex items-center gap-2">
          <Wallet className="w-5 h-5" />
          Vault Manager
        </CardTitle>
        <CardDescription className="text-gray-400">
          Deposit or withdraw funds from your Hyperliquid vault
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Action Selection */}
          <div className="space-y-2">
            <Label className="text-gray-300">Action</Label>
            <RadioGroup
              value={formData.action}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, action: value as "deposit" | "withdraw" }))}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="deposit" id="deposit" className="border-[#00D4FF] text-[#00D4FF]" />
                <Label htmlFor="deposit" className="text-[#00D4FF] font-medium flex items-center gap-1">
                  <ArrowUpCircle className="w-4 h-4" />
                  Deposit
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="withdraw" id="withdraw" className="border-[#FF00A8] text-[#FF00A8]" />
                <Label htmlFor="withdraw" className="text-[#FF00A8] font-medium flex items-center gap-1">
                  <ArrowDownCircle className="w-4 h-4" />
                  Withdraw
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="vault-amount" className="text-gray-300">
              Amount (USD)
            </Label>
            <Input
              id="vault-amount"
              type="number"
              placeholder="Enter amount, e.g., 1000"
              value={formData.amount || ""}
              onChange={(e) => setFormData((prev) => ({ ...prev, amount: Number.parseFloat(e.target.value) || 0 }))}
              className="bg-[#121212] border-gray-700 text-white placeholder-gray-500"
              min="1"
              step="0.01"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="w-full bg-gradient-to-r from-[#FF00A8] to-[#00D4FF] hover:from-[#FF33B8] hover:to-[#33E0FF] text-white font-medium hyperliquid-glow-hover"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              `${formData.action === "deposit" ? "Deposit" : "Withdraw"} $${formData.amount || 0}`
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
          <p>• Deposits increase your trading balance</p>
          <p>• Withdrawals move funds back to your wallet</p>
          <p>• All transactions are processed on Hyperliquid</p>
        </div>
      </CardContent>
    </Card>
  )
}
