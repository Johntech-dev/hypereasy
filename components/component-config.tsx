"use client"

import type { BuilderComponent } from "./no-code-builder"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface ComponentConfigProps {
  component: BuilderComponent
  onUpdate: (updates: Partial<BuilderComponent>) => void
}

export function ComponentConfig({ component, onUpdate }: ComponentConfigProps) {
  const updateConfig = (key: string, value: any) => {
    onUpdate({
      config: { ...component.config, [key]: value },
    })
  }

  const renderConfigFields = () => {
    switch (component.type) {
      case "place-order":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-300">Asset</Label>
              <Select value={component.config.asset || "ETH"} onValueChange={(value) => updateConfig("asset", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="SOL">SOL</SelectItem>
                  <SelectItem value="AVAX">AVAX</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm text-gray-300">Order Type</Label>
              <Select
                value={component.config.orderType || "market"}
                onValueChange={(value) => updateConfig("orderType", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market</SelectItem>
                  <SelectItem value="limit">Limit</SelectItem>
                  <SelectItem value="stop">Stop Loss</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm text-gray-300">Default Amount</Label>
              <Input
                className="mt-1"
                placeholder="0.0"
                value={component.config.amount || ""}
                onChange={(e) => updateConfig("amount", e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={component.config.requireConfirmation || false}
                onCheckedChange={(checked) => updateConfig("requireConfirmation", checked)}
              />
              <Label className="text-sm text-gray-300">Require Confirmation</Label>
            </div>
          </div>
        )

      case "market-data":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-300">Assets to Display</Label>
              <Select
                value={component.config.assets || "ETH,BTC"}
                onValueChange={(value) => updateConfig("assets", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETH">ETH Only</SelectItem>
                  <SelectItem value="ETH,BTC">ETH + BTC</SelectItem>
                  <SelectItem value="ETH,BTC,SOL">Top 3</SelectItem>
                  <SelectItem value="all">All Assets</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm text-gray-300">Refresh Interval (seconds)</Label>
              <Input
                className="mt-1"
                type="number"
                placeholder="5"
                value={component.config.refreshInterval || "5"}
                onChange={(e) => updateConfig("refreshInterval", e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={component.config.showChart || false}
                onCheckedChange={(checked) => updateConfig("showChart", checked)}
              />
              <Label className="text-sm text-gray-300">Show Price Chart</Label>
            </div>
          </div>
        )

      case "price-alert":
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-300">Asset</Label>
              <Select value={component.config.asset || "ETH"} onValueChange={(value) => updateConfig("asset", value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="SOL">SOL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm text-gray-300">Condition</Label>
              <Select
                value={component.config.condition || "above"}
                onValueChange={(value) => updateConfig("condition", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="above">Price Above</SelectItem>
                  <SelectItem value="below">Price Below</SelectItem>
                  <SelectItem value="change">% Change</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm text-gray-300">Target Price/Percentage</Label>
              <Input
                className="mt-1"
                placeholder="3000"
                value={component.config.target || ""}
                onChange={(e) => updateConfig("target", e.target.value)}
              />
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-8 text-gray-400">No configuration options available for this component.</div>
        )
    }
  }

  return (
    <div className="space-y-4">
      <div className="border-b border-[#333] pb-4">
        <h3 className="text-lg font-semibold text-[#00D4FF] mb-2">Configure Component</h3>
        <p className="text-sm text-gray-400">{component.name}</p>
      </div>

      <div>
        <Label className="text-sm text-gray-300">Component Name</Label>
        <Input className="mt-1" value={component.name} onChange={(e) => onUpdate({ name: e.target.value })} />
      </div>

      {renderConfigFields()}
    </div>
  )
}
