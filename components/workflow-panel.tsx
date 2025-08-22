"use client"

import type { BuilderComponent, WorkflowConnection } from "./no-code-builder"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, Trash2, X } from "lucide-react"

interface WorkflowPanelProps {
  components: BuilderComponent[]
  connections: WorkflowConnection[]
  onDeleteConnection: (connectionId: string) => void
  onClose: () => void
}

export function WorkflowPanel({ components, connections, onDeleteConnection, onClose }: WorkflowPanelProps) {
  const getTriggerComponents = () => {
    return components.filter((c) => c.type === "price-alert" || c.type === "scheduler" || c.type === "market-data")
  }

  const getActionComponents = () => {
    return components.filter(
      (c) => c.type === "place-order" || c.type === "vault-manager" || c.type === "discord-webhook",
    )
  }

  const getWorkflowChains = () => {
    const chains: { trigger: BuilderComponent; actions: BuilderComponent[] }[] = []

    getTriggerComponents().forEach((trigger) => {
      const connectedActions = connections
        .filter((conn) => conn.sourceId === trigger.id)
        .map((conn) => components.find((c) => c.id === conn.targetId))
        .filter(Boolean) as BuilderComponent[]

      if (connectedActions.length > 0) {
        chains.push({ trigger, actions: connectedActions })
      }
    })

    return chains
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#00D4FF]">Workflow Automation</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Workflow Status */}
      <Card className="p-4 bg-[#2A2A2A] border-[#444]">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-white">Workflow Status</h4>
          <div className="flex gap-2">
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Play className="w-3 h-3 mr-1" />
              Start
            </Button>
            <Button size="sm" variant="outline" className="border-[#444] bg-transparent">
              <Pause className="w-3 h-3 mr-1" />
              Pause
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-[#00D4FF] font-mono text-lg">{getTriggerComponents().length}</div>
            <div className="text-gray-400">Triggers</div>
          </div>
          <div className="text-center">
            <div className="text-[#FF00A8] font-mono text-lg">{connections.length}</div>
            <div className="text-gray-400">Connections</div>
          </div>
          <div className="text-center">
            <div className="text-green-400 font-mono text-lg">{getActionComponents().length}</div>
            <div className="text-gray-400">Actions</div>
          </div>
        </div>
      </Card>

      {/* Active Workflows */}
      <div className="space-y-3">
        <h4 className="font-medium text-white">Active Workflows</h4>

        {getWorkflowChains().length === 0 ? (
          <Card className="p-4 bg-[#2A2A2A] border-[#444] text-center">
            <div className="text-gray-400 text-sm">
              No workflows configured. Connect trigger components to action components to create automated workflows.
            </div>
          </Card>
        ) : (
          getWorkflowChains().map((chain, index) => (
            <Card key={index} className="p-3 bg-[#2A2A2A] border-[#444]">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="border-[#00D4FF] text-[#00D4FF]">
                  Trigger
                </Badge>
                <span className="text-sm text-white">{chain.trigger.name}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                <span>→</span>
                <span>When triggered, executes:</span>
              </div>

              <div className="space-y-1">
                {chain.actions.map((action, actionIndex) => (
                  <div key={actionIndex} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-[#FF00A8] text-[#FF00A8]">
                        Action
                      </Badge>
                      <span className="text-sm text-white">{action.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        const connection = connections.find(
                          (c) => c.sourceId === chain.trigger.id && c.targetId === action.id,
                        )
                        if (connection) onDeleteConnection(connection.id)
                      }}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Workflow Templates */}
      <div className="space-y-3">
        <h4 className="font-medium text-white">Quick Templates</h4>
        <div className="space-y-2">
          <Card className="p-3 bg-[#2A2A2A] border-[#444] hover:border-[#00D4FF] transition-colors cursor-pointer">
            <div className="text-sm font-medium text-white mb-1">Price Alert → Trade</div>
            <div className="text-xs text-gray-400">Automatically place orders when price conditions are met</div>
          </Card>
          <Card className="p-3 bg-[#2A2A2A] border-[#444] hover:border-[#00D4FF] transition-colors cursor-pointer">
            <div className="text-sm font-medium text-white mb-1">Schedule → Rebalance</div>
            <div className="text-xs text-gray-400">Periodically rebalance your portfolio</div>
          </Card>
          <Card className="p-3 bg-[#2A2A2A] border-[#444] hover:border-[#00D4FF] transition-colors cursor-pointer">
            <div className="text-sm font-medium text-white mb-1">Trade → Notify</div>
            <div className="text-xs text-gray-400">Send Discord notifications for all trades</div>
          </Card>
        </div>
      </div>
    </div>
  )
}
