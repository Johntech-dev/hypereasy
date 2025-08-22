"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Bot, 
  TrendingUp, 
  Shield, 
  Target, 
  Zap, 
  BarChart3, 
  DollarSign,
  Coins,
  Lock,
  AlertTriangle,
  X,
  Star,
  Users,
  Clock,
  ArrowRight,
  ArrowUpDown
} from "lucide-react"

interface HyperliquidTemplate {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: "Trading Bots" | "DeFi Strategies" | "Risk Management" | "Analytics" | "Vaults"
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  estimatedTime: string
  popularity: number
  components: Array<{
    type: string
    name: string
    config: any
  }>
  connections: Array<{
    from: string
    to: string
  }>
  features: string[]
  expectedReturns?: string
  riskLevel: "Low" | "Medium" | "High"
  minCapital: string
}

const hyperliquidTemplates: HyperliquidTemplate[] = [
  {
    id: "hl-grid-bot-template",
    name: "Hyperliquid Grid Trading Bot",
    description: "Automated grid trading strategy that profits from market volatility by placing buy and sell orders at regular intervals",
    icon: <Bot className="w-6 h-6" />,
    category: "Trading Bots",
    difficulty: "Intermediate",
    estimatedTime: "15 minutes",
    popularity: 95,
    riskLevel: "Medium",
    minCapital: "1,000 USDC",
    expectedReturns: "8-15% APY",
    features: [
      "Automated Grid Orders",
      "Dynamic Price Adjustment",
      "Stop Loss Protection",
      "Profit Compounding",
      "Real-time Monitoring"
    ],
    components: [
      { type: "hl-api-connector", name: "Hyperliquid API", config: {} },
      { type: "hl-grid-bot", name: "Grid Bot", config: { gridLevels: 10, priceRange: "5%" } },
      { type: "hl-risk-monitor", name: "Risk Monitor", config: { maxDrawdown: "10%" } },
      { type: "hl-portfolio-tracker", name: "Portfolio Tracker", config: {} }
    ],
    connections: [
      { from: "hl-api-connector", to: "hl-grid-bot" },
      { from: "hl-grid-bot", to: "hl-risk-monitor" },
      { from: "hl-grid-bot", to: "hl-portfolio-tracker" }
    ]
  },
  {
    id: "hl-momentum-bot-template",
    name: "Hyperliquid Momentum Trading Bot",
    description: "Advanced momentum trading bot that identifies and trades trending assets using technical indicators",
    icon: <TrendingUp className="w-6 h-6" />,
    category: "Trading Bots",
    difficulty: "Advanced",
    estimatedTime: "30 minutes",
    popularity: 87,
    riskLevel: "High",
    minCapital: "5,000 USDC",
    expectedReturns: "15-25% APY",
    features: [
      "Technical Analysis",
      "Multi-Asset Support",
      "Dynamic Position Sizing",
      "Trend Detection",
      "Advanced Risk Management"
    ],
    components: [
      { type: "hl-api-connector", name: "Hyperliquid API", config: {} },
      { type: "hl-market-data", name: "Market Data", config: { indicators: ["RSI", "MACD", "EMA"] } },
      { type: "hl-perp-trader", name: "Perp Trader", config: { leverage: "5x" } },
      { type: "hl-risk-monitor", name: "Risk Monitor", config: { maxDrawdown: "15%" } }
    ],
    connections: [
      { from: "hl-api-connector", to: "hl-market-data" },
      { from: "hl-market-data", to: "hl-perp-trader" },
      { from: "hl-perp-trader", to: "hl-risk-monitor" }
    ]
  },
  {
    id: "hl-vault-strategy-template",
    name: "Hyperliquid Vault Strategy",
    description: "Create a professional vault strategy that manages investor funds with automated trading and risk controls",
    icon: <Lock className="w-6 h-6" />,
    category: "Vaults",
    difficulty: "Advanced",
    estimatedTime: "45 minutes",
    popularity: 78,
    riskLevel: "Medium",
    minCapital: "10,000 USDC",
    expectedReturns: "12-20% APY",
    features: [
      "Investor Management",
      "Fee Collection",
      "Performance Tracking",
      "Automated Strategies",
      "Withdrawal Limits"
    ],
    components: [
      { type: "hl-vault-manager", name: "Vault Manager", config: { feeStructure: "2/20" } },
      { type: "hl-trading-contract", name: "Trading Contract", config: {} },
      { type: "hl-risk-monitor", name: "Risk Monitor", config: { maxDrawdown: "12%" } },
      { type: "hl-portfolio-tracker", name: "Portfolio Tracker", config: {} }
    ],
    connections: [
      { from: "hl-vault-manager", to: "hl-trading-contract" },
      { from: "hl-trading-contract", to: "hl-risk-monitor" },
      { from: "hl-vault-manager", to: "hl-portfolio-tracker" }
    ]
  },
  {
    id: "hl-yield-farming-template",
    name: "Hyperliquid Yield Farming Strategy",
    description: "Automated yield farming across Hyperliquid protocols to maximize returns while managing risk",
    icon: <Target className="w-6 h-6" />,
    category: "DeFi Strategies",
    difficulty: "Intermediate",
    estimatedTime: "20 minutes",
    popularity: 92,
    riskLevel: "Medium",
    minCapital: "2,500 USDC",
    expectedReturns: "10-18% APY",
    features: [
      "Multi-Protocol Support",
      "Auto-Compounding",
      "Yield Optimization",
      "Risk Diversification",
      "Gas Optimization"
    ],
    components: [
      { type: "hl-yield-farmer", name: "Yield Farmer", config: { strategies: ["HLP", "PURR"] } },
      { type: "hl-liquidity-provider", name: "LP Provider", config: { autoCompound: true } },
      { type: "hl-portfolio-tracker", name: "Portfolio Tracker", config: {} },
      { type: "hl-risk-monitor", name: "Risk Monitor", config: { maxDrawdown: "8%" } }
    ],
    connections: [
      { from: "hl-yield-farmer", to: "hl-liquidity-provider" },
      { from: "hl-liquidity-provider", to: "hl-portfolio-tracker" },
      { from: "hl-yield-farmer", to: "hl-risk-monitor" }
    ]
  },
  {
    id: "hl-arbitrage-bot-template",
    name: "Hyperliquid Arbitrage Bot",
    description: "Capture price differences between Hyperliquid and other exchanges for risk-free profits",
    icon: <Zap className="w-6 h-6" />,
    category: "Trading Bots",
    difficulty: "Advanced",
    estimatedTime: "40 minutes",
    popularity: 73,
    riskLevel: "Low",
    minCapital: "15,000 USDC",
    expectedReturns: "5-12% APY",
    features: [
      "Cross-Exchange Monitoring",
      "Instant Execution",
      "Risk-Free Profits",
      "High Frequency Trading",
      "Latency Optimization"
    ],
    components: [
      { type: "hl-api-connector", name: "Hyperliquid API", config: {} },
      { type: "hl-market-data", name: "Market Data", config: { exchanges: ["Binance", "OKX"] } },
      { type: "hl-spot-trader", name: "Spot Trader", config: { orderType: "market" } },
      { type: "hl-portfolio-tracker", name: "Portfolio Tracker", config: {} }
    ],
    connections: [
      { from: "hl-api-connector", to: "hl-market-data" },
      { from: "hl-market-data", to: "hl-spot-trader" },
      { from: "hl-spot-trader", to: "hl-portfolio-tracker" }
    ]
  },
  {
    id: "hl-dca-bot-template",
    name: "Hyperliquid DCA Bot",
    description: "Dollar-cost averaging bot that systematically builds positions over time to reduce market timing risk",
    icon: <BarChart3 className="w-6 h-6" />,
    category: "Trading Bots",
    difficulty: "Beginner",
    estimatedTime: "10 minutes",
    popularity: 98,
    riskLevel: "Low",
    minCapital: "500 USDC",
    expectedReturns: "Market Returns + Alpha",
    features: [
      "Systematic Buying",
      "Cost Averaging",
      "Flexible Scheduling",
      "Multi-Asset Support",
      "Low Risk"
    ],
    components: [
      { type: "hl-api-connector", name: "Hyperliquid API", config: {} },
      { type: "hl-spot-trader", name: "Spot Trader", config: { orderType: "market" } },
      { type: "hl-portfolio-tracker", name: "Portfolio Tracker", config: {} }
    ],
    connections: [
      { from: "hl-api-connector", to: "hl-spot-trader" },
      { from: "hl-spot-trader", to: "hl-portfolio-tracker" }
    ]
  },
  {
    id: "hl-analytics-dashboard-template",
    name: "Hyperliquid Analytics Dashboard",
    description: "Comprehensive analytics dashboard for monitoring Hyperliquid markets, portfolios, and trading performance",
    icon: <BarChart3 className="w-6 h-6" />,
    category: "Analytics",
    difficulty: "Intermediate",
    estimatedTime: "25 minutes",
    popularity: 85,
    riskLevel: "Low",
    minCapital: "0 USDC",
    features: [
      "Real-time Market Data",
      "Portfolio Analytics",
      "Performance Metrics",
      "Risk Analysis",
      "Custom Alerts"
    ],
    components: [
      { type: "hl-api-connector", name: "Hyperliquid API", config: {} },
      { type: "hl-market-data", name: "Market Data", config: {} },
      { type: "hl-portfolio-tracker", name: "Portfolio Tracker", config: {} },
      { type: "hl-risk-monitor", name: "Risk Monitor", config: {} }
    ],
    connections: [
      { from: "hl-api-connector", to: "hl-market-data" },
      { from: "hl-api-connector", to: "hl-portfolio-tracker" },
      { from: "hl-portfolio-tracker", to: "hl-risk-monitor" }
    ]
  },
  {
    id: "hl-mev-extraction-template",
    name: "Hyperliquid MEV Extraction Bot",
    description: "Advanced MEV bot that captures maximum extractable value through arbitrage, sandwich attacks, and liquidations",
    icon: <Zap className="w-6 h-6" />,
    category: "Trading Bots",
    difficulty: "Expert",
    estimatedTime: "60 minutes",
    popularity: 68,
    riskLevel: "High",
    minCapital: "50,000 USDC",
    expectedReturns: "20-40% APY",
    features: [
      "MEV Opportunity Detection",
      "Gas Price Optimization",
      "Multi-Strategy Execution",
      "Flash Loan Integration",
      "Risk Management"
    ],
    components: [
      { type: "hl-api-connector", name: "Hyperliquid API", config: {} },
      { type: "hl-mev-bot", name: "MEV Bot", config: { strategies: "all", minProfitUsd: 25 } },
      { type: "hl-flash-loan", name: "Flash Loan Engine", config: { maxLoanAmount: 500000 } },
      { type: "hl-risk-monitor", name: "Risk Monitor", config: { maxDrawdown: "20%" } }
    ],
    connections: [
      { from: "hl-api-connector", to: "hl-mev-bot" },
      { from: "hl-mev-bot", to: "hl-flash-loan" },
      { from: "hl-mev-bot", to: "hl-risk-monitor" }
    ]
  },
  {
    id: "hl-liquidation-hunter-template",
    name: "Hyperliquid Liquidation Hunter",
    description: "Automated liquidation bot that monitors undercollateralized positions and executes profitable liquidations",
    icon: <AlertTriangle className="w-6 h-6" />,
    category: "Trading Bots",
    difficulty: "Advanced",
    estimatedTime: "35 minutes",
    popularity: 76,
    riskLevel: "Medium",
    minCapital: "20,000 USDC",
    expectedReturns: "15-25% APY",
    features: [
      "Position Health Monitoring",
      "Automated Liquidation",
      "Profit Optimization",
      "Gas Cost Management",
      "Multi-Asset Support"
    ],
    components: [
      { type: "hl-api-connector", name: "Hyperliquid API", config: {} },
      { type: "hl-liquidation-bot", name: "Liquidation Bot", config: { healthThreshold: 1.05, minProfitUsd: 100 } },
      { type: "hl-flash-loan", name: "Flash Loan Engine", config: { maxLoanAmount: 1000000 } },
      { type: "hl-portfolio-tracker", name: "Portfolio Tracker", config: {} }
    ],
    connections: [
      { from: "hl-api-connector", to: "hl-liquidation-bot" },
      { from: "hl-liquidation-bot", to: "hl-flash-loan" },
      { from: "hl-liquidation-bot", to: "hl-portfolio-tracker" }
    ]
  },
  {
    id: "hl-cross-chain-arbitrage-template",
    name: "Hyperliquid Cross-Chain Arbitrage",
    description: "Cross-chain arbitrage bot that captures price differences between Hyperliquid and other chains",
    icon: <ArrowUpDown className="w-6 h-6" />,
    category: "Trading Bots",
    difficulty: "Expert",
    estimatedTime: "50 minutes",
    popularity: 62,
    riskLevel: "Medium",
    minCapital: "100,000 USDC",
    expectedReturns: "8-18% APY",
    features: [
      "Multi-Chain Monitoring",
      "Bridge Integration",
      "Price Difference Detection",
      "Automated Execution",
      "Risk Management"
    ],
    components: [
      { type: "hl-api-connector", name: "Hyperliquid API", config: {} },
      { type: "hl-cross-chain-bridge", name: "Cross-Chain Bridge", config: { bridgeMode: "fast" } },
      { type: "hl-market-data", name: "Market Data", config: { exchanges: ["Binance", "OKX", "Bybit"] } },
      { type: "hl-spot-trader", name: "Spot Trader", config: { orderType: "market" } },
      { type: "hl-portfolio-tracker", name: "Portfolio Tracker", config: {} }
    ],
    connections: [
      { from: "hl-api-connector", to: "hl-market-data" },
      { from: "hl-market-data", to: "hl-spot-trader" },
      { from: "hl-spot-trader", to: "hl-cross-chain-bridge" },
      { from: "hl-cross-chain-bridge", to: "hl-portfolio-tracker" }
    ]
  },
  {
    id: "hl-institutional-vault-template",
    name: "Hyperliquid Institutional Vault",
    description: "Professional-grade vault for institutional investors with advanced risk management and compliance features",
    icon: <Lock className="w-6 h-6" />,
    category: "Vaults",
    difficulty: "Expert",
    estimatedTime: "75 minutes",
    popularity: 71,
    riskLevel: "Low",
    minCapital: "1,000,000 USDC",
    expectedReturns: "10-18% APY",
    features: [
      "Institutional Grade Security",
      "Compliance Reporting",
      "Multi-Strategy Allocation",
      "Risk Monitoring",
      "Investor Management"
    ],
    components: [
      { type: "hl-vault-manager", name: "Vault Manager", config: { feeStructure: "1.5/15", minDeposit: 50000 } },
      { type: "hl-trading-contract", name: "Trading Contract", config: {} },
      { type: "hl-risk-monitor", name: "Risk Monitor", config: { maxDrawdown: "8%" } },
      { type: "hl-portfolio-tracker", name: "Portfolio Tracker", config: {} },
      { type: "hl-yield-farmer", name: "Yield Farmer", config: { strategies: ["HLP", "PURR", "Vaults"] } }
    ],
    connections: [
      { from: "hl-vault-manager", to: "hl-trading-contract" },
      { from: "hl-trading-contract", to: "hl-yield-farmer" },
      { from: "hl-vault-manager", to: "hl-risk-monitor" },
      { from: "hl-vault-manager", to: "hl-portfolio-tracker" }
    ]
  }
]

interface HyperliquidTemplatesProps {
  onLoadTemplate: (template: HyperliquidTemplate) => void
  onClose: () => void
}

export function HyperliquidTemplates({ onLoadTemplate, onClose }: HyperliquidTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [selectedTemplate, setSelectedTemplate] = useState<HyperliquidTemplate | null>(null)

  const categories = ["All", "Trading Bots", "DeFi Strategies", "Risk Management", "Analytics", "Vaults"]

  const filteredTemplates = hyperliquidTemplates.filter(template => 
    selectedCategory === "All" || template.category === selectedCategory
  )

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "bg-green-100 text-green-800 border-green-200"
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "High": return "bg-red-100 text-red-800 border-red-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-blue-100 text-blue-800 border-blue-200"
      case "Intermediate": return "bg-orange-100 text-orange-800 border-orange-200"
      case "Advanced": return "bg-purple-100 text-purple-800 border-purple-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (selectedTemplate) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => setSelectedTemplate(null)}
            className="text-muted-foreground hover:text-foreground"
          >
            ← Back to Templates
          </Button>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Close template marketplace"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-chart-2 rounded-xl flex items-center justify-center text-white">
                  {selectedTemplate.icon}
                </div>
                <div>
                  <CardTitle className="text-xl">{selectedTemplate.name}</CardTitle>
                  <CardDescription className="mt-2">{selectedTemplate.description}</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{selectedTemplate.popularity}%</div>
                <div className="text-xs text-muted-foreground">Popularity</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-2">{selectedTemplate.estimatedTime}</div>
                <div className="text-xs text-muted-foreground">Setup Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-3">{selectedTemplate.minCapital}</div>
                <div className="text-xs text-muted-foreground">Min Capital</div>
              </div>
              {selectedTemplate.expectedReturns && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-chart-4">{selectedTemplate.expectedReturns}</div>
                  <div className="text-xs text-muted-foreground">Expected Returns</div>
                </div>
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              <Badge className={getDifficultyColor(selectedTemplate.difficulty)}>
                {selectedTemplate.difficulty}
              </Badge>
              <Badge className={getRiskColor(selectedTemplate.riskLevel)}>
                {selectedTemplate.riskLevel} Risk
              </Badge>
              <Badge className="bg-primary text-primary-foreground">
                {selectedTemplate.category}
              </Badge>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Key Features</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedTemplate.features.map(feature => (
                  <div key={feature} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Components Included</h4>
              <div className="space-y-2">
                {selectedTemplate.components.map((component, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-chart-2 rounded-lg flex items-center justify-center text-white text-xs">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{component.name}</div>
                      <div className="text-xs text-muted-foreground">{component.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={() => onLoadTemplate(selectedTemplate)}
              className="w-full bg-gradient-to-r from-primary to-chart-2 hover:from-primary/90 hover:to-chart-2/90 text-white"
            >
              <ArrowRight className="w-4 h-4 mr-2" />
              Load Template
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">🚀 Hyperliquid Templates</h3>
          <p className="text-sm text-muted-foreground">Production-ready strategies and applications</p>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="Close template marketplace"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        {categories.map(category => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="text-xs"
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 max-h-96 overflow-y-auto">
        {filteredTemplates.map(template => (
          <Card key={template.id} className="bg-card border-border hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-chart-2 rounded-lg flex items-center justify-center text-white">
                    {template.icon}
                  </div>
                  <div>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <CardDescription className="text-sm">{template.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs font-medium">{template.popularity}%</span>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Badge className={getDifficultyColor(template.difficulty)} variant="outline">
                    {template.difficulty}
                  </Badge>
                  <Badge className={getRiskColor(template.riskLevel)} variant="outline">
                    {template.riskLevel}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {template.estimatedTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    {template.minCapital}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedTemplate(template)}
                  className="flex-1"
                >
                  View Details
                </Button>
                <Button
                  size="sm"
                  onClick={() => onLoadTemplate(template)}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
