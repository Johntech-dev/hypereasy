"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Zap, 
  Target, 
  Rocket,
  CheckCircle,
  ArrowRight,
  Bot,
  TrendingUp,
  Shield,
  Sparkles
} from "lucide-react"

interface OnboardingStep {
  id: string
  title: string
  description: string
  content: React.ReactNode
  action?: string
  completed?: boolean
}

interface OnboardingFlowProps {
  onComplete: () => void
  onSkip: () => void
}

export function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  console.log("OnboardingFlow component rendered") // Debug log

  const steps: OnboardingStep[] = [
    {
      id: "welcome",
      title: "Welcome to HyperEasy",
      description: "The no-code platform for building production-ready Hyperliquid applications",
      content: (
        <div className="text-center space-y-6">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-[#00D4FF] to-[#FF00A8] rounded-full flex items-center justify-center">
            <Rocket className="w-12 h-12 text-white" />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Build Without Code</h2>
            <p className="text-gray-300 max-w-md mx-auto">
              Create sophisticated trading bots, portfolio managers, and DeFi tools using our visual drag-and-drop interface.
              No programming experience required.
            </p>
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="text-center space-y-2">
                <Bot className="w-8 h-8 text-[#00D4FF] mx-auto" />
                <div className="text-sm text-gray-300">Trading Bots</div>
              </div>
              <div className="text-center space-y-2">
                <TrendingUp className="w-8 h-8 text-[#FF00A8] mx-auto" />
                <div className="text-sm text-gray-300">Portfolio Tools</div>
              </div>
              <div className="text-center space-y-2">
                <Shield className="w-8 h-8 text-green-400 mx-auto" />
                <div className="text-sm text-gray-300">Risk Management</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "concepts",
      title: "Core Concepts",
      description: "Learn the building blocks of your Hyperliquid applications",
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white text-center">How It Works</h3>
          <div className="space-y-4">
            <Card className="p-4 bg-[#2A2A2A] border-[#444]">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#00D4FF] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-black font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-white">Components</h4>
                  <p className="text-sm text-gray-300">
                    Pre-built blocks like "Place Order", "Market Data", and "Price Alerts" that handle specific functions.
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-[#2A2A2A] border-[#444]">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#FF00A8] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-white">Connections</h4>
                  <p className="text-sm text-gray-300">
                    Link components together to create automated workflows that respond to market conditions.
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-4 bg-[#2A2A2A] border-[#444]">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-white">Deploy</h4>
                  <p className="text-sm text-gray-300">
                    One-click deployment to production with monitoring, alerts, and performance tracking.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: "templates",
      title: "Start with Templates",
      description: "Choose from production-tested templates or build from scratch",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-2">Popular Templates</h3>
            <p className="text-gray-300 text-sm">Get started quickly with proven strategies</p>
          </div>
          <div className="space-y-3">
            <Card className="p-3 bg-[#2A2A2A] border-[#444] hover:border-[#00D4FF] transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Bot className="w-6 h-6 text-[#00D4FF]" />
                <div className="flex-1">
                  <h4 className="font-medium text-white text-sm">DCA Trading Bot</h4>
                  <p className="text-xs text-gray-400">Automated dollar-cost averaging</p>
                </div>
                <Badge variant="outline" className="border-green-500 text-green-400 text-xs">Beginner</Badge>
              </div>
            </Card>
            <Card className="p-3 bg-[#2A2A2A] border-[#444] hover:border-[#FF00A8] transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-[#FF00A8]" />
                <div className="flex-1">
                  <h4 className="font-medium text-white text-sm">Portfolio Rebalancer</h4>
                  <p className="text-xs text-gray-400">Smart portfolio management</p>
                </div>
                <Badge variant="outline" className="border-yellow-500 text-yellow-400 text-xs">Advanced</Badge>
              </div>
            </Card>
            <Card className="p-3 bg-[#2A2A2A] border-[#444] hover:border-green-500 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-green-400" />
                <div className="flex-1">
                  <h4 className="font-medium text-white text-sm">Risk Manager</h4>
                  <p className="text-xs text-gray-400">Automated risk controls</p>
                </div>
                <Badge variant="outline" className="border-yellow-500 text-yellow-400 text-xs">Intermediate</Badge>
              </div>
            </Card>
          </div>
        </div>
      )
    },
    {
      id: "interface",
      title: "Interface Overview",
      description: "Get familiar with the builder interface",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-2">Builder Interface</h3>
            <p className="text-gray-300 text-sm">Everything you need in one place</p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-3 p-3 bg-[#2A2A2A] border border-[#444] rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs">📚</span>
              </div>
              <div>
                <h4 className="font-medium text-white text-sm">Component Library</h4>
                <p className="text-xs text-gray-400">Drag components to build your app</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#2A2A2A] border border-[#444] rounded-lg">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs">🎨</span>
              </div>
              <div>
                <h4 className="font-medium text-white text-sm">Visual Canvas</h4>
                <p className="text-xs text-gray-400">Design your workflow visually</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#2A2A2A] border border-[#444] rounded-lg">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-xs">⚙️</span>
              </div>
              <div>
                <h4 className="font-medium text-white text-sm">Configuration Panel</h4>
                <p className="text-xs text-gray-400">Customize component settings</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "ready",
      title: "You're Ready!",
      description: "Start building your first Hyperliquid application",
      content: (
        <div className="text-center space-y-6">
          <div className="mx-auto w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Ready to Build!</h2>
            <p className="text-gray-300 max-w-md mx-auto">
              You're all set to create powerful Hyperliquid applications. Start with a template or build from scratch.
            </p>
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <Button className="bg-[#00D4FF] hover:bg-[#00B8E6] text-black">
                <Sparkles className="w-4 h-4 mr-2" />
                Start with Template
              </Button>
              <Button variant="outline" className="border-[#FF00A8] text-[#FF00A8] hover:bg-[#FF00A8] hover:text-white">
                <Target className="w-4 h-4 mr-2" />
                Build from Scratch
              </Button>
            </div>
          </div>
        </div>
      )
    }
  ]

  const progress = ((currentStep + 1) / steps.length) * 100

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      markStepCompleted(steps[currentStep].id)
      setCurrentStep(currentStep + 1)
    } else {
      markStepCompleted(steps[currentStep].id)
      onComplete()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const markStepCompleted = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId])
    }
  }

  const goToStep = (index: number) => {
    setCurrentStep(index)
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-card border-border shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-lg font-semibold text-card-foreground">Getting Started</h1>
              <p className="text-sm text-muted-foreground">Step {currentStep + 1} of {steps.length}</p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onSkip}
              className="text-muted-foreground hover:text-foreground"
            >
              Skip Tour
            </Button>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-card-foreground mb-2">{steps[currentStep].title}</h2>
            <p className="text-muted-foreground text-sm">{steps[currentStep].description}</p>
          </div>
          
          <div className="min-h-[300px] flex items-center justify-center">
            {steps[currentStep].content}
          </div>
        </div>

        {/* Navigation */}
        <div className="p-6 border-t border-border flex items-center justify-between">
          <div className="flex gap-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => goToStep(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep 
                    ? 'bg-primary' 
                    : completedSteps.includes(step.id)
                    ? 'bg-chart-1'
                    : 'bg-muted-foreground'
                }`}
                title={`Go to step ${index + 1}: ${step.title}`}
              />
            ))}
          </div>

          <div className="flex gap-3">
            {currentStep > 0 && (
              <Button variant="outline" onClick={prevStep}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            )}
            <Button 
              onClick={nextStep}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  Start Building
                  <Play className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
