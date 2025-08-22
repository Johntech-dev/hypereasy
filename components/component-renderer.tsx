"use client"

import type { BuilderComponent } from "./no-code-builder"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, ShoppingCart, Wallet, Code, Bell, BarChart3, Timer, Zap } from "lucide-react"

interface ComponentRendererProps {
  component: BuilderComponent
  previewMode: boolean
  connectingMode?: boolean
  onStartConnection?: (componentId: string, output: string) => void
}

export function ComponentRenderer({
  component,
  previewMode,
  connectingMode,
  onStartConnection,
}: ComponentRendererProps) {
  const getIcon = (type: string) => {
    const icons = {
      "place-order": <ShoppingCart className="w-4 h-4" />,
      "market-data": <TrendingUp className="w-4 h-4" />,
      "user-balance": <Wallet className="w-4 h-4" />,
      "vault-manager": <BarChart3 className="w-4 h-4" />,
      "contract-call": <Code className="w-4 h-4" />,
      "price-alert": <Bell className="w-4 h-4" />,
      scheduler: <Timer className="w-4 h-4" />,
      "discord-webhook": <Zap className="w-4 h-4" />,
    }
    return icons[type as keyof typeof icons] || <Code className="w-4 h-4" />
  }

  const canOutput = (type: string) => {
    return ["price-alert", "scheduler", "market-data", "place-order", "vault-manager"].includes(type)
  }

  const canInput = (type: string) => {
    return ["place-order", "vault-manager", "discord-webhook", "contract-call"].includes(type)
  }

  const renderComponentContent = () => {
    switch (component.type) {
      case "place-order":
        return (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Select defaultValue={component.config.asset || "ETH"}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Asset" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="SOL">SOL</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue={component.config.side || "buy"}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input placeholder="Amount" defaultValue={component.config.amount || ""} />
            <Button className="w-full bg-[#00D4FF] hover:bg-[#00B8E6] text-black">Place Order</Button>
          </div>
        )

      case "market-data":
        return (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">ETH/USD</span>
              <span className="text-sm font-mono text-[#00D4FF]">$3,245.67</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">24h Change</span>
              <span className="text-sm font-mono text-green-400">+2.34%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Volume</span>
              <span className="text-sm font-mono text-gray-300">$1.2M</span>
            </div>
          </div>
        )

      case "user-balance":
        return (
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Total Balance</span>
              <span className="text-sm font-mono text-[#00D4FF]">$12,345.67</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">Available</span>
              <span className="text-sm font-mono text-green-400">$8,234.56</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-400">In Orders</span>
              <span className="text-sm font-mono text-yellow-400">$4,111.11</span>
            </div>
          </div>
        )

      case "price-alert":
        return (
          <div className="space-y-3">
            <Select defaultValue={component.config.asset || "ETH"}>
              <SelectTrigger>
                <SelectValue placeholder="Asset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ETH">ETH</SelectItem>
                <SelectItem value="BTC">BTC</SelectItem>
                <SelectItem value="SOL">SOL</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Select defaultValue={component.config.condition || "above"}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="above">Above</SelectItem>
                  <SelectItem value="below">Below</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Price" defaultValue={component.config.price || ""} />
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-4">
            <div className="text-gray-400 text-sm">{component.name} Component</div>
          </div>
        )
    }
  }

  return (
    <Card className="w-64 bg-[#2A2A2A] border-[#444] hover:border-[#00D4FF] transition-colors relative">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="text-[#00D4FF]">{getIcon(component.type)}</div>
          <h3 className="font-medium text-white text-sm">{component.name}</h3>
        </div>
        {renderComponentContent()}
      </div>

      {/* Connection Points */}
      {!previewMode && (
        <>
          {/* Input Connection Point */}
          {canInput(component.type) && (
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2">
              <div className="w-3 h-3 bg-[#FF00A8] border-2 border-[#2A2A2A] rounded-full"></div>
            </div>
          )}

          {/* Output Connection Point */}
          {canOutput(component.type) && (
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (onStartConnection) {
                    onStartConnection(component.id, "output")
                  }
                }}
                className="w-3 h-3 bg-[#00D4FF] border-2 border-[#2A2A2A] rounded-full hover:scale-125 transition-transform"
              ></button>
            </div>
          )}
        </>
      )}
    </Card>
  )
}
