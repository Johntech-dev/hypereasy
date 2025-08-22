"use client"

import type React from "react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, ShoppingCart, Wallet, Code, Bell, BarChart3, Timer, Zap } from "lucide-react"

interface ComponentType {
  type: string
  name: string
  description: string
  icon: React.ReactNode
  category: string
}

const HYPERLIQUID_COMPONENTS: ComponentType[] = [
  // Trading Components
  {
    type: "place-order",
    name: "Place Order",
    description: "Execute buy/sell orders on Hyperliquid",
    icon: <ShoppingCart className="w-5 h-5" />,
    category: "Trading",
  },
  {
    type: "market-data",
    name: "Market Data",
    description: "Fetch real-time prices and market info",
    icon: <TrendingUp className="w-5 h-5" />,
    category: "Data",
  },
  {
    type: "user-balance",
    name: "User Balance",
    description: "Get account balances and positions",
    icon: <Wallet className="w-5 h-5" />,
    category: "Account",
  },
  {
    type: "vault-manager",
    name: "Vault Manager",
    description: "Deposit/withdraw from Hyperliquid vaults",
    icon: <BarChart3 className="w-5 h-5" />,
    category: "Vaults",
  },
  {
    type: "contract-call",
    name: "Contract Call",
    description: "Interact with HyperEVM smart contracts",
    icon: <Code className="w-5 h-5" />,
    category: "Contracts",
  },

  // Automation Components
  {
    type: "price-alert",
    name: "Price Alert",
    description: "Trigger actions when price conditions are met",
    icon: <Bell className="w-5 h-5" />,
    category: "Automation",
  },
  {
    type: "scheduler",
    name: "Scheduler",
    description: "Execute actions on a time schedule",
    icon: <Timer className="w-5 h-5" />,
    category: "Automation",
  },
  {
    type: "discord-webhook",
    name: "Discord Webhook",
    description: "Send notifications to Discord channels",
    icon: <Zap className="w-5 h-5" />,
    category: "Notifications",
  },
]

const CATEGORIES = ["Trading", "Data", "Account", "Vaults", "Contracts", "Automation", "Notifications"]

interface ComponentLibraryProps {
  onAddComponent: (type: string, name: string) => void
}

export function ComponentLibrary({ onAddComponent }: ComponentLibraryProps) {
  const handleDragStart = (e: React.DragEvent, component: ComponentType) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        type: component.type,
        name: component.name,
      }),
    )
    e.dataTransfer.effectAllowed = "copy"
  }

  return (
    <div className="space-y-6">
      {CATEGORIES.map((category) => {
        const categoryComponents = HYPERLIQUID_COMPONENTS.filter((c) => c.category === category)
        if (categoryComponents.length === 0) return null

        return (
          <div key={category}>
            <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wide">{category}</h3>
            <div className="space-y-2">
              {categoryComponents.map((component) => (
                <Card
                  key={component.type}
                  className="p-3 bg-[#2A2A2A] border-[#444] hover:border-[#00D4FF] transition-colors cursor-grab active:cursor-grabbing"
                  draggable
                  onDragStart={(e) => handleDragStart(e, component)}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-[#00D4FF] mt-0.5">{component.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-white mb-1">{component.name}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">{component.description}</p>
                      <Button
                        size="sm"
                        onClick={() => onAddComponent(component.type, component.name)}
                        className="mt-2 h-7 px-3 bg-[#00D4FF] hover:bg-[#00B8E6] text-black text-xs"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
