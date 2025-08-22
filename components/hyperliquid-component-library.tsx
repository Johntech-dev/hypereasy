"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  Wallet, 
  Shield, 
  Zap, 
  Target, 
  BarChart3, 
  Lock, 
  Coins, 
  ArrowUpDown, 
  Bot, 
  AlertTriangle,
  DollarSign,
  LineChart,
  PieChart,
  Activity,
  Layers,
  Code,
  Database,
  Globe,
  Search,
  Filter
} from "lucide-react"

interface HyperliquidComponent {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: "Trading" | "DeFi" | "Analytics" | "Smart Contracts" | "Assets" | "Risk Management" | "Infrastructure" | "Advanced Trading" | "MEV" | "Cross-Chain"
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  inputs: string[]
  outputs: string[]
  features: string[]
  hyperliquidSpecific: boolean
  gasOptimized?: boolean
  realTimeData?: boolean
  configOptions?: {
    [key: string]: {
      type: "number" | "string" | "boolean" | "select" | "range"
      default: any
      options?: any[]
      min?: number
      max?: number
      description: string
    }
  }
  smartContract?: {
    name: string
    address: string
    abi: string[]
    verified: boolean
    gasLimit?: number
  }
  performance?: {
    avgGas: string
    latency: string
    reliability: string
  }
}

const hyperliquidAssets = [
  { symbol: "USDC", name: "USD Coin", type: "Stablecoin", address: "0x..." },
  { symbol: "PURR", name: "Hyperliquid PURR Token", type: "Utility", address: "0x..." },
  { symbol: "HLP", name: "Hyperliquid LP Token", type: "LP", address: "0x..." },
  { symbol: "ETH", name: "Ethereum", type: "Crypto", address: "0x..." },
  { symbol: "BTC", name: "Bitcoin", type: "Crypto", address: "0x..." },
  { symbol: "SOL", name: "Solana", type: "Crypto", address: "0x..." },
  { symbol: "ARB", name: "Arbitrum", type: "Crypto", address: "0x..." },
  { symbol: "DOGE", name: "Dogecoin", type: "Crypto", address: "0x..." },
  { symbol: "WIF", name: "dogwifhat", type: "Meme", address: "0x..." },
  { symbol: "PEPE", name: "Pepe", type: "Meme", address: "0x..." }
]

const hyperliquidComponents: HyperliquidComponent[] = [
  // Trading Components
  {
    id: "hl-spot-trader",
    name: "Hyperliquid Spot Trader",
    description: "Execute spot trades on Hyperliquid with advanced order types and real-time execution",
    icon: <TrendingUp className="w-5 h-5" />,
    category: "Trading",
    difficulty: "Beginner",
    inputs: ["asset", "quantity", "orderType", "price", "timeInForce"],
    outputs: ["orderStatus", "fillPrice", "fees", "slippage", "executionTime"],
    features: ["Market Orders", "Limit Orders", "Stop Loss", "Take Profit", "IOC/FOK", "Post-Only"],
    hyperliquidSpecific: true,
    gasOptimized: true,
    realTimeData: true,
    configOptions: {
      orderType: {
        type: "select",
        default: "limit",
        options: ["market", "limit", "stop", "stop_limit"],
        description: "Type of order to place"
      },
      slippageTolerance: {
        type: "range",
        default: 0.5,
        min: 0.1,
        max: 5.0,
        description: "Maximum slippage tolerance (%)"
      },
      maxRetries: {
        type: "number",
        default: 3,
        min: 1,
        max: 10,
        description: "Maximum retry attempts for failed orders"
      },
      autoCancel: {
        type: "boolean",
        default: true,
        description: "Auto-cancel unfilled orders after timeout"
      }
    },
    performance: {
      avgGas: "~50,000",
      latency: "<100ms",
      reliability: "99.9%"
    }
  },
  {
    id: "hl-perp-trader",
    name: "Hyperliquid Perpetuals Trader",
    description: "Trade perpetual futures with up to 50x leverage",
    icon: <Zap className="w-5 h-5" />,
    category: "Trading",
    difficulty: "Intermediate",
    inputs: ["asset", "size", "leverage", "orderType", "reduceOnly"],
    outputs: ["position", "pnl", "margin", "liquidationPrice"],
    features: ["Up to 50x Leverage", "Cross/Isolated Margin", "Auto-Deleveraging", "Funding Rates"],
    hyperliquidSpecific: true
  },
  {
    id: "hl-grid-bot",
    name: "Hyperliquid Grid Trading Bot",
    description: "Automated grid trading strategy for range-bound markets",
    icon: <Bot className="w-5 h-5" />,
    category: "Trading",
    difficulty: "Advanced",
    inputs: ["asset", "gridLevels", "priceRange", "capital", "leverage"],
    outputs: ["activeOrders", "profit", "gridStatus"],
    features: ["Dynamic Grid Adjustment", "Profit Compounding", "Stop Loss Protection"],
    hyperliquidSpecific: true
  },

  // DeFi Components
  {
    id: "hl-vault-manager",
    name: "Hyperliquid Vault Manager",
    description: "Create and manage Hyperliquid vaults for automated strategies",
    icon: <Lock className="w-5 h-5" />,
    category: "DeFi",
    difficulty: "Advanced",
    inputs: ["strategy", "maxDrawdown", "feeStructure", "minDeposit"],
    outputs: ["vaultAddress", "performance", "deposits", "withdrawals"],
    features: ["Strategy Automation", "Fee Collection", "Performance Tracking", "Investor Management"],
    hyperliquidSpecific: true,
    smartContract: {
      name: "HyperliquidVault",
      address: "0x1234567890123456789012345678901234567890",
      abi: ["function deposit(uint256)", "function withdraw(uint256)", "function getBalance()"]
    }
  },
  {
    id: "hl-liquidity-provider",
    name: "HLP Liquidity Provider",
    description: "Provide liquidity to Hyperliquid's native liquidity pool",
    icon: <Coins className="w-5 h-5" />,
    category: "DeFi",
    difficulty: "Intermediate",
    inputs: ["amount", "duration", "autoCompound"],
    outputs: ["hlpTokens", "rewards", "apr"],
    features: ["Auto-Compounding", "Reward Tracking", "Impermanent Loss Protection"],
    hyperliquidSpecific: true
  },
  {
    id: "hl-yield-farmer",
    name: "Hyperliquid Yield Farmer",
    description: "Automated yield farming across Hyperliquid protocols",
    icon: <Target className="w-5 h-5" />,
    category: "DeFi",
    difficulty: "Advanced",
    inputs: ["strategies", "riskTolerance", "rebalanceFrequency"],
    outputs: ["totalYield", "allocations", "performance"],
    features: ["Multi-Strategy", "Auto-Rebalancing", "Risk Management", "Gas Optimization"],
    hyperliquidSpecific: true
  },

  // Analytics Components
  {
    id: "hl-market-data",
    name: "Hyperliquid Market Data",
    description: "Real-time market data and analytics from Hyperliquid",
    icon: <BarChart3 className="w-5 h-5" />,
    category: "Analytics",
    difficulty: "Beginner",
    inputs: ["assets", "timeframe", "indicators"],
    outputs: ["prices", "volume", "orderbook", "funding"],
    features: ["Real-time Data", "Historical Analysis", "Technical Indicators", "Market Depth"],
    hyperliquidSpecific: true
  },
  {
    id: "hl-portfolio-tracker",
    name: "Hyperliquid Portfolio Tracker",
    description: "Track and analyze your Hyperliquid portfolio performance",
    icon: <PieChart className="w-5 h-5" />,
    category: "Analytics",
    difficulty: "Intermediate",
    inputs: ["walletAddress", "timeRange"],
    outputs: ["totalValue", "pnl", "allocations", "performance"],
    features: ["Real-time Tracking", "P&L Analysis", "Asset Allocation", "Performance Metrics"],
    hyperliquidSpecific: true
  },
  {
    id: "hl-risk-monitor",
    name: "Hyperliquid Risk Monitor",
    description: "Monitor and manage trading risks across positions",
    icon: <AlertTriangle className="w-5 h-5" />,
    category: "Risk Management",
    difficulty: "Advanced",
    inputs: ["positions", "riskLimits", "alertThresholds"],
    outputs: ["riskMetrics", "alerts", "recommendations"],
    features: ["Position Sizing", "VAR Calculation", "Correlation Analysis", "Alert System"],
    hyperliquidSpecific: true
  },

  // Smart Contracts
  {
    id: "hl-trading-contract",
    name: "Hyperliquid Trading Smart Contract",
    description: "Deploy custom trading logic as a smart contract",
    icon: <Code className="w-5 h-5" />,
    category: "Smart Contracts",
    difficulty: "Advanced",
    inputs: ["tradingLogic", "riskParameters", "permissions"],
    outputs: ["contractAddress", "gasUsed", "executionStatus"],
    features: ["Custom Logic", "Gas Optimization", "Permission System", "Upgradeable"],
    hyperliquidSpecific: true,
    smartContract: {
      name: "HyperliquidTradingBot",
      address: "0xabcdef1234567890abcdef1234567890abcdef12",
      abi: ["function executeTrade()", "function setStrategy()", "function withdraw()"]
    }
  },
  {
    id: "hl-oracle-contract",
    name: "Hyperliquid Price Oracle",
    description: "Access Hyperliquid's native price feeds in smart contracts",
    icon: <Database className="w-5 h-5" />,
    category: "Smart Contracts",
    difficulty: "Intermediate",
    inputs: ["assets", "updateFrequency"],
    outputs: ["prices", "timestamps", "confidence"],
    features: ["Real-time Prices", "Confidence Intervals", "Historical Data", "Failsafe Mechanisms"],
    hyperliquidSpecific: true,
    smartContract: {
      name: "HyperliquidOracle",
      address: "0x9876543210987654321098765432109876543210",
      abi: ["function getPrice(string)", "function getTimestamp()", "function getConfidence()"]
    }
  },

  // Infrastructure
  {
    id: "hl-webhook-handler",
    name: "Hyperliquid Webhook Handler",
    description: "Handle real-time events from Hyperliquid via webhooks",
    icon: <Globe className="w-5 h-5" />,
    category: "Infrastructure",
    difficulty: "Intermediate",
    inputs: ["events", "filters", "endpoints"],
    outputs: ["processedEvents", "responses", "errors"],
    features: ["Real-time Events", "Custom Filters", "Retry Logic", "Rate Limiting"],
    hyperliquidSpecific: true,
    configOptions: {
      maxConcurrency: {
        type: "number",
        default: 10,
        min: 1,
        max: 100,
        description: "Maximum concurrent webhook processing"
      },
      retryAttempts: {
        type: "number",
        default: 3,
        min: 1,
        max: 10,
        description: "Number of retry attempts for failed webhooks"
      },
      timeoutMs: {
        type: "number",
        default: 5000,
        min: 1000,
        max: 30000,
        description: "Webhook timeout in milliseconds"
      }
    }
  },
  {
    id: "hl-api-connector",
    name: "Hyperliquid API Connector",
    description: "Connect to Hyperliquid's REST and WebSocket APIs",
    icon: <Layers className="w-5 h-5" />,
    category: "Infrastructure",
    difficulty: "Beginner",
    inputs: ["apiKey", "endpoints", "rateLimit"],
    outputs: ["responses", "errors", "connectionStatus"],
    features: ["REST API", "WebSocket", "Rate Limiting", "Error Handling", "Authentication"],
    hyperliquidSpecific: true,
    realTimeData: true,
    configOptions: {
      rateLimit: {
        type: "number",
        default: 100,
        min: 10,
        max: 1000,
        description: "API requests per minute"
      },
      reconnectAttempts: {
        type: "number",
        default: 5,
        min: 1,
        max: 20,
        description: "WebSocket reconnection attempts"
      },
      heartbeatInterval: {
        type: "number",
        default: 30000,
        min: 5000,
        max: 60000,
        description: "WebSocket heartbeat interval (ms)"
      }
    }
  },

  // Advanced Trading Components
  {
    id: "hl-mev-bot",
    name: "Hyperliquid MEV Bot",
    description: "Capture Maximum Extractable Value opportunities on Hyperliquid",
    icon: <Zap className="w-5 h-5" />,
    category: "MEV",
    difficulty: "Expert",
    inputs: ["mempool", "gasPrice", "profitThreshold", "strategies"],
    outputs: ["mevOpportunities", "profitExtracted", "successRate"],
    features: ["Sandwich Attacks", "Arbitrage Detection", "Front-running Protection", "Gas Optimization"],
    hyperliquidSpecific: true,
    gasOptimized: true,
    realTimeData: true,
    configOptions: {
      minProfitUsd: {
        type: "number",
        default: 10,
        min: 1,
        max: 1000,
        description: "Minimum profit threshold in USD"
      },
      maxGasPrice: {
        type: "number",
        default: 100,
        min: 10,
        max: 500,
        description: "Maximum gas price in gwei"
      },
      strategies: {
        type: "select",
        default: "arbitrage",
        options: ["arbitrage", "sandwich", "liquidation", "all"],
        description: "MEV extraction strategies"
      }
    },
    performance: {
      avgGas: "~200,000",
      latency: "<50ms",
      reliability: "95%"
    }
  },
  {
    id: "hl-flash-loan",
    name: "Hyperliquid Flash Loan Engine",
    description: "Execute flash loans for arbitrage and liquidation opportunities",
    icon: <Zap className="w-5 h-5" />,
    category: "Advanced Trading",
    difficulty: "Expert",
    inputs: ["loanAmount", "strategy", "collateral", "repaymentBuffer"],
    outputs: ["loanStatus", "profit", "gasUsed", "executionTime"],
    features: ["Zero Collateral", "Instant Execution", "Profit Guarantee", "Gas Optimization"],
    hyperliquidSpecific: true,
    gasOptimized: true,
    smartContract: {
      name: "HyperliquidFlashLoan",
      address: "0xFlashLoan1234567890123456789012345678901234",
      abi: ["function flashLoan(uint256,bytes)", "function executeStrategy()", "function repayLoan()"],
      verified: true,
      gasLimit: 500000
    },
    configOptions: {
      maxLoanAmount: {
        type: "number",
        default: 100000,
        min: 1000,
        max: 10000000,
        description: "Maximum loan amount in USDC"
      },
      profitMargin: {
        type: "range",
        default: 0.1,
        min: 0.01,
        max: 1.0,
        description: "Minimum profit margin (%)"
      },
      slippageTolerance: {
        type: "range",
        default: 0.5,
        min: 0.1,
        max: 2.0,
        description: "Maximum slippage tolerance (%)"
      }
    },
    performance: {
      avgGas: "~350,000",
      latency: "<200ms",
      reliability: "98%"
    }
  },
  {
    id: "hl-liquidation-bot",
    name: "Hyperliquid Liquidation Bot",
    description: "Automated liquidation of undercollateralized positions for profit",
    icon: <AlertTriangle className="w-5 h-5" />,
    category: "Advanced Trading",
    difficulty: "Advanced",
    inputs: ["positions", "healthThreshold", "gasPrice", "profitMargin"],
    outputs: ["liquidatedPositions", "profit", "gasUsed", "successRate"],
    features: ["Health Monitoring", "Gas Optimization", "Profit Calculation", "Risk Management"],
    hyperliquidSpecific: true,
    gasOptimized: true,
    realTimeData: true,
    configOptions: {
      healthThreshold: {
        type: "range",
        default: 1.1,
        min: 1.0,
        max: 1.5,
        description: "Position health threshold for liquidation"
      },
      minProfitUsd: {
        type: "number",
        default: 50,
        min: 10,
        max: 1000,
        description: "Minimum profit threshold in USD"
      },
      maxGasPrice: {
        type: "number",
        default: 150,
        min: 50,
        max: 500,
        description: "Maximum gas price for liquidation"
      }
    },
    performance: {
      avgGas: "~180,000",
      latency: "<100ms",
      reliability: "99.5%"
    }
  },
  {
    id: "hl-cross-chain-bridge",
    name: "Hyperliquid Cross-Chain Bridge",
    description: "Bridge assets between Hyperliquid and other chains efficiently",
    icon: <ArrowUpDown className="w-5 h-5" />,
    category: "Cross-Chain",
    difficulty: "Advanced",
    inputs: ["sourceChain", "targetChain", "asset", "amount", "recipient"],
    outputs: ["bridgeStatus", "fees", "estimatedTime", "transactionHash"],
    features: ["Multi-Chain Support", "Low Fees", "Fast Transfers", "Security Audited"],
    hyperliquidSpecific: true,
    gasOptimized: true,
    configOptions: {
      sourceChain: {
        type: "select",
        default: "ethereum",
        options: ["ethereum", "arbitrum", "polygon", "bsc", "avalanche"],
        description: "Source blockchain"
      },
      bridgeMode: {
        type: "select",
        default: "fast",
        options: ["fast", "secure", "economy"],
        description: "Bridge mode (speed vs cost)"
      },
      slippageTolerance: {
        type: "range",
        default: 0.5,
        min: 0.1,
        max: 3.0,
        description: "Bridge slippage tolerance (%)"
      }
    },
    smartContract: {
      name: "HyperliquidBridge",
      address: "0xBridge1234567890123456789012345678901234567890",
      abi: ["function bridge(address,uint256,uint256)", "function claim(bytes32)", "function getStatus(bytes32)"],
      verified: true,
      gasLimit: 250000
    },
    performance: {
      avgGas: "~120,000",
      latency: "1-10 min",
      reliability: "99.8%"
    }
  }
]

interface HyperliquidComponentLibraryProps {
  onAddComponent: (type: string, name: string) => void
}

export function HyperliquidComponentLibrary({ onAddComponent }: HyperliquidComponentLibraryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All")

  const categories = ["All", "Trading", "DeFi", "Analytics", "Smart Contracts", "Assets", "Risk Management", "Infrastructure", "Advanced Trading", "MEV", "Cross-Chain"]
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced", "Expert"]

  const filteredComponents = hyperliquidComponents.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         component.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || component.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "All" || component.difficulty === selectedDifficulty
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800 border-green-200"
      case "Intermediate": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Advanced": return "bg-red-100 text-red-800 border-red-200"
      case "Expert": return "bg-purple-100 text-purple-800 border-purple-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Trading": return "bg-blue-100 text-blue-800 border-blue-200"
      case "DeFi": return "bg-purple-100 text-purple-800 border-purple-200"
      case "Analytics": return "bg-orange-100 text-orange-800 border-orange-200"
      case "Smart Contracts": return "bg-indigo-100 text-indigo-800 border-indigo-200"
      case "Risk Management": return "bg-red-100 text-red-800 border-red-200"
      case "Infrastructure": return "bg-gray-100 text-gray-800 border-gray-200"
      case "Advanced Trading": return "bg-cyan-100 text-cyan-800 border-cyan-200"
      case "MEV": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Cross-Chain": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-chart-2 p-4 rounded-lg text-white">
        <h3 className="text-lg font-bold mb-2">🚀 Hyperliquid Components</h3>
        <p className="text-sm opacity-90">
          Build production-ready Hyperliquid applications with native components, smart contracts, and real assets
        </p>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search Hyperliquid components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <Filter className="w-3 h-3 text-muted-foreground" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-card border border-border rounded px-2 py-1"
              title="Filter by category"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="text-xs bg-card border border-border rounded px-2 py-1"
            title="Filter by difficulty"
          >
            {difficulties.map(diff => (
              <option key={diff} value={diff}>{diff}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Hyperliquid Assets Quick Access */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Coins className="w-4 h-4 text-primary" />
            Hyperliquid Assets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {hyperliquidAssets.slice(0, 6).map(asset => (
              <button
                key={asset.symbol}
                onClick={() => onAddComponent("asset", `${asset.symbol} Asset`)}
                className="flex items-center gap-2 p-2 bg-muted rounded text-xs hover:bg-muted/80 transition-colors"
              >
                <div className="w-6 h-6 bg-gradient-to-r from-primary to-chart-2 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {asset.symbol[0]}
                </div>
                <div className="text-left">
                  <div className="font-medium">{asset.symbol}</div>
                  <div className="text-muted-foreground text-xs">{asset.type}</div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Components Grid */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredComponents.map(component => (
          <Card key={component.id} className="bg-card border-border hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-chart-2 rounded-lg flex items-center justify-center text-white">
                    {component.icon}
                  </div>
                  <div>
                    <CardTitle className="text-sm">{component.name}</CardTitle>
                    <CardDescription className="text-xs">{component.description}</CardDescription>
                  </div>
                </div>
                {component.hyperliquidSpecific && (
                  <Badge className="bg-primary text-primary-foreground text-xs">
                    Hyperliquid Native
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="flex gap-2 flex-wrap">
                <Badge className={`text-xs ${getCategoryColor(component.category)}`}>
                  {component.category}
                </Badge>
                <Badge className={`text-xs ${getDifficultyColor(component.difficulty)}`}>
                  {component.difficulty}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="text-xs">
                  <div className="font-medium text-foreground mb-1">Key Features:</div>
                  <div className="flex flex-wrap gap-1">
                    {component.features.slice(0, 3).map(feature => (
                      <span key={feature} className="bg-muted px-2 py-1 rounded text-xs">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Performance Metrics */}
                {component.performance && (
                  <div className="text-xs bg-green-50 border border-green-200 rounded p-2">
                    <div className="font-medium text-green-800 mb-1">⚡ Performance:</div>
                    <div className="grid grid-cols-3 gap-1 text-green-600">
                      <div>Gas: {component.performance.avgGas}</div>
                      <div>Speed: {component.performance.latency}</div>
                      <div>Uptime: {component.performance.reliability}</div>
                    </div>
                  </div>
                )}

                {/* Configuration Options */}
                {component.configOptions && (
                  <div className="text-xs bg-blue-50 border border-blue-200 rounded p-2">
                    <div className="font-medium text-blue-800 mb-1">⚙️ Configurable:</div>
                    <div className="text-blue-600">
                      {Object.keys(component.configOptions).length} parameters available
                    </div>
                  </div>
                )}

                {/* Special Badges */}
                <div className="flex gap-1 flex-wrap">
                  {component.gasOptimized && (
                    <Badge className="bg-yellow-100 text-yellow-800 text-xs">⛽ Gas Optimized</Badge>
                  )}
                  {component.realTimeData && (
                    <Badge className="bg-blue-100 text-blue-800 text-xs">📡 Real-time</Badge>
                  )}
                  {component.smartContract?.verified && (
                    <Badge className="bg-green-100 text-green-800 text-xs">✅ Verified</Badge>
                  )}
                </div>

                {component.smartContract && (
                  <div className="text-xs bg-indigo-50 border border-indigo-200 rounded p-2">
                    <div className="font-medium text-indigo-800 mb-1">📋 Smart Contract:</div>
                    <div className="text-indigo-600">{component.smartContract.name}</div>
                    {component.smartContract.gasLimit && (
                      <div className="text-indigo-500">Gas Limit: {component.smartContract.gasLimit.toLocaleString()}</div>
                    )}
                  </div>
                )}
              </div>

              <Button
                size="sm"
                onClick={() => onAddComponent(component.id, component.name)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Add to Canvas
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredComponents.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No components found matching your filters</p>
          <p className="text-xs">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
