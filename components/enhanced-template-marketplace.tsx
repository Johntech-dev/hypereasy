"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Download, 
  Star, 
  X, 
  TrendingUp, 
  Bot, 
  Shield, 
  Zap,
  DollarSign,
  BarChart3,
  Clock,
  Users,
  Sparkles,
  Crown,
  Play,
  Eye,
  Heart,
  Filter
} from "lucide-react"

interface Template {
  id: string
  name: string
  description: string
  longDescription: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  downloads: number
  rating: number
  author: string
  tags: string[]
  preview: string
  components: any[]
  connections: any[]
  features: string[]
  profitability: string
  timeToSetup: string
  maintenance: string
  riskLevel: string
  featured?: boolean
  premium?: boolean
  videoUrl?: string
  screenshots?: string[]
}

const PRODUCTION_TEMPLATES: Template[] = [
  {
    id: "advanced-dca-bot",
    name: "Smart DCA Trading Bot",
    description: "Advanced dollar-cost averaging with market condition awareness",
    longDescription: "A sophisticated DCA bot that adjusts buying intervals based on market volatility, RSI levels, and price action. Includes stop-loss protection, profit-taking mechanisms, and dynamic position sizing.",
    category: "Trading Bots",
    difficulty: "Intermediate",
    downloads: 3247,
    rating: 4.9,
    author: "CryptoQuant",
    tags: ["DCA", "Smart Averaging", "Risk Management", "ETH", "BTC"],
    preview: "📊 Market Analysis → 🤖 Smart DCA Logic → 💰 Position Management → 🔔 Alerts",
    features: [
      "Market volatility-based timing",
      "RSI and momentum indicators",
      "Dynamic position sizing",
      "Stop-loss and take-profit",
      "Multi-asset support",
      "Backtesting integration"
    ],
    profitability: "15-25% annually",
    timeToSetup: "10 minutes",
    maintenance: "Weekly review",
    riskLevel: "Medium",
    featured: true,
    components: [
      { id: "market-analyzer", type: "market-data", name: "Market Analyzer", config: { assets: "ETH,BTC", indicators: ["RSI", "MACD"] }, position: { x: 100, y: 100 } },
      { id: "dca-logic", type: "contract-call", name: "Smart DCA Logic", config: { contract: "DCABot", method: "executeDCA" }, position: { x: 400, y: 100 } },
      { id: "position-manager", type: "place-order", name: "Position Manager", config: { orderType: "market" }, position: { x: 700, y: 100 } },
      { id: "risk-monitor", type: "price-alert", name: "Risk Monitor", config: { stopLoss: true }, position: { x: 1000, y: 100 } }
    ],
    connections: [
      { id: "conn-1", sourceId: "market-analyzer", targetId: "dca-logic", sourceOutput: "analysis", targetInput: "input" },
      { id: "conn-2", sourceId: "dca-logic", targetId: "position-manager", sourceOutput: "signal", targetInput: "input" },
      { id: "conn-3", sourceId: "position-manager", targetId: "risk-monitor", sourceOutput: "order", targetInput: "input" }
    ]
  },
  {
    id: "arbitrage-hunter",
    name: "Cross-Exchange Arbitrage Hunter",
    description: "Automated arbitrage detection and execution across multiple exchanges",
    longDescription: "Professional-grade arbitrage bot that scans price differences across exchanges and executes profitable trades automatically. Includes gas optimization, slippage protection, and real-time profitability analysis.",
    category: "Advanced Trading",
    difficulty: "Advanced",
    downloads: 1876,
    rating: 4.7,
    author: "ArbitrageKing",
    tags: ["Arbitrage", "Multi-Exchange", "MEV", "Advanced", "High-Frequency"],
    preview: "🔍 Price Scanner → ⚡ Opportunity Detection → 🚀 Auto Execute → 💎 Profit Lock",
    features: [
      "Multi-exchange price scanning",
      "MEV protection strategies",
      "Gas optimization algorithms",
      "Slippage calculation",
      "Profit threshold management",
      "Real-time P&L tracking"
    ],
    profitability: "0.5-2% per trade",
    timeToSetup: "30 minutes",
    maintenance: "Daily monitoring",
    riskLevel: "High",
    premium: true,
    featured: true,
    components: [
      { id: "price-scanner", type: "market-data", name: "Multi-Exchange Scanner", config: { exchanges: ["Hyperliquid", "dYdX"] }, position: { x: 100, y: 100 } },
      { id: "arb-detector", type: "contract-call", name: "Arbitrage Detector", config: { minProfit: "0.5%" }, position: { x: 400, y: 100 } },
      { id: "executor", type: "place-order", name: "Trade Executor", config: { maxSlippage: "0.1%" }, position: { x: 700, y: 100 } }
    ],
    connections: []
  },
  {
    id: "portfolio-rebalancer-pro",
    name: "AI-Powered Portfolio Rebalancer",
    description: "Intelligent portfolio management with ML-based rebalancing decisions",
    longDescription: "Advanced portfolio management system that uses machine learning to optimize asset allocations based on market conditions, correlation analysis, and risk metrics. Includes automatic rebalancing, tax-loss harvesting, and performance analytics.",
    category: "Portfolio Management",
    difficulty: "Advanced",
    downloads: 2341,
    rating: 4.8,
    author: "QuantFi",
    tags: ["Portfolio", "AI", "Machine Learning", "Rebalancing", "Risk Management"],
    preview: "🧠 AI Analysis → ⚖️ Portfolio Optimization → 🔄 Auto Rebalance → 📊 Performance Tracking",
    features: [
      "ML-based allocation optimization",
      "Correlation analysis",
      "Risk-adjusted returns",
      "Tax-loss harvesting",
      "Performance attribution",
      "Customizable constraints"
    ],
    profitability: "12-18% annually",
    timeToSetup: "20 minutes",
    maintenance: "Monthly review",
    riskLevel: "Medium",
    premium: true,
    components: [],
    connections: []
  },
  {
    id: "yield-farmer-pro",
    name: "Automated Yield Farming Strategy",
    description: "Multi-protocol yield farming with automatic compound and migration",
    longDescription: "Comprehensive yield farming automation that monitors yields across protocols, automatically compounds rewards, and migrates funds to higher-yielding opportunities. Includes impermanent loss protection and gas optimization.",
    category: "DeFi Strategies",
    difficulty: "Intermediate",
    downloads: 1923,
    rating: 4.6,
    author: "YieldMaster",
    tags: ["Yield Farming", "DeFi", "Compound", "Migration", "APY"],
    preview: "🌾 Yield Scanner → 💰 Auto Compound → 🔄 Strategy Migration → 📈 Optimization",
    features: [
      "Multi-protocol yield scanning",
      "Automatic compounding",
      "Impermanent loss tracking",
      "Gas-efficient transactions",
      "Yield migration alerts",
      "Risk assessment tools"
    ],
    profitability: "20-40% APY",
    timeToSetup: "15 minutes",
    maintenance: "Weekly optimization",
    riskLevel: "Medium-High",
    components: [],
    connections: []
  },
  {
    id: "liquidation-bot",
    name: "Liquidation Protection Bot",
    description: "Automated position monitoring and liquidation prevention",
    longDescription: "Advanced liquidation protection system that monitors your positions in real-time, automatically adjusts collateral ratios, and executes emergency actions to prevent liquidations. Includes multi-asset support and customizable safety margins.",
    category: "Risk Management",
    difficulty: "Intermediate",
    downloads: 2876,
    rating: 4.9,
    author: "SafeTrader",
    tags: ["Liquidation", "Risk Management", "Position Monitoring", "Safety"],
    preview: "👁️ Position Monitor → ⚠️ Risk Detection → 🛡️ Auto Protection → 🔔 Emergency Alerts",
    features: [
      "Real-time position monitoring",
      "Customizable safety margins",
      "Automatic collateral adjustment",
      "Emergency liquidation prevention",
      "Multi-asset support",
      "Risk metrics dashboard"
    ],
    profitability: "Protection focused",
    timeToSetup: "5 minutes",
    maintenance: "Set and forget",
    riskLevel: "Low",
    featured: true,
    components: [],
    connections: []
  },
  {
    id: "trend-following-bot",
    name: "Advanced Trend Following System",
    description: "Multi-timeframe trend analysis with automated position management",
    longDescription: "Sophisticated trend following system that analyzes multiple timeframes, uses various technical indicators, and manages positions automatically. Includes dynamic stop-losses, position sizing, and market regime detection.",
    category: "Trading Bots",
    difficulty: "Advanced",
    downloads: 1654,
    rating: 4.5,
    author: "TrendMaster",
    tags: ["Trend Following", "Technical Analysis", "Multi-Timeframe", "Position Management"],
    preview: "📈 Trend Analysis → 🎯 Signal Generation → 📊 Position Sizing → 🔄 Management",
    features: [
      "Multi-timeframe analysis",
      "Advanced technical indicators",
      "Dynamic position sizing",
      "Adaptive stop-losses",
      "Market regime detection",
      "Backtesting framework"
    ],
    profitability: "18-30% annually",
    timeToSetup: "25 minutes",
    maintenance: "Weekly parameter review",
    riskLevel: "Medium-High",
    premium: true,
    components: [],
    connections: []
  }
]

const CATEGORIES = [
  "All",
  "Trading Bots",
  "Portfolio Management", 
  "DeFi Strategies",
  "Risk Management",
  "Advanced Trading"
]

const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"]

interface EnhancedTemplateMarketplaceProps {
  onLoadTemplate: (template: Template) => void
  onClose: () => void
}

export function EnhancedTemplateMarketplace({ onLoadTemplate, onClose }: EnhancedTemplateMarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [activeTab, setActiveTab] = useState("featured")
  const [showFilters, setShowFilters] = useState(false)

  const filteredTemplates = PRODUCTION_TEMPLATES.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "All" || template.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const featuredTemplates = filteredTemplates.filter(t => t.featured)
  const premiumTemplates = filteredTemplates.filter(t => t.premium)
  const popularTemplates = filteredTemplates.sort((a, b) => b.downloads - a.downloads).slice(0, 6)

  const getCategoryIcon = (category: string) => {
    const icons = {
      "Trading Bots": <Bot className="w-4 h-4" />,
      "Portfolio Management": <BarChart3 className="w-4 h-4" />,
      "DeFi Strategies": <Zap className="w-4 h-4" />,
      "Risk Management": <Shield className="w-4 h-4" />,
      "Advanced Trading": <TrendingUp className="w-4 h-4" />,
    }
    return icons[category as keyof typeof icons] || <Bot className="w-4 h-4" />
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      Beginner: "border-green-500 text-green-400 bg-green-500/10",
      Intermediate: "border-yellow-500 text-yellow-400 bg-yellow-500/10",
      Advanced: "border-red-500 text-red-400 bg-red-500/10",
    }
    return colors[difficulty as keyof typeof colors] || "border-gray-500 text-gray-400"
  }

  const getRiskColor = (risk: string) => {
    const colors = {
      Low: "text-green-400",
      Medium: "text-yellow-400",
      "Medium-High": "text-orange-400",
      High: "text-red-400"
    }
    return colors[risk as keyof typeof colors] || "text-gray-400"
  }

  if (selectedTemplate) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedTemplate(null)}
            className="text-[#00D4FF] hover:text-white transition-colors text-sm flex items-center gap-2"
          >
            ← Back to Templates
          </button>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white transition-colors"
            title="Close template details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Template Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-bold text-white">{selectedTemplate.name}</h3>
                {selectedTemplate.featured && (
                  <Badge className="bg-gradient-to-r from-[#00D4FF] to-[#FF00A8] text-white">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {selectedTemplate.premium && (
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>
              <p className="text-gray-300 mb-4">{selectedTemplate.longDescription}</p>
              
              {/* Stats */}
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">{selectedTemplate.downloads.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-gray-300">{selectedTemplate.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">by {selectedTemplate.author}</span>
                </div>
                <Badge className={getDifficultyColor(selectedTemplate.difficulty)}>
                  {selectedTemplate.difficulty}
                </Badge>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-3 bg-[#2A2A2A] border-[#444]">
              <div className="text-center">
                <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-1" />
                <div className="text-sm font-medium text-white">{selectedTemplate.profitability}</div>
                <div className="text-xs text-gray-400">Expected Returns</div>
              </div>
            </Card>
            <Card className="p-3 bg-[#2A2A2A] border-[#444]">
              <div className="text-center">
                <Clock className="w-6 h-6 text-blue-400 mx-auto mb-1" />
                <div className="text-sm font-medium text-white">{selectedTemplate.timeToSetup}</div>
                <div className="text-xs text-gray-400">Setup Time</div>
              </div>
            </Card>
            <Card className="p-3 bg-[#2A2A2A] border-[#444]">
              <div className="text-center">
                <BarChart3 className="w-6 h-6 text-purple-400 mx-auto mb-1" />
                <div className="text-sm font-medium text-white">{selectedTemplate.maintenance}</div>
                <div className="text-xs text-gray-400">Maintenance</div>
              </div>
            </Card>
            <Card className="p-3 bg-[#2A2A2A] border-[#444]">
              <div className="text-center">
                <Shield className="w-6 h-6 text-orange-400 mx-auto mb-1" />
                <div className={`text-sm font-medium ${getRiskColor(selectedTemplate.riskLevel)}`}>
                  {selectedTemplate.riskLevel}
                </div>
                <div className="text-xs text-gray-400">Risk Level</div>
              </div>
            </Card>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-lg font-semibold text-[#00D4FF] mb-3">Key Features</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {selectedTemplate.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-[#2A2A2A] border border-[#444] rounded">
                  <div className="w-2 h-2 bg-[#00D4FF] rounded-full flex-shrink-0" />
                  <span className="text-sm text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <h4 className="text-sm font-medium text-[#00D4FF] mb-2">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {selectedTemplate.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="border-[#666] text-gray-400">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-[#333]">
            <Button
              onClick={() => onLoadTemplate(selectedTemplate)}
              className="flex-1 bg-[#00D4FF] hover:bg-[#00B8E6] text-black font-semibold"
            >
              <Download className="w-4 h-4 mr-2" />
              Use This Template
            </Button>
            <Button variant="outline" className="border-[#666] text-gray-300 hover:bg-[#333]">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline" className="border-[#666] text-gray-300 hover:bg-[#333]">
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-[#00D4FF]">Template Marketplace</h3>
          <p className="text-sm text-gray-400">Production-ready templates for every trading strategy</p>
        </div>
        <button 
          onClick={onClose} 
          className="text-gray-400 hover:text-white transition-colors"
          title="Close template marketplace"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="border-[#666] text-gray-300"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-2 gap-3 p-4 bg-[#2A2A2A] border border-[#444] rounded-lg">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Difficulty</label>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Template Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 bg-[#2A2A2A]">
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="premium">Premium</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value="featured" className="space-y-4">
          <TemplateGrid templates={featuredTemplates} onSelect={setSelectedTemplate} />
        </TabsContent>

        <TabsContent value="popular" className="space-y-4">
          <TemplateGrid templates={popularTemplates} onSelect={setSelectedTemplate} />
        </TabsContent>

        <TabsContent value="premium" className="space-y-4">
          <TemplateGrid templates={premiumTemplates} onSelect={setSelectedTemplate} />
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <TemplateGrid templates={filteredTemplates} onSelect={setSelectedTemplate} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TemplateGrid({ templates, onSelect }: { templates: Template[], onSelect: (template: Template) => void }) {
  if (templates.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-sm">No templates found</div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 max-h-96 overflow-y-auto">
      {templates.map((template) => (
        <Card
          key={template.id}
          className="p-4 bg-[#2A2A2A] border-[#444] hover:border-[#00D4FF] transition-all duration-200 cursor-pointer group"
          onClick={() => onSelect(template)}
        >
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="text-[#00D4FF]">{getCategoryIcon(template.category)}</div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-white text-sm group-hover:text-[#00D4FF] transition-colors">
                      {template.name}
                    </h4>
                    {template.featured && (
                      <Badge className="bg-gradient-to-r from-[#00D4FF] to-[#FF00A8] text-white text-xs">
                        Featured
                      </Badge>
                    )}
                    {template.premium && (
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs">
                        Premium
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                    {template.description}
                  </p>
                </div>
              </div>
              <Badge className={getDifficultyColor(template.difficulty)}>
                {template.difficulty}
              </Badge>
            </div>

            {/* Metrics */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Download className="w-3 h-3 text-gray-400" />
                  <span className="text-gray-400">{template.downloads.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="text-gray-400">{template.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-green-400" />
                  <span className="text-gray-400">{template.profitability}</span>
                </div>
              </div>
              <span className="text-gray-500">by {template.author}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {template.tags.slice(0, 4).map((tag, index) => (
                <Badge key={index} variant="outline" className="border-[#666] text-gray-400 text-xs">
                  {tag}
                </Badge>
              ))}
              {template.tags.length > 4 && (
                <Badge variant="outline" className="border-[#666] text-gray-400 text-xs">
                  +{template.tags.length - 4}
                </Badge>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
