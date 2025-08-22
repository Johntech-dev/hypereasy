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
  ArrowUpDown,
  Cpu,
  Network,
  Eye,
  BarChart2,
  Scissors,
  Merge,
  GitBranch,
  RefreshCw,
  PlayCircle,
  StopCircle,
  Calendar,
  Clock,
  Thermometer,
  Crosshair,
  TrendingUpDown,
  Percent,
  Hash,
  Binary,
  Workflow,
  Layers2,
  Boxes,
  Component,
  FileText
} from "lucide-react"

interface AdvancedComponentType {
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
  color: string
  features: string[]
}

const ADVANCED_COMPONENTS: AdvancedComponentType[] = [
  // Trading & Orders
  {
    type: "smart-order-router",
    name: "Smart Order Router",
    description: "Intelligent order routing across multiple venues for best execution",
    icon: <GitBranch className="w-5 h-5" />,
    category: "Trading",
    difficulty: "Advanced",
    premium: true,
    inputs: ["order_request", "market_data"],
    outputs: ["routed_orders", "execution_report"],
    configurable: true,
    examples: ["Multi-venue routing", "TWAP execution", "Iceberg orders"],
    color: "from-chart-1 to-chart-1/70",
    features: ["Best execution", "Slippage optimization", "Multi-venue support"]
  },
  {
    type: "options-strategy",
    name: "Options Strategy Builder",
    description: "Build and execute complex options strategies",
    icon: <Layers2 className="w-5 h-5" />,
    category: "Trading",
    difficulty: "Advanced",
    premium: true,
    inputs: ["market_data", "volatility", "greeks"],
    outputs: ["strategy_pnl", "risk_metrics"],
    configurable: true,
    examples: ["Straddles", "Iron condors", "Butterflies"],
    color: "from-chart-2 to-chart-2/70",
    features: ["Greeks calculation", "Strategy P&L", "Risk analysis"]
  },
  {
    type: "market-maker",
    name: "Market Making Bot",
    description: "Automated market making with dynamic spread management",
    icon: <Target className="w-5 h-5" />,
    category: "Trading",
    difficulty: "Advanced",
    premium: true,
    inputs: ["orderbook", "inventory", "volatility"],
    outputs: ["bid_orders", "ask_orders", "pnl"],
    configurable: true,
    examples: ["Spread optimization", "Inventory management", "Risk controls"],
    color: "from-chart-3 to-chart-3/70",
    features: ["Dynamic spreads", "Inventory balancing", "Risk management"]
  },

  // Advanced Analytics
  {
    type: "ml-predictor",
    name: "ML Price Predictor",
    description: "Machine learning model for price prediction and signals",
    icon: <Brain className="w-5 h-5" />,
    category: "Analytics",
    difficulty: "Advanced",
    premium: true,
    inputs: ["price_data", "features", "market_regime"],
    outputs: ["predictions", "confidence", "signals"],
    configurable: true,
    examples: ["LSTM models", "Random Forest", "Ensemble methods"],
    color: "from-purple-500 to-purple-300",
    features: ["Multiple models", "Feature engineering", "Backtesting"]
  },
  {
    type: "correlation-analyzer",
    name: "Correlation Analyzer",
    description: "Real-time correlation analysis between assets",
    icon: <Network className="w-5 h-5" />,
    category: "Analytics",
    difficulty: "Intermediate",
    inputs: ["price_data", "timeframe"],
    outputs: ["correlation_matrix", "alerts"],
    configurable: true,
    examples: ["Cross-asset correlation", "Regime detection", "Pair trading"],
    color: "from-blue-500 to-blue-300",
    features: ["Rolling correlation", "Heatmaps", "Regime detection"]
  },
  {
    type: "volatility-surface",
    name: "Volatility Surface",
    description: "3D volatility surface modeling and analysis",
    icon: <BarChart2 className="w-5 h-5" />,
    category: "Analytics",
    difficulty: "Advanced",
    premium: true,
    inputs: ["options_data", "strikes", "expiries"],
    outputs: ["vol_surface", "skew", "term_structure"],
    configurable: true,
    examples: ["Implied volatility", "Volatility smile", "Term structure"],
    color: "from-indigo-500 to-indigo-300",
    features: ["3D visualization", "Skew analysis", "Historical comparison"]
  },

  // Risk Management
  {
    type: "var-calculator",
    name: "VaR Calculator",
    description: "Value at Risk calculation with multiple methodologies",
    icon: <Thermometer className="w-5 h-5" />,
    category: "Risk",
    difficulty: "Advanced",
    inputs: ["portfolio", "returns", "confidence_level"],
    outputs: ["var", "expected_shortfall", "risk_metrics"],
    configurable: true,
    examples: ["Historical VaR", "Monte Carlo VaR", "Parametric VaR"],
    color: "from-red-500 to-red-300",
    features: ["Multiple methods", "Backtesting", "Stress testing"]
  },
  {
    type: "stress-tester",
    name: "Stress Tester",
    description: "Portfolio stress testing under extreme scenarios",
    icon: <AlertTriangle className="w-5 h-5" />,
    category: "Risk",
    difficulty: "Advanced",
    premium: true,
    inputs: ["portfolio", "scenarios", "correlations"],
    outputs: ["stress_results", "worst_case", "recommendations"],
    configurable: true,
    examples: ["Market crash", "Volatility spike", "Liquidity crisis"],
    color: "from-orange-500 to-orange-300",
    features: ["Scenario analysis", "Monte Carlo", "Historical scenarios"]
  },

  // Data Processing
  {
    type: "data-aggregator",
    name: "Data Aggregator",
    description: "Aggregate and normalize data from multiple sources",
    icon: <Database className="w-5 h-5" />,
    category: "Data",
    difficulty: "Intermediate",
    inputs: ["raw_data", "sources", "filters"],
    outputs: ["aggregated_data", "quality_metrics"],
    configurable: true,
    examples: ["Multi-exchange data", "News aggregation", "Social sentiment"],
    color: "from-green-500 to-green-300",
    features: ["Data cleaning", "Normalization", "Quality checks"]
  },
  {
    type: "feature-engineer",
    name: "Feature Engineer",
    description: "Create and transform features for ML models",
    icon: <Settings className="w-5 h-5" />,
    category: "Data",
    difficulty: "Advanced",
    inputs: ["raw_data", "transformations"],
    outputs: ["features", "feature_importance"],
    configurable: true,
    examples: ["Technical indicators", "Rolling statistics", "Lag features"],
    color: "from-teal-500 to-teal-300",
    features: ["Auto feature creation", "Feature selection", "Scaling"]
  },

  // Automation & Logic
  {
    type: "condition-builder",
    name: "Advanced Condition Builder",
    description: "Build complex logical conditions with visual editor",
    icon: <GitBranch className="w-5 h-5" />,
    category: "Logic",
    difficulty: "Intermediate",
    inputs: ["data_inputs", "conditions"],
    outputs: ["condition_result", "evaluation_log"],
    configurable: true,
    examples: ["Multi-factor conditions", "Time-based logic", "Nested conditions"],
    color: "from-yellow-500 to-yellow-300",
    features: ["Visual editor", "Complex logic", "Debugging tools"]
  },
  {
    type: "state-machine",
    name: "State Machine",
    description: "Finite state machine for complex workflow control",
    icon: <Workflow className="w-5 h-5" />,
    category: "Logic",
    difficulty: "Advanced",
    inputs: ["events", "current_state"],
    outputs: ["next_state", "actions", "transitions"],
    configurable: true,
    examples: ["Trading states", "Risk states", "Market regimes"],
    color: "from-pink-500 to-pink-300",
    features: ["State visualization", "Transition rules", "Event handling"]
  },

  // Performance & Optimization
  {
    type: "performance-optimizer",
    name: "Performance Optimizer",
    description: "Optimize strategy parameters using genetic algorithms",
    icon: <Cpu className="w-5 h-5" />,
    category: "Optimization",
    difficulty: "Advanced",
    premium: true,
    inputs: ["strategy", "parameters", "constraints"],
    outputs: ["optimized_params", "performance_metrics"],
    configurable: true,
    examples: ["Parameter optimization", "Walk-forward analysis", "Genetic algorithms"],
    color: "from-violet-500 to-violet-300",
    features: ["Multiple algorithms", "Constraints handling", "Backtesting"]
  },
  {
    type: "execution-analyzer",
    name: "Execution Analyzer",
    description: "Analyze trade execution quality and slippage",
    icon: <Eye className="w-5 h-5" />,
    category: "Analytics",
    difficulty: "Intermediate",
    inputs: ["executed_trades", "market_data"],
    outputs: ["execution_metrics", "slippage_analysis"],
    configurable: true,
    examples: ["TWAP analysis", "Slippage tracking", "Execution costs"],
    color: "from-cyan-500 to-cyan-300",
    features: ["Cost analysis", "Benchmark comparison", "Reporting"]
  },

  // Advanced Notifications
  {
    type: "alert-manager",
    name: "Alert Manager",
    description: "Intelligent alert routing and escalation system",
    icon: <Bell className="w-5 h-5" />,
    category: "Notifications",
    difficulty: "Intermediate",
    inputs: ["alerts", "routing_rules", "escalation"],
    outputs: ["routed_alerts", "delivery_status"],
    configurable: true,
    examples: ["Priority routing", "Escalation chains", "Alert suppression"],
    color: "from-amber-500 to-amber-300",
    features: ["Smart routing", "Escalation", "Deduplication"]
  },
  {
    type: "report-generator",
    name: "Report Generator",
    description: "Automated report generation with custom templates",
    icon: <FileText className="w-5 h-5" />,
    category: "Reporting",
    difficulty: "Intermediate",
    inputs: ["data", "template", "schedule"],
    outputs: ["reports", "delivery_status"],
    configurable: true,
    examples: ["Daily P&L", "Risk reports", "Performance summaries"],
    color: "from-slate-500 to-slate-300",
    features: ["Custom templates", "Scheduling", "Multi-format export"]
  }
]

const CATEGORIES = [
  { id: "All", name: "All Components", icon: <Component className="w-4 h-4" /> },
  { id: "Trading", name: "Trading", icon: <TrendingUp className="w-4 h-4" /> },
  { id: "Analytics", name: "Analytics", icon: <BarChart3 className="w-4 h-4" /> },
  { id: "Risk", name: "Risk", icon: <Shield className="w-4 h-4" /> },
  { id: "Data", name: "Data", icon: <Database className="w-4 h-4" /> },
  { id: "Logic", name: "Logic", icon: <GitBranch className="w-4 h-4" /> },
  { id: "Optimization", name: "Optimization", icon: <Target className="w-4 h-4" /> },
  { id: "Notifications", name: "Notifications", icon: <Bell className="w-4 h-4" /> },
  { id: "Reporting", name: "Reporting", icon: <FileText className="w-4 h-4" /> }
]

interface AdvancedComponentLibraryProps {
  onAddComponent: (type: string, name: string) => void
}

export function AdvancedComponentLibrary({ onAddComponent }: AdvancedComponentLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)

  const handleDragStart = (e: React.DragEvent, component: AdvancedComponentType) => {
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        type: component.type,
        name: component.name,
      }),
    )
    e.dataTransfer.effectAllowed = "copy"
  }

  const filteredComponents = ADVANCED_COMPONENTS.filter((component) => {
    const matchesSearch = 
      component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      component.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "All" || component.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "All" || component.difficulty === selectedDifficulty
    const matchesPremium = !showPremiumOnly || component.premium

    return matchesSearch && matchesCategory && matchesDifficulty && matchesPremium
  })

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      Beginner: "border-chart-1 text-chart-1 bg-chart-1/10",
      Intermediate: "border-chart-2 text-chart-2 bg-chart-2/10",
      Advanced: "border-chart-3 text-chart-3 bg-chart-3/10",
    }
    return colors[difficulty as keyof typeof colors] || "border-muted text-muted-foreground"
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search advanced components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-9 bg-background"
          />
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="grid w-full grid-cols-3 bg-muted h-8">
            <TabsTrigger value="All" className="text-xs">All</TabsTrigger>
            <TabsTrigger value="Trading" className="text-xs">Trading</TabsTrigger>
            <TabsTrigger value="Analytics" className="text-xs">Analytics</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Component Grid */}
      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
        {CATEGORIES.filter(cat => selectedCategory === "All" || cat.id === selectedCategory).map(category => {
          const categoryComponents = filteredComponents.filter(c => 
            category.id === "All" || c.category === category.id
          )
          
          if (categoryComponents.length === 0) return null

          return (
            <div key={category.id}>
              <div className="flex items-center gap-2 mb-3">
                <div className="text-primary">{category.icon}</div>
                <h3 className="text-sm font-medium text-foreground">{category.name}</h3>
                <Badge variant="outline" className="text-xs">
                  {categoryComponents.length}
                </Badge>
              </div>
              
              <div className="grid gap-3">
                {categoryComponents.map((component) => (
                  <Card
                    key={component.type}
                    className="group p-4 bg-card border-border hover:border-primary/50 transition-all duration-200 cursor-grab active:cursor-grabbing hover:shadow-lg"
                    draggable
                    onDragStart={(e) => handleDragStart(e, component)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Component Icon with gradient */}
                      <div className={`
                        w-12 h-12 rounded-lg bg-gradient-to-r ${component.color} 
                        flex items-center justify-center text-white shadow-sm
                        group-hover:scale-110 transition-transform duration-200
                      `}>
                        {component.icon}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-card-foreground group-hover:text-primary transition-colors">
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
                        
                        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                          {component.description}
                        </p>

                        {/* Features */}
                        <div className="flex flex-wrap gap-1 mb-3">
                          {component.features.slice(0, 3).map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-border/50 text-muted-foreground">
                              {feature}
                            </Badge>
                          ))}
                          {component.features.length > 3 && (
                            <Badge variant="outline" className="text-xs border-border/50 text-muted-foreground">
                              +{component.features.length - 3}
                            </Badge>
                          )}
                        </div>
                        
                        {/* I/O Info */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <ArrowUpDown className="w-3 h-3" />
                            <span>{component.inputs.length} inputs</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Settings className="w-3 h-3" />
                            <span>{component.outputs.length} outputs</span>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          onClick={() => onAddComponent(component.type, component.name)}
                          className="w-full h-7 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium"
                        >
                          Add to Canvas
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

      {filteredComponents.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Component className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <div className="text-sm">No components found</div>
        </div>
      )}
    </div>
  )
}
