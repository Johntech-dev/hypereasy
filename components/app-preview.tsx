"use client"

import { useState, useEffect } from "react"
import type { BuilderComponent, WorkflowConnection } from "./no-code-builder"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Play, Pause, RotateCcw } from "lucide-react"

interface AppPreviewProps {
  components: BuilderComponent[]
  connections: WorkflowConnection[]
  onClose: () => void
}

export function AppPreview({ components, connections, onClose }: AppPreviewProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [executionLog, setExecutionLog] = useState<string[]>([])
  const [componentStates, setComponentStates] = useState<Record<string, any>>({})

  const addLogEntry = (message: string) => {
    setExecutionLog((prev) => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const simulateExecution = () => {
    if (!isRunning) return

    // Simulate workflow execution
    const triggerComponents = components.filter(
      (c) => c.type === "price-alert" || c.type === "scheduler" || c.type === "market-data",
    )

    triggerComponents.forEach((trigger) => {
      const connectedActions = connections
        .filter((conn) => conn.sourceId === trigger.id)
        .map((conn) => components.find((c) => c.id === conn.targetId))
        .filter(Boolean)

      if (connectedActions.length > 0) {
        addLogEntry(`${trigger.name} triggered`)
        connectedActions.forEach((action) => {
          addLogEntry(`Executing ${action?.name}`)
        })
      }
    })
  }

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(simulateExecution, 5000)
      return () => clearInterval(interval)
    }
  }, [isRunning, components, connections])

  const renderLiveComponent = (component: BuilderComponent) => {
    switch (component.type) {
      case "market-data":
        return (
          <Card className="p-4 bg-[#2A2A2A] border-[#444]">
            <h3 className="font-medium text-white mb-3">{component.name}</h3>
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
          </Card>
        )

      case "place-order":
        return (
          <Card className="p-4 bg-[#2A2A2A] border-[#444]">
            <h3 className="font-medium text-white mb-3">{component.name}</h3>
            <div className="space-y-3">
              <div className="text-sm text-gray-300">
                Asset: <span className="text-[#00D4FF]">{component.config.asset || "ETH"}</span>
              </div>
              <div className="text-sm text-gray-300">
                Side: <span className="text-[#FF00A8]">{component.config.side || "buy"}</span>
              </div>
              <div className="text-sm text-gray-300">
                Amount: <span className="text-white">{component.config.amount || "1.0"}</span>
              </div>
              <Button
                size="sm"
                className="w-full bg-[#00D4FF] hover:bg-[#00B8E6] text-black"
                onClick={() =>
                  addLogEntry(
                    `Order placed: ${component.config.side || "buy"} ${component.config.amount || "1.0"} ${component.config.asset || "ETH"}`,
                  )
                }
              >
                Execute Order
              </Button>
            </div>
          </Card>
        )

      case "price-alert":
        return (
          <Card className="p-4 bg-[#2A2A2A] border-[#444]">
            <h3 className="font-medium text-white mb-3">{component.name}</h3>
            <div className="space-y-2">
              <div className="text-sm text-gray-300">
                Watching: <span className="text-[#00D4FF]">{component.config.asset || "ETH"}</span>
              </div>
              <div className="text-sm text-gray-300">
                Condition:{" "}
                <span className="text-[#FF00A8]">
                  {component.config.condition || "above"} ${component.config.target || "3000"}
                </span>
              </div>
              <Badge variant="outline" className="border-green-500 text-green-400">
                Active
              </Badge>
            </div>
          </Card>
        )

      case "user-balance":
        return (
          <Card className="p-4 bg-[#2A2A2A] border-[#444]">
            <h3 className="font-medium text-white mb-3">{component.name}</h3>
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
          </Card>
        )

      default:
        return (
          <Card className="p-4 bg-[#2A2A2A] border-[#444]">
            <h3 className="font-medium text-white mb-2">{component.name}</h3>
            <div className="text-sm text-gray-400">Component active and ready</div>
          </Card>
        )
    }
  }

  return (
    <div className="h-full bg-gradient-to-br from-[#121212] via-[#0A0F1C] to-[#121212] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">App Preview</h1>
          <p className="text-gray-400">Live preview of your Hyperliquid application</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsRunning(!isRunning)}
            className={`${isRunning ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}`}
          >
            {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isRunning ? "Stop" : "Start"}
          </Button>
          <Button variant="outline" onClick={() => setExecutionLog([])}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear Log
          </Button>
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 h-[calc(100%-120px)]">
        {/* Components Grid */}
        <div className="lg:col-span-2 space-y-4 overflow-y-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[#00D4FF]">Active Components</h2>
            <Badge
              variant="outline"
              className={`${isRunning ? "border-green-500 text-green-400" : "border-gray-500 text-gray-400"}`}
            >
              {isRunning ? "Running" : "Stopped"}
            </Badge>
          </div>

          {components.length === 0 ? (
            <Card className="p-8 bg-[#2A2A2A] border-[#444] text-center">
              <div className="text-gray-400">No components to preview</div>
            </Card>
          ) : (
            <div className="grid gap-4">
              {components.map((component) => (
                <div key={component.id}>{renderLiveComponent(component)}</div>
              ))}
            </div>
          )}
        </div>

        {/* Execution Log */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#00D4FF]">Execution Log</h2>
          <Card className="p-4 bg-[#2A2A2A] border-[#444] h-full">
            <div className="space-y-2 text-sm font-mono">
              {executionLog.length === 0 ? (
                <div className="text-gray-400 text-center py-8">No activity yet. Click "Start" to begin execution.</div>
              ) : (
                executionLog.map((entry, index) => (
                  <div key={index} className="text-gray-300 border-b border-[#333] pb-1">
                    {entry}
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Workflow Status */}
          <Card className="p-4 bg-[#2A2A2A] border-[#444]">
            <h3 className="font-medium text-white mb-3">Workflow Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Components</span>
                <span className="text-[#00D4FF]">{components.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Connections</span>
                <span className="text-[#FF00A8]">{connections.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <Badge
                  variant="outline"
                  className={`${isRunning ? "border-green-500 text-green-400" : "border-gray-500 text-gray-400"}`}
                >
                  {isRunning ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
