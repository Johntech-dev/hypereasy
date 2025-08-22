"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Code, 
  Book, 
  Rocket, 
  Zap, 
  Shield, 
  Layers,
  GitBranch,
  Terminal,
  Package,
  Users,
  Star,
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
  Download,
  Play,
  FileText,
  Globe,
  Database,
  Settings
} from "lucide-react"

interface SDKDocumentationProps {
  onClose: () => void
}

export function SDKDocumentation({ onClose }: SDKDocumentationProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const codeExamples = {
    basicUsage: `import { HyperliquidClient } from '@hypereasy/sdk'

// Initialize client
const client = new HyperliquidClient({
  apiKey: process.env.HYPERLIQUID_API_KEY,
  testnet: false
})

// Get market data
const marketData = await client.getMarketData('ETH')
console.log('ETH Price:', marketData.price)

// Place an order
const order = await client.placeOrder({
  asset: 'ETH',
  amount: 1.0,
  side: 'buy',
  orderType: 'market'
})

console.log('Order placed:', order.orderId)`,

    tradingBot: `import { HyperliquidClient, TechnicalIndicators } from '@hypereasy/sdk'

class TradingBot {
  constructor(apiKey) {
    this.client = new HyperliquidClient({ apiKey })
    this.indicators = new TechnicalIndicators()
  }

  async runStrategy() {
    // Get market data
    const data = await this.client.getCandles('ETH', '1h', 100)
    
    // Calculate indicators
    const rsi = this.indicators.rsi(data.closes, 14)
    const macd = this.indicators.macd(data.closes)
    
    // Trading logic
    if (rsi.current < 30 && macd.signal === 'buy') {
      await this.client.placeOrder({
        asset: 'ETH',
        amount: this.calculatePosition(),
        side: 'buy',
        orderType: 'market'
      })
    }
  }

  calculatePosition() {
    // Risk management logic
    const balance = await this.client.getBalance()
    return balance.available * 0.1 // Risk 10% per trade
  }
}`,

    portfolioManager: `import { HyperliquidClient, Portfolio } from '@hypereasy/sdk'

class PortfolioManager {
  constructor(apiKey) {
    this.client = new HyperliquidClient({ apiKey })
    this.portfolio = new Portfolio(this.client)
  }

  async rebalancePortfolio() {
    const targetAllocation = {
      'ETH': 0.4,
      'BTC': 0.3,
      'SOL': 0.2,
      'AVAX': 0.1
    }

    // Get current positions
    const positions = await this.client.getPositions()
    const totalValue = this.portfolio.getTotalValue(positions)

    // Calculate rebalancing trades
    const trades = this.portfolio.calculateRebalancing(
      positions,
      targetAllocation,
      totalValue
    )

    // Execute trades
    for (const trade of trades) {
      await this.client.placeOrder({
        asset: trade.asset,
        amount: Math.abs(trade.amount),
        side: trade.amount > 0 ? 'buy' : 'sell',
        orderType: 'market'
      })
    }
  }
}`,

    vaultManager: `import { HyperliquidClient, VaultManager } from '@hypereasy/sdk'

class AutoVaultManager {
  constructor(apiKey) {
    this.client = new HyperliquidClient({ apiKey })
    this.vaultManager = new VaultManager(this.client)
  }

  async optimizeYield() {
    // Get available vaults and their APYs
    const vaults = await this.client.getVaults()
    const sortedVaults = vaults.sort((a, b) => b.apy - a.apy)

    // Get current vault positions
    const positions = await this.client.getVaultPositions()

    // Find better opportunities
    for (const position of positions) {
      const currentVault = vaults.find(v => v.id === position.vaultId)
      const bestVault = sortedVaults[0]

      // Migrate if better yield available (with threshold)
      if (bestVault.apy > currentVault.apy * 1.1) {
        await this.migrateToVault(position, bestVault)
      }
    }
  }

  async migrateToVault(position, targetVault) {
    // Withdraw from current vault
    await this.client.withdrawFromVault(position.vaultId, position.amount)
    
    // Deposit to new vault
    await this.client.depositToVault(targetVault.id, position.amount)
    
    console.log(\`Migrated \${position.amount} from \${position.vaultId} to \${targetVault.id}\`)
  }
}`,

    riskManagement: `import { HyperliquidClient, RiskManager } from '@hypereasy/sdk'

class RiskManager {
  constructor(apiKey) {
    this.client = new HyperliquidClient({ apiKey })
    this.maxDrawdown = 0.15 // 15% max drawdown
    this.maxPositionSize = 0.1 // 10% max per position
  }

  async monitorRisk() {
    const positions = await this.client.getPositions()
    const account = await this.client.getAccountInfo()

    // Check drawdown
    const currentDrawdown = this.calculateDrawdown(account)
    if (currentDrawdown > this.maxDrawdown) {
      await this.emergencyExit(positions)
      return
    }

    // Check position sizes
    for (const position of positions) {
      const positionSize = position.notionalValue / account.totalValue
      if (positionSize > this.maxPositionSize) {
        await this.reducePosition(position)
      }
    }

    // Check liquidation risk
    for (const position of positions) {
      if (position.liquidationRisk > 0.8) {
        await this.addCollateral(position)
      }
    }
  }

  async emergencyExit(positions) {
    console.log('Emergency exit triggered!')
    for (const position of positions) {
      await this.client.closePosition(position.asset)
    }
  }
}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-primary">HyperEasy SDK</h3>
          <p className="text-muted-foreground">Complete TypeScript SDK for Hyperliquid development</p>
        </div>
        <Button variant="ghost" onClick={onClose}>
          ×
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 bg-muted">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="integration">Integration</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <Card className="p-6 bg-card border-border">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Rocket className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-card-foreground mb-2">What is HyperEasy SDK?</h4>
                <p className="text-muted-foreground mb-4">
                  HyperEasy SDK is a comprehensive TypeScript wrapper around Hyperliquid's APIs that makes it incredibly 
                  easy for developers to build sophisticated trading applications, bots, and DeFi tools.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-chart-1" />
                    <span className="text-sm text-card-foreground">Type-safe & Secure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-chart-2" />
                    <span className="text-sm text-card-foreground">High Performance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-chart-3" />
                    <span className="text-sm text-card-foreground">Modular Architecture</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-chart-4" />
                    <span className="text-sm text-card-foreground">Developer Friendly</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-card border-border">
              <h4 className="font-semibold text-card-foreground mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                For No-Code Users
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Use our visual interface to build applications without writing code. The SDK powers the backend automatically.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full" />
                  Drag & drop component builder
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full" />
                  Pre-built trading strategies
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full" />
                  One-click deployment
                </li>
              </ul>
            </Card>

            <Card className="p-6 bg-card border-border">
              <h4 className="font-semibold text-card-foreground mb-3 flex items-center gap-2">
                <Code className="w-4 h-4 text-primary" />
                For Developers
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Full programmatic access to all Hyperliquid features with TypeScript support and comprehensive documentation.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full" />
                  Complete API wrapper
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full" />
                  TypeScript definitions
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full" />
                  Advanced utilities
                </li>
              </ul>
            </Card>
          </div>
        </TabsContent>

        {/* Features Tab */}
        <TabsContent value="features" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-card border-border">
              <h4 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <Database className="w-4 h-4 text-primary" />
                Market Data & Analytics
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <div className="w-1 h-1 bg-chart-1 rounded-full mt-2" />
                  <div>
                    <div className="font-medium text-card-foreground">Real-time Price Feeds</div>
                    <div className="text-muted-foreground">WebSocket and REST API access to live market data</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1 h-1 bg-chart-2 rounded-full mt-2" />
                  <div>
                    <div className="font-medium text-card-foreground">Technical Indicators</div>
                    <div className="text-muted-foreground">RSI, MACD, Bollinger Bands, and 50+ indicators</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1 h-1 bg-chart-3 rounded-full mt-2" />
                  <div>
                    <div className="font-medium text-card-foreground">Historical Data</div>
                    <div className="text-muted-foreground">Access to historical candles and trade data</div>
                  </div>
                </li>
              </ul>
            </Card>

            <Card className="p-6 bg-card border-border">
              <h4 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <Settings className="w-4 h-4 text-primary" />
                Trading & Orders
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <div className="w-1 h-1 bg-chart-1 rounded-full mt-2" />
                  <div>
                    <div className="font-medium text-card-foreground">Advanced Order Types</div>
                    <div className="text-muted-foreground">Market, limit, stop-loss, and conditional orders</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1 h-1 bg-chart-2 rounded-full mt-2" />
                  <div>
                    <div className="font-medium text-card-foreground">Position Management</div>
                    <div className="text-muted-foreground">Open, close, and modify positions programmatically</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1 h-1 bg-chart-3 rounded-full mt-2" />
                  <div>
                    <div className="font-medium text-card-foreground">Risk Controls</div>
                    <div className="text-muted-foreground">Built-in position sizing and risk management</div>
                  </div>
                </li>
              </ul>
            </Card>

            <Card className="p-6 bg-card border-border">
              <h4 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                Vault Operations
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <div className="w-1 h-1 bg-chart-1 rounded-full mt-2" />
                  <div>
                    <div className="font-medium text-card-foreground">Automated Deposits</div>
                    <div className="text-muted-foreground">Smart vault allocation and yield optimization</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1 h-1 bg-chart-2 rounded-full mt-2" />
                  <div>
                    <div className="font-medium text-card-foreground">Yield Farming</div>
                    <div className="text-muted-foreground">Automated compound and migration strategies</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1 h-1 bg-chart-3 rounded-full mt-2" />
                  <div>
                    <div className="font-medium text-card-foreground">Performance Tracking</div>
                    <div className="text-muted-foreground">Real-time P&L and performance analytics</div>
                  </div>
                </li>
              </ul>
            </Card>

            <Card className="p-6 bg-card border-border">
              <h4 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Security & Reliability
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-3">
                  <div className="w-1 h-1 bg-chart-1 rounded-full mt-2" />
                  <div>
                    <div className="font-medium text-card-foreground">API Key Management</div>
                    <div className="text-muted-foreground">Secure credential handling and rotation</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1 h-1 bg-chart-2 rounded-full mt-2" />
                  <div>
                    <div className="font-medium text-card-foreground">Rate Limiting</div>
                    <div className="text-muted-foreground">Automatic request throttling and retry logic</div>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-1 h-1 bg-chart-3 rounded-full mt-2" />
                  <div>
                    <div className="font-medium text-card-foreground">Error Handling</div>
                    <div className="text-muted-foreground">Comprehensive error recovery and logging</div>
                  </div>
                </li>
              </ul>
            </Card>
          </div>
        </TabsContent>

        {/* Examples Tab */}
        <TabsContent value="examples" className="space-y-6">
          <div className="space-y-6">
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-card-foreground">Basic Usage</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyCode(codeExamples.basicUsage, 'basic')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {copiedCode === 'basic' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                <code>{codeExamples.basicUsage}</code>
              </pre>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-card-foreground">Trading Bot</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyCode(codeExamples.tradingBot, 'bot')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {copiedCode === 'bot' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                <code>{codeExamples.tradingBot}</code>
              </pre>
            </Card>

            <Card className="p-6 bg-card border-border">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-card-foreground">Portfolio Rebalancing</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyCode(codeExamples.portfolioManager, 'portfolio')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {copiedCode === 'portfolio' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                <code>{codeExamples.portfolioManager}</code>
              </pre>
            </Card>
          </div>
        </TabsContent>

        {/* Integration Tab */}
        <TabsContent value="integration" className="space-y-6">
          <Card className="p-6 bg-card border-border">
            <h4 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-primary" />
              Quick Installation
            </h4>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-mono text-muted-foreground">npm</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyCode('npm install @hypereasy/sdk', 'npm')}
                  >
                    {copiedCode === 'npm' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
                <code className="text-sm">npm install @hypereasy/sdk</code>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-mono text-muted-foreground">yarn</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyCode('yarn add @hypereasy/sdk', 'yarn')}
                  >
                    {copiedCode === 'yarn' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
                <code className="text-sm">yarn add @hypereasy/sdk</code>
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-card border-border">
              <h4 className="font-semibold text-card-foreground mb-4">Framework Support</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-chart-1 text-chart-1">Next.js</Badge>
                  <span className="text-sm text-muted-foreground">Full SSR support</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-chart-2 text-chart-2">React</Badge>
                  <span className="text-sm text-muted-foreground">Hooks & components</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-chart-3 text-chart-3">Node.js</Badge>
                  <span className="text-sm text-muted-foreground">Server-side apps</span>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-chart-4 text-chart-4">Express</Badge>
                  <span className="text-sm text-muted-foreground">API backends</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <h4 className="font-semibold text-card-foreground mb-4">Deployment Options</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-chart-1" />
                  <span className="text-sm text-card-foreground">Vercel</span>
                </div>
                <div className="flex items-center gap-3">
                  <Database className="w-4 h-4 text-chart-2" />
                  <span className="text-sm text-card-foreground">Railway</span>
                </div>
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-chart-3" />
                  <span className="text-sm text-card-foreground">Docker</span>
                </div>
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4 text-chart-4" />
                  <span className="text-sm text-card-foreground">AWS/GCP</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Support Tab */}
        <TabsContent value="support" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6 bg-card border-border">
              <h4 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <Book className="w-4 h-4 text-primary" />
                Documentation
              </h4>
              <div className="space-y-3">
                <a href="#" className="flex items-center gap-2 text-sm text-primary hover:underline">
                  <FileText className="w-4 h-4" />
                  API Reference
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a href="#" className="flex items-center gap-2 text-sm text-primary hover:underline">
                  <Code className="w-4 h-4" />
                  TypeScript Definitions
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a href="#" className="flex items-center gap-2 text-sm text-primary hover:underline">
                  <Play className="w-4 h-4" />
                  Video Tutorials
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a href="#" className="flex items-center gap-2 text-sm text-primary hover:underline">
                  <GitBranch className="w-4 h-4" />
                  Example Projects
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </Card>

            <Card className="p-6 bg-card border-border">
              <h4 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                Community
              </h4>
              <div className="space-y-3">
                <a href="#" className="flex items-center gap-2 text-sm text-primary hover:underline">
                  <Users className="w-4 h-4" />
                  Discord Community
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a href="#" className="flex items-center gap-2 text-sm text-primary hover:underline">
                  <GitBranch className="w-4 h-4" />
                  GitHub Repository
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a href="#" className="flex items-center gap-2 text-sm text-primary hover:underline">
                  <Star className="w-4 h-4" />
                  Feature Requests
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a href="#" className="flex items-center gap-2 text-sm text-primary hover:underline">
                  <Shield className="w-4 h-4" />
                  Bug Reports
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </Card>
          </div>

          <Card className="p-6 bg-card border-border">
            <h4 className="font-semibold text-card-foreground mb-4">Get Started Today</h4>
            <p className="text-muted-foreground mb-6">
              Join thousands of developers building the future of DeFi with HyperEasy SDK.
            </p>
            <div className="flex gap-3">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Download className="w-4 h-4 mr-2" />
                Install SDK
              </Button>
              <Button variant="outline" className="border-border">
                <Book className="w-4 h-4 mr-2" />
                Read Docs
              </Button>
              <Button variant="outline" className="border-border">
                <Play className="w-4 h-4 mr-2" />
                Try Examples
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
