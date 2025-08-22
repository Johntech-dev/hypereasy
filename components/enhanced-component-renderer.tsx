"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import type { BuilderComponent } from "./no-code-builder"
import { 
  TrendingUp, 
  ShoppingCart, 
  Wallet, 
  Code, 
  Bell, 
  BarChart3, 
  Timer, 
  Zap,
  DollarSign,
  Shield,
  Target,
  Activity,
  Database,
  MessageSquare,
  Calculator,
  Layers,
  Lock,
  Repeat,
  TrendingDown,
  AlertTriangle,
  Brain,
  Gauge,
  LineChart,
  PieChart,
  Settings,
  Webhook,
  Mail,
  Smartphone,
  Cloud,
  Filter,
  ArrowUpDown,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  XCircle,
  Circle,
  Wifi,
  WifiOff
} from "lucide-react"

interface EnhancedComponentRendererProps {
  component: BuilderComponent
  previewMode: boolean
  connectingMode: boolean
  onStartConnection: (componentId: string, output: string) => void
  isSelected?: boolean
  connectionPorts?: {
    inputs: string[]
    outputs: string[]
  }
}

interface ComponentData {
  status: "active" | "inactive" | "processing" | "error"
  data: any
  lastUpdate: Date
}

export function EnhancedComponentRenderer({ 
  component, 
  previewMode, 
  connectingMode, 
  onStartConnection,
  isSelected = false,
  connectionPorts = { inputs: ["input"], outputs: ["output"] }
}: EnhancedComponentRendererProps) {
  const [componentData, setComponentData] = useState<ComponentData>({
    status: "inactive",
    data: null,
    lastUpdate: new Date()
  })

  // Simulate live data updates
  useEffect(() => {
    if (previewMode) {
      const interval = setInterval(() => {
        setComponentData(prev => ({
          ...prev,
          status: Math.random() > 0.1 ? "active" : "processing",
          data: generateMockData(component.type),
          lastUpdate: new Date()
        }))
      }, 3000 + Math.random() * 2000)

      return () => clearInterval(interval)
    }
  }, [previewMode, component.type])

  const getComponentIcon = (type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      "place-order": <ShoppingCart className="w-5 h-5" />,
      "market-data": <TrendingUp className="w-5 h-5" />,
      "user-balance": <Wallet className="w-5 h-5" />,
      "vault-manager": <BarChart3 className="w-5 h-5" />,
      "contract-call": <Code className="w-5 h-5" />,
      "price-alert": <Bell className="w-5 h-5" />,
      "scheduler": <Timer className="w-5 h-5" />,
      "discord-webhook": <MessageSquare className="w-5 h-5" />,
      "technical-indicators": <LineChart className="w-5 h-5" />,
      "sentiment-analyzer": <Brain className="w-5 h-5" />,
      "position-tracker": <Activity className="w-5 h-5" />,
      "pnl-calculator": <Calculator className="w-5 h-5" />,
      "yield-optimizer": <TrendingUp className="w-5 h-5" />,
      "advanced-order": <Target className="w-5 h-5" />,
      "order-manager": <Layers className="w-5 h-5" />,
      "risk-monitor": <Shield className="w-5 h-5" />,
      "liquidation-protector": <Lock className="w-5 h-5" />,
      "drawdown-limiter": <TrendingDown className="w-5 h-5" />,
      "performance-tracker": <Gauge className="w-5 h-5" />,
      "backtester": <Database className="w-5 h-5" />,
      "email-notifier": <Mail className="w-5 h-5" />,
      "sms-alerts": <Smartphone className="w-5 h-5" />,
      "condition-checker": <Filter className="w-5 h-5" />
    }
    return iconMap[type] || <Circle className="w-5 h-5" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-chart-1 bg-chart-1/10 border-chart-1"
      case "processing": return "text-chart-2 bg-chart-2/10 border-chart-2"
      case "error": return "text-destructive bg-destructive/10 border-destructive"
      default: return "text-muted-foreground bg-muted/10 border-border"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="w-3 h-3" />
      case "processing": return <RotateCcw className="w-3 h-3 animate-spin" />
      case "error": return <XCircle className="w-3 h-3" />
      default: return <Circle className="w-3 h-3" />
    }
  }

  const getCategoryColor = (type: string) => {
    const categoryMap: Record<string, string> = {
      "place-order": "from-chart-1 to-chart-1/70",
      "market-data": "from-chart-2 to-chart-2/70",
      "user-balance": "from-chart-3 to-chart-3/70",
      "vault-manager": "from-chart-4 to-chart-4/70",
      "contract-call": "from-chart-5 to-chart-5/70",
      "price-alert": "from-primary to-primary/70",
      "scheduler": "from-secondary to-secondary/70",
      "discord-webhook": "from-accent to-accent/70"
    }
    return categoryMap[type] || "from-muted to-muted/70"
  }

  return (
    <div className="relative group">
      <Card className={`
        w-80 bg-card border transition-all duration-200 shadow-lg hover:shadow-xl
        ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
        ${connectingMode ? 'hover:ring-2 hover:ring-chart-2 hover:ring-offset-1' : ''}
      `}>
        {/* Header with gradient */}
        <div className={`
          h-2 w-full rounded-t-lg bg-gradient-to-r ${getCategoryColor(component.type)}
        `} />
        
        <div className="p-4">
          {/* Component Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`
                w-10 h-10 rounded-lg bg-gradient-to-r ${getCategoryColor(component.type)} 
                flex items-center justify-center text-primary-foreground shadow-sm
              `}>
                {getComponentIcon(component.type)}
              </div>
              <div>
                <h4 className="font-semibold text-card-foreground text-sm">{component.name}</h4>
                <p className="text-xs text-muted-foreground capitalize">{component.type.replace('-', ' ')}</p>
              </div>
            </div>
            
            {previewMode && (
              <Badge className={`text-xs ${getStatusColor(componentData.status)}`}>
                <div className="flex items-center gap-1">
                  {getStatusIcon(componentData.status)}
                  {componentData.status}
                </div>
              </Badge>
            )}
          </div>

          {/* Component Content */}
          <div className="space-y-3">
            {previewMode ? (
              <LiveComponentPreview 
                type={component.type} 
                config={component.config}
                data={componentData.data}
                status={componentData.status}
              />
            ) : (
              <ComponentConfiguration 
                type={component.type} 
                config={component.config}
              />
            )}
          </div>

          {/* Connection Ports */}
          {!previewMode && (
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
              {/* Input Ports */}
              <div className="flex gap-1">
                {connectionPorts.inputs.map((input, index) => (
                  <div
                    key={input}
                    className="w-3 h-3 rounded-full bg-chart-3 border-2 border-background cursor-pointer hover:scale-110 transition-transform"
                    title={`Input: ${input}`}
                  />
                ))}
              </div>

              {/* Component Type Badge */}
              <Badge variant="outline" className="text-xs border-border">
                {component.type}
              </Badge>

              {/* Output Ports */}
              <div className="flex gap-1">
                {connectionPorts.outputs.map((output, index) => (
                  <div
                    key={output}
                    className="w-3 h-3 rounded-full bg-chart-1 border-2 border-background cursor-pointer hover:scale-110 transition-transform"
                    title={`Output: ${output}`}
                    onClick={() => onStartConnection(component.id, output)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Last Update Timestamp */}
          {previewMode && (
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-border text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${componentData.status === 'active' ? 'bg-chart-1' : 'bg-muted-foreground'}`} />
                <span>Last update: {componentData.lastUpdate.toLocaleTimeString()}</span>
              </div>
              {componentData.status === 'active' && (
                <div className="flex items-center gap-1">
                  <Wifi className="w-3 h-3 text-chart-1" />
                  <span>Live</span>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

function LiveComponentPreview({ type, config, data, status }: { 
  type: string
  config: any
  data: any
  status: string 
}) {
  switch (type) {
    case "market-data":
      return (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Price</span>
            <span className="font-mono text-chart-1 font-semibold">
              ${data?.price?.toLocaleString() || '3,245.67'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">24h Change</span>
            <span className={`font-mono text-sm ${data?.change >= 0 ? 'text-chart-1' : 'text-destructive'}`}>
              {data?.change >= 0 ? '+' : ''}{data?.change?.toFixed(2) || '+2.34'}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-1.5">
            <div 
              className={`bg-gradient-to-r from-chart-1 to-chart-2 h-1.5 rounded-full transition-all duration-500`}
              style={{ width: `${Math.min(Math.abs(data?.change || 2.34) * 10, 100)}%` }}
            />
          </div>
        </div>
      )

    case "place-order":
      return (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Asset</span>
            <Badge className="bg-chart-1/10 text-chart-1 border-chart-1">
              {config.asset || 'ETH'}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Side</span>
            <Badge className={`${config.side === 'buy' ? 'bg-chart-1/10 text-chart-1 border-chart-1' : 'bg-destructive/10 text-destructive border-destructive'}`}>
              {config.side || 'buy'}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Amount</span>
            <span className="font-mono text-sm text-card-foreground">
              {config.amount || '1.0'} {config.asset || 'ETH'}
            </span>
          </div>
          {status === 'processing' && (
            <Progress value={data?.progress || 45} className="h-1.5" />
          )}
        </div>
      )

    case "price-alert":
      return (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Watching</span>
            <Badge className="bg-chart-2/10 text-chart-2 border-chart-2">
              {config.asset || 'ETH'}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Condition</span>
            <span className="text-sm text-card-foreground">
              {config.condition || 'above'} ${config.target || '3000'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-chart-1 animate-pulse' : 'bg-muted-foreground'}`} />
            <span className="text-xs text-muted-foreground">
              {status === 'active' ? 'Monitoring' : 'Inactive'}
            </span>
          </div>
        </div>
      )

    case "user-balance":
      return (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="font-mono text-chart-1 font-semibold">
              ${data?.total?.toLocaleString() || '12,345.67'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Available</span>
            <span className="font-mono text-chart-2 text-sm">
              ${data?.available?.toLocaleString() || '8,234.56'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">In Orders</span>
            <span className="font-mono text-chart-3 text-sm">
              ${data?.orders?.toLocaleString() || '4,111.11'}
            </span>
          </div>
        </div>
      )

    default:
      return (
        <div className="text-center py-2">
          <div className={`w-8 h-8 mx-auto mb-2 rounded-full bg-gradient-to-r ${getCategoryColor(type)} flex items-center justify-center`}>
            <Activity className="w-4 h-4 text-primary-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">Component active</p>
        </div>
      )
  }
}

function ComponentConfiguration({ type, config }: { type: string, config: any }) {
  const getConfigSummary = () => {
    switch (type) {
      case "place-order":
        return (
          <div className="space-y-1 text-xs">
            <div>Asset: <span className="text-chart-1">{config.asset || 'Not set'}</span></div>
            <div>Type: <span className="text-chart-2">{config.orderType || 'market'}</span></div>
            <div>Amount: <span className="text-chart-3">{config.amount || 'Not set'}</span></div>
          </div>
        )
      case "market-data":
        return (
          <div className="space-y-1 text-xs">
            <div>Assets: <span className="text-chart-1">{config.assets || 'ETH,BTC'}</span></div>
            <div>Interval: <span className="text-chart-2">{config.refreshInterval || '5'}s</span></div>
          </div>
        )
      case "price-alert":
        return (
          <div className="space-y-1 text-xs">
            <div>Asset: <span className="text-chart-1">{config.asset || 'ETH'}</span></div>
            <div>Condition: <span className="text-chart-2">{config.condition || 'above'}</span></div>
            <div>Target: <span className="text-chart-3">${config.target || '3000'}</span></div>
          </div>
        )
      default:
        return (
          <div className="text-center py-2">
            <p className="text-xs text-muted-foreground">Click to configure</p>
          </div>
        )
    }
  }

  return (
    <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
      {getConfigSummary()}
    </div>
  )
}

function generateMockData(type: string) {
  switch (type) {
    case "market-data":
      return {
        price: 3000 + Math.random() * 500,
        change: (Math.random() - 0.5) * 10
      }
    case "place-order":
      return {
        progress: Math.random() * 100
      }
    case "user-balance":
      return {
        total: 10000 + Math.random() * 5000,
        available: 8000 + Math.random() * 2000,
        orders: 2000 + Math.random() * 1000
      }
    default:
      return {}
  }
}

function getCategoryColor(type: string) {
  const categoryMap: Record<string, string> = {
    "place-order": "from-chart-1 to-chart-1/70",
    "market-data": "from-chart-2 to-chart-2/70",
    "user-balance": "from-chart-3 to-chart-3/70",
    "vault-manager": "from-chart-4 to-chart-4/70",
    "contract-call": "from-chart-5 to-chart-5/70",
    "price-alert": "from-primary to-primary/70",
    "scheduler": "from-secondary to-secondary/70",
    "discord-webhook": "from-accent to-accent/70"
  }
  return categoryMap[type] || "from-muted to-muted/70"
}
