"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  TrendingUp, 
  ShoppingCart, 
  Wallet, 
  Code, 
  Bell, 
  BarChart3, 
  Timer, 
  Zap,
  Search,
  DollarSign,
  Shield,
  Target,
  Activity,
  Database,
  MessageSquare,
  Globe,
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
  ArrowUpDown
} from "lucide-react"

interface ComponentType {
  type: string
  name: string
  description: string
  icon: React.ReactNode
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  premium?: boolean
  inputs: string[]
  outputs: string[]
  configurable: boolean
  examples?: string[]
}

const ENHANCED_COMPONENTS: ComponentType[] = [
  // Trading Components
  {
    type: "place-order",
    name: "Place Order",
    description: "Execute buy/sell orders with advanced options",
    icon: <ShoppingCart className="w-5 h-5" />,
    category: "Trading",
    difficulty: "Beginner",
    inputs: ["trigger", "price", "amount"],
    outputs: ["order_result", "order_id"],
    configurable: true,
    examples: ["Market buy ETH", "Limit sell BTC", "Stop loss order"]
  },
  {
    type: "advanced-order",
    name: "Advanced Order",
    description: "Complex orders with multiple conditions",
    icon: <Target className="w-5 h-5" />,
    category: "Trading",
    difficulty: "Advanced",
    premium: true,
    inputs: ["conditions", "parameters"],
    outputs: ["execution", "status"],
    configurable: true,
    examples: ["OCO orders", "Iceberg orders", "TWAP execution"]
  },
  {
    type: "order-manager",
    name: "Order Manager",
    description: "Manage multiple orders with smart routing",
    icon: <Layers className="w-5 h-5" />,
    category: "Trading",
    difficulty: "Intermediate",
    inputs: ["orders", "market_data"],
    outputs: ["managed_orders", "status"],
    configurable: true,
    examples: ["Order batching", "Smart routing", "Execution optimization"]
  },

  // Market Data Components
  {
    type: "market-data",
    name: "Market Data",
    description: "Real-time price feeds and market information",
    icon: <TrendingUp className="w-5 h-5" />,
    category: "Data",
    difficulty: "Beginner",
    inputs: ["asset_list"],
    outputs: ["price_data", "volume_data", "market_info"],
    configurable: true,
    examples: ["ETH price", "BTC orderbook", "Market overview"]
  },
  {
    type: "technical-indicators",
    name: "Technical Indicators",
    description: "Calculate RSI, MACD, Bollinger Bands, and more",
    icon: <LineChart className="w-5 h-5" />,
    category: "Data",
    difficulty: "Intermediate",
    inputs: ["price_data", "timeframe"],
    outputs: ["indicator_values", "signals"],
    configurable: true,
    examples: ["RSI signals", "MACD crossover", "Bollinger squeeze"]
  },
  {
    type: "sentiment-analyzer",
    name: "Sentiment Analyzer",
    description: "Analyze market sentiment from multiple sources",
    icon: <Brain className="w-5 h-5" />,
    category: "Data",
    difficulty: "Advanced",
    premium: true,
    inputs: ["news_feeds", "social_data"],
    outputs: ["sentiment_score", "confidence"],
    configurable: true,
    examples: ["Twitter sentiment", "News analysis", "Fear & Greed index"]
  },

  // Account Management
  {
    type: "user-balance",
    name: "User Balance",
    description: "Get account balances and positions",
    icon: <Wallet className="w-5 h-5" />,
    category: "Account",
    difficulty: "Beginner",
    inputs: ["account_id"],
    outputs: ["balances", "positions", "pnl"],
    configurable: false,
    examples: ["Portfolio overview", "Asset allocation", "P&L tracking"]
  },
  {
    type: "position-tracker",
    name: "Position Tracker",
    description: "Advanced position monitoring and analytics",
    icon: <Activity className="w-5 h-5" />,
    category: "Account",
    difficulty: "Intermediate",
    inputs: ["positions"],
    outputs: ["metrics", "alerts", "recommendations"],
    configurable: true,
    examples: ["Position size alerts", "Risk metrics", "Performance tracking"]
  },
  {
    type: "pnl-calculator",
    name: "P&L Calculator",
    description: "Real-time profit/loss calculation and reporting",
    icon: <Calculator className="w-5 h-5" />,
    category: "Account",
    difficulty: "Beginner",
    inputs: ["trades", "positions"],
    outputs: ["realized_pnl", "unrealized_pnl", "metrics"],
    configurable: true,
    examples: ["Daily P&L", "Trade analysis", "Performance reports"]
  },

  // Vault Management
  {
    type: "vault-manager",
    name: "Vault Manager",
    description: "Deposit/withdraw from Hyperliquid vaults",
    icon: <BarChart3 className="w-5 h-5" />,
    category: "Vaults",
    difficulty: "Beginner",
    inputs: ["amount", "action"],
    outputs: ["transaction", "vault_status"],
    configurable: true,
    examples: ["Auto deposit", "Yield harvesting", "Vault rebalancing"]
  },
  {
    type: "yield-optimizer",
    name: "Yield Optimizer",
    description: "Automatically optimize yield across vaults",
    icon: <TrendingUp className="w-5 h-5" />,
    category: "Vaults",
    difficulty: "Advanced",
    premium: true,
    inputs: ["vault_data", "strategy"],
    outputs: ["optimization", "migration"],
    configurable: true,
    examples: ["Yield farming", "Auto compounding", "Vault migration"]
  },

  // Smart Contracts
  {
    type: "contract-call",
    name: "Contract Call",
    description: "Interact with HyperEVM smart contracts",
    icon: <Code className="w-5 h-5" />,
    category: "Contracts",
    difficulty: "Advanced",
    inputs: ["contract_address", "method", "parameters"],
    outputs: ["result", "transaction_hash"],
    configurable: true,
    examples: ["DeFi protocols", "Custom logic", "Cross-chain bridges"]
  },
  {
    type: "contract-deployer",
    name: "Contract Deployer",
    description: "Deploy smart contracts to HyperEVM",
    icon: <Cloud className="w-5 h-5" />,
    category: "Contracts",
    difficulty: "Advanced",
    premium: true,
    inputs: ["contract_code", "parameters"],
    outputs: ["contract_address", "deployment_status"],
    configurable: true,
    examples: ["Custom strategies", "Automated protocols", "Token contracts"]
  },

  // Automation & Triggers
  {
    type: "price-alert",
    name: "Price Alert",
    description: "Trigger actions when price conditions are met",
    icon: <Bell className="w-5 h-5" />,
    category: "Automation",
    difficulty: "Beginner",
    inputs: ["price_conditions"],
    outputs: ["alert_trigger", "price_data"],
    configurable: true,
    examples: ["Price breakout", "Support/resistance", "Volatility alerts"]
  },
  {
    type: "scheduler",
    name: "Scheduler",
    description: "Execute actions on a time schedule",
    icon: <Timer className="w-5 h-5" />,
    category: "Automation",
    difficulty: "Beginner",
    inputs: ["schedule_config"],
    outputs: ["trigger", "timestamp"],
    configurable: true,
    examples: ["Daily DCA", "Weekly rebalance", "Monthly reports"]
  },
  {
    type: "condition-checker",
    name: "Condition Checker",
    description: "Complex conditional logic with multiple inputs",
    icon: <Filter className="w-5 h-5" />,
    category: "Automation",
    difficulty: "Intermediate",
    inputs: ["conditions", "data_sources"],
    outputs: ["condition_result", "trigger"],
    configurable: true,
    examples: ["Multi-factor signals", "Risk conditions", "Market regime detection"]
  },

  // Risk Management
  {
    type: "risk-monitor",
    name: "Risk Monitor",
    description: "Monitor portfolio risk and trigger protective actions",
    icon: <Shield className="w-5 h-5" />,
    category: "Risk",
    difficulty: "Intermediate",
    inputs: ["portfolio", "risk_parameters"],
    outputs: ["risk_metrics", "alerts", "actions"],
    configurable: true,
    examples: ["Stop loss", "Position sizing", "Correlation monitoring"]
  },
  {
    type: "liquidation-protector",
    name: "Liquidation Protector",
    description: "Prevent liquidations with automatic actions",
    icon: <Lock className="w-5 h-5" />,
    category: "Risk",
    difficulty: "Advanced",
    inputs: ["positions", "collateral"],
    outputs: ["protection_actions", "status"],
    configurable: true,
    examples: ["Collateral management", "Position reduction", "Emergency exits"]
  },
  {
    type: "drawdown-limiter",
    name: "Drawdown Limiter",
    description: "Limit maximum portfolio drawdown",
    icon: <TrendingDown className="w-5 h-5" />,
    category: "Risk",
    difficulty: "Intermediate",
    inputs: ["portfolio_value", "drawdown_limit"],
    outputs: ["limit_actions", "status"],
    configurable: true,
    examples: ["Portfolio protection", "Risk budgeting", "Capital preservation"]
  },

  // Analytics
  {
    type: "performance-tracker",
    name: "Performance Tracker",
    description: "Track and analyze trading performance",
    icon: <Gauge className="w-5 h-5" />,
    category: "Analytics",
    difficulty: "Intermediate",
    inputs: ["trades", "benchmarks"],
    outputs: ["performance_metrics", "reports"],
    configurable: true,
    examples: ["Sharpe ratio", "Win rate", "Risk-adjusted returns"]
  },
  {
    type: "backtester",
    name: "Backtester",
    description: "Test strategies against historical data",
    icon: <Database className="w-5 h-5" />,
    category: "Analytics",
    difficulty: "Advanced",
    premium: true,
    inputs: ["strategy", "historical_data"],
    outputs: ["backtest_results", "metrics"],
    configurable: true,
    examples: ["Strategy validation", "Parameter optimization", "Risk analysis"]
  },

  // Notifications
  {
    type: "discord-webhook",
    name: "Discord Webhook",
    description: "Send notifications to Discord channels",
    icon: <MessageSquare className="w-5 h-5" />,
    category: "Notifications",
    difficulty: "Beginner",
    inputs: ["message", "webhook_url"],
    outputs: ["delivery_status"],
    configurable: true,
    examples: ["Trade alerts", "Performance reports", "Risk notifications"]
  },
  {
    type: "email-notifier",
    name: "Email Notifier",
    description: "Send email notifications and reports",
    icon: <Mail className="w-5 h-5" />,
    category: "Notifications",
    difficulty: "Beginner",
    inputs: ["message", "recipients"],
    outputs: ["delivery_status"],
    configurable: true,
    examples: ["Daily reports", "Alert emails", "Performance summaries"]
  },
  {
    type: "sms-alerts",
    name: "SMS Alerts",
    description: "Send SMS alerts for critical events",
    icon: <Smartphone className="w-5 h-5" />,
    category: "Notifications",
    difficulty: "Beginner",
    premium: true,
    inputs: ["message", "phone_number"],
    outputs: ["delivery_status"],
    configurable: true,
    examples: ["Emergency alerts", "Liquidation warnings", "Critical updates"]
  }
]

const CATEGORIES = [
  "All",
  "Trading",
  "Data", 
  "Account",
  "Vaults",
  "Contracts",
  "Automation",
  "Risk",
  "Analytics",
  "Notifications"
]

interface EnhancedComponentLibraryProps {
  onAddComponent: (type: string, name: string) => void
}

export function EnhancedComponentLibrary({ onAddComponent }: EnhancedComponentLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)

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

  const filteredComponents = ENHANCED_COMPONENTS.filter((component) => {
    const matchesSearch = 
      component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || component.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "All" || component.difficulty === selectedDifficulty
    const matchesPremium = !showPremiumOnly || component.premium

    return matchesSearch && matchesCategory && matchesDifficulty && matchesPremium
  })

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      Beginner: "border-green-500 text-green-400 bg-green-500/10",
      Intermediate: "border-yellow-500 text-yellow-400 bg-yellow-500/10",
      Advanced: "border-red-500 text-red-400 bg-red-500/10",
    }
    return colors[difficulty as keyof typeof colors] || "border-gray-500 text-gray-400"
  }

  const categorizedComponents = CATEGORIES.slice(1).map(category => ({
    category,
    components: filteredComponents.filter(c => c.category === category)
  })).filter(group => group.components.length > 0)

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-8"
          />
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-3 bg-[#2A2A2A] h-8">
            <TabsTrigger value="All" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="Trading" className="text-xs">Trading</TabsTrigger>
            <TabsTrigger value="Data" className="text-xs">Data</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Component Categories */}
      <div className="space-y-6 max-h-[60vh] overflow-y-auto">
        {selectedCategory === "All" ? (
          categorizedComponents.map(({ category, components }) => (
            <CategorySection
              key={category}
              category={category}
              components={components}
              onDragStart={handleDragStart}
              onAddComponent={onAddComponent}
            />
          ))
        ) : (
          <CategorySection
            category={selectedCategory}
            components={filteredComponents}
            onDragStart={handleDragStart}
            onAddComponent={onAddComponent}
          />
        )}
      </div>

      {filteredComponents.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <div className="text-sm">No components found</div>
        </div>
      )}
    </div>
  )
}

function CategorySection({ 
  category, 
  components, 
  onDragStart, 
  onAddComponent 
}: {
  category: string
  components: ComponentType[]
  onDragStart: (e: React.DragEvent, component: ComponentType) => void
  onAddComponent: (type: string, name: string) => void
}) {
  if (components.length === 0) return null

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      Beginner: "border-green-500 text-green-400 bg-green-500/10",
      Intermediate: "border-yellow-500 text-yellow-400 bg-yellow-500/10", 
      Advanced: "border-red-500 text-red-400 bg-red-500/10",
    }
    return colors[difficulty as keyof typeof colors] || "border-gray-500 text-gray-400"
  }

  return (
    <div>
      <h3 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wide flex items-center gap-2">
        {category}
        <Badge variant="outline" className="border-gray-600 text-gray-500 text-xs">
          {components.length}
        </Badge>
      </h3>
      <div className="space-y-2">
        {components.map((component) => (
          <Card
            key={component.type}
            className="p-3 bg-[#2A2A2A] border-[#444] hover:border-[#00D4FF] transition-all duration-200 cursor-grab active:cursor-grabbing group"
            draggable
            onDragStart={(e) => onDragStart(e, component)}
          >
            <div className="flex items-start gap-3">
              <div className="text-[#00D4FF] mt-0.5 group-hover:scale-110 transition-transform">
                {component.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-medium text-white group-hover:text-[#00D4FF] transition-colors">
                    {component.name}
                  </h4>
                  {component.premium && (
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs">
                      Pro
                    </Badge>
                  )}
                  <Badge className={`text-xs ${getDifficultyColor(component.difficulty)}`}>
                    {component.difficulty}
                  </Badge>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed mb-2">
                  {component.description}
                </p>
                
                {/* I/O Info */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                  <div className="flex items-center gap-1">
                    <ArrowUpDown className="w-3 h-3" />
                    <span>{component.inputs.length} inputs</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Settings className="w-3 h-3" />
                    <span>{component.configurable ? "Configurable" : "Fixed"}</span>
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={() => onAddComponent(component.type, component.name)}
                  className="h-6 px-3 bg-[#00D4FF] hover:bg-[#00B8E6] text-black text-xs font-medium"
                >
                  Add Component
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
