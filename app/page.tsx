import { NoCodeBuilder } from "@/components/no-code-builder"
import { Header } from "@/components/header"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative text-center space-y-8 mb-16">
          {/* Decorative background elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute top-40 right-1/4 w-24 h-24 bg-chart-2/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-chart-3/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="space-y-6 relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm font-medium">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span>🚀 Now with Advanced MEV & Cross-Chain Features</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold gradient-text tracking-tight">
              HyperEasy
          </h1>
            
            <div className="text-2xl md:text-3xl font-semibold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              No-Code Hyperliquid Platform
            </div>
            
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Build <span className="text-primary font-semibold">production-ready Hyperliquid applications</span> without writing a single line of code.
              Create sophisticated trading bots, MEV strategies, vaults, and DeFi protocols using our
              <span className="text-chart-2 font-semibold"> visual drag-and-drop interface</span> powered by AI.
            </p>
            
            <div className="flex flex-wrap justify-center gap-8 text-sm pt-4">
              <div className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-card to-card/80 border border-border/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-3 h-3 bg-gradient-to-r from-chart-1 to-chart-1/80 rounded-full group-hover:animate-pulse"></div>
                <span className="text-card-foreground font-medium">Production Ready</span>
              </div>
              <div className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-card to-card/80 border border-border/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-3 h-3 bg-gradient-to-r from-chart-2 to-chart-2/80 rounded-full group-hover:animate-pulse"></div>
                <span className="text-card-foreground font-medium">AI Powered</span>
              </div>
              <div className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-card to-card/80 border border-border/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-3 h-3 bg-gradient-to-r from-chart-3 to-chart-3/80 rounded-full group-hover:animate-pulse"></div>
                <span className="text-card-foreground font-medium">One-Click Deploy</span>
              </div>
              <div className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-card to-card/80 border border-border/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-3 h-3 bg-gradient-to-r from-chart-4 to-chart-4/80 rounded-full group-hover:animate-pulse"></div>
                <span className="text-card-foreground font-medium">No Code Required</span>
              </div>
            </div>
            
            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto pt-8">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold gradient-text">15+</div>
                <div className="text-sm text-muted-foreground">Components</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold gradient-text">11</div>
                <div className="text-sm text-muted-foreground">Templates</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold gradient-text">50x</div>
                <div className="text-sm text-muted-foreground">Max Leverage</div>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold gradient-text">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Builder Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-chart-2/5 rounded-3xl -z-10"></div>
        <NoCodeBuilder />
        </div>
      </main>
    </div>
  )
}
