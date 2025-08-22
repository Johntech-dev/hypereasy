"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Star, X, TrendingUp, Bot, Shield, Zap } from "lucide-react"

interface Template {
  id: string
  name: string
  description: string
  category: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  downloads: number
  rating: number
  author: string
  tags: string[]
  preview: string
  components: any[]
  connections: any[]
}

const SAMPLE_TEMPLATES: Template[] = [
  {
    id: "dca-bot",
    name: "DCA Trading Bot",
    description: "Automated dollar-cost averaging bot that buys ETH at regular intervals",
    category: "Trading Bots",
    difficulty: "Beginner",
    downloads: 1247,
    rating: 4.8,
    author: "HyperTrader",
    tags: ["DCA", "Automation", "ETH", "Beginner"],
    preview: "🤖 Schedule → Market Data → Place Order → Discord Alert",
    components: [
      {
        id: "scheduler-1",
        type: "scheduler",
        name: "Daily Schedule",
        config: { interval: "daily" },
        position: { x: 100, y: 100 },
      },
      {
        id: "market-data-1",
        type: "market-data",
        name: "ETH Price",
        config: { asset: "ETH" },
        position: { x: 400, y: 100 },
      },
      {
        id: "place-order-1",
        type: "place-order",
        name: "Buy ETH",
        config: { asset: "ETH", side: "buy", amount: "100" },
        position: { x: 700, y: 100 },
      },
      { id: "discord-1", type: "discord-webhook", name: "Trade Alert", config: {}, position: { x: 1000, y: 100 } },
    ],
    connections: [
      {
        id: "conn-1",
        sourceId: "scheduler-1",
        targetId: "market-data-1",
        sourceOutput: "trigger",
        targetInput: "input",
      },
      {
        id: "conn-2",
        sourceId: "market-data-1",
        targetId: "place-order-1",
        sourceOutput: "data",
        targetInput: "input",
      },
      { id: "conn-3", sourceId: "place-order-1", targetId: "discord-1", sourceOutput: "result", targetInput: "input" },
    ],
  },
  {
    id: "price-alert-system",
    name: "Advanced Price Alert System",
    description: "Multi-asset price monitoring with conditional alerts and automated responses",
    category: "Alerts & Monitoring",
    difficulty: "Intermediate",
    downloads: 892,
    rating: 4.6,
    author: "CryptoWatcher",
    tags: ["Alerts", "Multi-Asset", "Monitoring", "Discord"],
    preview: "📊 Price Alert → Condition Check → Multiple Actions",
    components: [
      {
        id: "price-alert-1",
        type: "price-alert",
        name: "ETH Alert",
        config: { asset: "ETH", condition: "above", target: "4000" },
        position: { x: 100, y: 100 },
      },
      {
        id: "price-alert-2",
        type: "price-alert",
        name: "BTC Alert",
        config: { asset: "BTC", condition: "below", target: "60000" },
        position: { x: 100, y: 250 },
      },
      { id: "discord-1", type: "discord-webhook", name: "Alert Channel", config: {}, position: { x: 500, y: 175 } },
    ],
    connections: [
      { id: "conn-1", sourceId: "price-alert-1", targetId: "discord-1", sourceOutput: "alert", targetInput: "input" },
      { id: "conn-2", sourceId: "price-alert-2", targetId: "discord-1", sourceOutput: "alert", targetInput: "input" },
    ],
  },
  {
    id: "portfolio-rebalancer",
    name: "Smart Portfolio Rebalancer",
    description: "Automatically rebalance your portfolio based on target allocations",
    category: "Portfolio Management",
    difficulty: "Advanced",
    downloads: 634,
    rating: 4.9,
    author: "DeFiPro",
    tags: ["Portfolio", "Rebalancing", "Advanced", "Automation"],
    preview: "⚖️ Schedule → Balance Check → Rebalance Orders → Report",
    components: [
      {
        id: "scheduler-1",
        type: "scheduler",
        name: "Weekly Rebalance",
        config: { interval: "weekly" },
        position: { x: 100, y: 100 },
      },
      { id: "user-balance-1", type: "user-balance", name: "Portfolio Check", config: {}, position: { x: 400, y: 100 } },
      { id: "place-order-1", type: "place-order", name: "Rebalance Trade", config: {}, position: { x: 700, y: 100 } },
      { id: "discord-1", type: "discord-webhook", name: "Rebalance Report", config: {}, position: { x: 1000, y: 100 } },
    ],
    connections: [
      {
        id: "conn-1",
        sourceId: "scheduler-1",
        targetId: "user-balance-1",
        sourceOutput: "trigger",
        targetInput: "input",
      },
      {
        id: "conn-2",
        sourceId: "user-balance-1",
        targetId: "place-order-1",
        sourceOutput: "data",
        targetInput: "input",
      },
      { id: "conn-3", sourceId: "place-order-1", targetId: "discord-1", sourceOutput: "result", targetInput: "input" },
    ],
  },
  {
    id: "vault-manager-pro",
    name: "Vault Management Dashboard",
    description: "Complete vault management with performance tracking and automated deposits",
    category: "Vault Management",
    difficulty: "Intermediate",
    downloads: 445,
    rating: 4.7,
    author: "VaultMaster",
    tags: ["Vaults", "Management", "Performance", "Automation"],
    preview: "🏦 Vault Manager → Performance Tracking → Auto Deposits",
    components: [
      { id: "vault-manager-1", type: "vault-manager", name: "Main Vault", config: {}, position: { x: 100, y: 100 } },
      {
        id: "scheduler-1",
        type: "scheduler",
        name: "Daily Check",
        config: { interval: "daily" },
        position: { x: 400, y: 100 },
      },
      {
        id: "discord-1",
        type: "discord-webhook",
        name: "Performance Report",
        config: {},
        position: { x: 700, y: 100 },
      },
    ],
    connections: [
      {
        id: "conn-1",
        sourceId: "scheduler-1",
        targetId: "vault-manager-1",
        sourceOutput: "trigger",
        targetInput: "input",
      },
      { id: "conn-2", sourceId: "vault-manager-1", targetId: "discord-1", sourceOutput: "data", targetInput: "input" },
    ],
  },
  {
    id: "arbitrage-scanner",
    name: "Cross-Exchange Arbitrage Scanner",
    description: "Scan for arbitrage opportunities and execute trades automatically",
    category: "Advanced Trading",
    difficulty: "Advanced",
    downloads: 289,
    rating: 4.5,
    author: "ArbitrageKing",
    tags: ["Arbitrage", "Advanced", "Cross-Exchange", "Automation"],
    preview: "🔍 Market Scanner → Opportunity Detection → Auto Execute",
    components: [
      { id: "market-data-1", type: "market-data", name: "Price Scanner", config: {}, position: { x: 100, y: 100 } },
      {
        id: "contract-call-1",
        type: "contract-call",
        name: "Arbitrage Logic",
        config: {},
        position: { x: 400, y: 100 },
      },
      { id: "place-order-1", type: "place-order", name: "Execute Trade", config: {}, position: { x: 700, y: 100 } },
    ],
    connections: [
      {
        id: "conn-1",
        sourceId: "market-data-1",
        targetId: "contract-call-1",
        sourceOutput: "data",
        targetInput: "input",
      },
      {
        id: "conn-2",
        sourceId: "contract-call-1",
        targetId: "place-order-1",
        sourceOutput: "result",
        targetInput: "input",
      },
    ],
  },
]

const CATEGORIES = [
  "All",
  "Trading Bots",
  "Alerts & Monitoring",
  "Portfolio Management",
  "Vault Management",
  "Advanced Trading",
]
const DIFFICULTIES = ["All", "Beginner", "Intermediate", "Advanced"]

interface TemplateMarketplaceProps {
  onLoadTemplate: (template: Template) => void
  onClose: () => void
}

export function TemplateMarketplace({ onLoadTemplate, onClose }: TemplateMarketplaceProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)

  const filteredTemplates = SAMPLE_TEMPLATES.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "All" || template.difficulty === selectedDifficulty

    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const getCategoryIcon = (category: string) => {
    const icons = {
      "Trading Bots": <Bot className="w-4 h-4" />,
      "Alerts & Monitoring": <TrendingUp className="w-4 h-4" />,
      "Portfolio Management": <Shield className="w-4 h-4" />,
      "Vault Management": <Zap className="w-4 h-4" />,
      "Advanced Trading": <Star className="w-4 h-4" />,
    }
    return icons[category as keyof typeof icons] || <Bot className="w-4 h-4" />
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      Beginner: "border-green-500 text-green-400",
      Intermediate: "border-yellow-500 text-yellow-400",
      Advanced: "border-red-500 text-red-400",
    }
    return colors[difficulty as keyof typeof colors] || "border-gray-500 text-gray-400"
  }

  if (selectedTemplate) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedTemplate(null)}
            className="text-[#00D4FF] hover:text-white transition-colors text-sm"
          >
            ← Back to Templates
          </button>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">{selectedTemplate.name}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{selectedTemplate.description}</p>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Download className="w-4 h-4 text-gray-400" />
              <span className="text-gray-300">{selectedTemplate.downloads.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-300">{selectedTemplate.rating}</span>
            </div>
            <Badge variant="outline" className={getDifficultyColor(selectedTemplate.difficulty)}>
              {selectedTemplate.difficulty}
            </Badge>
          </div>

          <div>
            <h4 className="text-sm font-medium text-[#00D4FF] mb-2">Workflow Preview</h4>
            <div className="p-3 bg-[#2A2A2A] border border-[#444] rounded-lg">
              <p className="text-sm text-gray-300">{selectedTemplate.preview}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-[#00D4FF] mb-2">Components Included</h4>
            <div className="space-y-2">
              {selectedTemplate.components.map((component, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-[#2A2A2A] border border-[#444] rounded">
                  <div className="text-[#00D4FF]">{getCategoryIcon(selectedTemplate.category)}</div>
                  <span className="text-sm text-white">{component.name}</span>
                  <Badge variant="outline" className="border-[#666] text-gray-400 text-xs">
                    {component.type}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

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

          <div className="pt-4 border-t border-[#333]">
            <Button
              onClick={() => onLoadTemplate(selectedTemplate)}
              className="w-full bg-[#00D4FF] hover:bg-[#00B8E6] text-black"
            >
              <Download className="w-4 h-4 mr-2" />
              Use This Template
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#00D4FF]">Template Marketplace</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
            <SelectTrigger>
              <SelectValue placeholder="Difficulty" />
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

      {/* Templates List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className="p-3 bg-[#2A2A2A] border-[#444] hover:border-[#00D4FF] transition-colors cursor-pointer"
            onClick={() => setSelectedTemplate(template)}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-[#00D4FF]">{getCategoryIcon(template.category)}</div>
                  <h4 className="font-medium text-white text-sm">{template.name}</h4>
                </div>
                <Badge variant="outline" className={getDifficultyColor(template.difficulty)}>
                  {template.difficulty}
                </Badge>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{template.description}</p>

              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Download className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-400">{template.downloads}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400" />
                    <span className="text-gray-400">{template.rating}</span>
                  </div>
                </div>
                <span className="text-gray-500">by {template.author}</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {template.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="outline" className="border-[#666] text-gray-400 text-xs">
                    {tag}
                  </Badge>
                ))}
                {template.tags.length > 3 && (
                  <Badge variant="outline" className="border-[#666] text-gray-400 text-xs">
                    +{template.tags.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-sm">No templates found matching your criteria</div>
        </div>
      )}
    </div>
  )
}
