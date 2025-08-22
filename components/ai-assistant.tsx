"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Bot, 
  Send, 
  Sparkles, 
  Lightbulb, 
  Target,
  TrendingUp,
  Shield,
  Zap,
  X,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check
} from "lucide-react"
import type { BuilderComponent } from "./no-code-builder"

interface AIMessage {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  suggestions?: ComponentSuggestion[]
  workflow?: WorkflowSuggestion
}

interface ComponentSuggestion {
  type: string
  name: string
  reason: string
  confidence: number
  category: string
}

interface WorkflowSuggestion {
  title: string
  description: string
  components: string[]
  connections: Array<{ from: string; to: string }>
  difficulty: "Beginner" | "Intermediate" | "Advanced"
}

interface AIAssistantProps {
  components: BuilderComponent[]
  onAddComponent: (type: string, name: string) => void
  onSuggestWorkflow: (workflow: WorkflowSuggestion) => void
  isOpen: boolean
  onToggle: () => void
}

export function AIAssistant({ 
  components, 
  onAddComponent, 
  onSuggestWorkflow, 
  isOpen, 
  onToggle 
}: AIAssistantProps) {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: "welcome",
      type: "assistant",
      content: "Hi! I'm your AI assistant. I can help you build Hyperliquid applications by suggesting components, workflows, and optimizations. What would you like to create?",
      timestamp: new Date(),
      suggestions: [
        {
          type: "place-order",
          name: "Smart Order",
          reason: "Great starting point for any trading strategy",
          confidence: 95,
          category: "Trading"
        },
        {
          type: "market-data",
          name: "Price Feed",
          reason: "Essential for market-driven decisions",
          confidence: 90,
          category: "Data"
        },
        {
          type: "price-alert",
          name: "Price Alert",
          reason: "Useful for triggering automated actions",
          confidence: 85,
          category: "Automation"
        }
      ]
    }
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue, components)
      setMessages(prev => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-chart-2 hover:from-primary/90 hover:to-chart-2/90 shadow-lg z-50"
      >
        <Bot className="w-6 h-6 text-white" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] bg-card border-border shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-chart-2 flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Powered by HyperEasy AI</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onToggle}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onAddComponent={onAddComponent}
              onSuggestWorkflow={onSuggestWorkflow}
              onCopy={copyToClipboard}
              copiedId={copiedId}
            />
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-primary to-chart-2 flex items-center justify-center">
                <Bot className="w-3 h-3 text-primary-foreground" />
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.1s]" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about building your app..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2 mt-3">
          <QuickAction
            icon={<Lightbulb className="w-3 h-3" />}
            text="Suggest components"
            onClick={() => setInputValue("What components should I add for a trading bot?")}
          />
          <QuickAction
            icon={<Target className="w-3 h-3" />}
            text="Optimize workflow"
            onClick={() => setInputValue("How can I optimize my current workflow?")}
          />
          <QuickAction
            icon={<Shield className="w-3 h-3" />}
            text="Add risk management"
            onClick={() => setInputValue("What risk management should I add?")}
          />
        </div>
      </div>
    </Card>
  )
}

function MessageBubble({ 
  message, 
  onAddComponent, 
  onSuggestWorkflow, 
  onCopy, 
  copiedId 
}: {
  message: AIMessage
  onAddComponent: (type: string, name: string) => void
  onSuggestWorkflow: (workflow: WorkflowSuggestion) => void
  onCopy: (text: string, id: string) => void
  copiedId: string | null
}) {
  const [showSuggestions, setShowSuggestions] = useState(true)

  return (
    <div className={`flex gap-3 ${message.type === "user" ? "flex-row-reverse" : ""}`}>
      {message.type === "assistant" && (
        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#00D4FF] to-[#FF00A8] flex items-center justify-center flex-shrink-0 mt-1">
          <Bot className="w-3 h-3 text-white" />
        </div>
      )}
      
      <div className={`max-w-[80%] ${message.type === "user" ? "ml-auto" : ""}`}>
        <div
          className={`p-3 rounded-lg ${
            message.type === "user"
              ? "bg-[#00D4FF] text-black"
              : "bg-[#2A2A2A] border border-[#444] text-white"
          }`}
        >
          <p className="text-sm leading-relaxed">{message.content}</p>
          {message.type === "assistant" && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 h-6 text-xs text-gray-400 hover:text-white"
              onClick={() => onCopy(message.content, message.id)}
            >
              {copiedId === message.id ? (
                <Check className="w-3 h-3 mr-1" />
              ) : (
                <Copy className="w-3 h-3 mr-1" />
              )}
              {copiedId === message.id ? "Copied" : "Copy"}
            </Button>
          )}
        </div>

        {/* Component Suggestions */}
        {message.suggestions && message.suggestions.length > 0 && (
          <div className="mt-3 space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-gray-400 hover:text-white p-0 h-auto"
              onClick={() => setShowSuggestions(!showSuggestions)}
            >
              {showSuggestions ? (
                <ChevronUp className="w-3 h-3 mr-1" />
              ) : (
                <ChevronDown className="w-3 h-3 mr-1" />
              )}
              Suggested Components ({message.suggestions.length})
            </Button>

            {showSuggestions && (
              <div className="space-y-2">
                {message.suggestions.map((suggestion, index) => (
                  <Card
                    key={index}
                    className="p-3 bg-[#2A2A2A] border-[#444] hover:border-[#00D4FF] transition-colors cursor-pointer"
                    onClick={() => onAddComponent(suggestion.type, suggestion.name)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium text-white">{suggestion.name}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-[#666] text-gray-400 text-xs">
                          {suggestion.category}
                        </Badge>
                        <div className="text-xs text-green-400">
                          {suggestion.confidence}%
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">{suggestion.reason}</p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Workflow Suggestion */}
        {message.workflow && (
          <Card className="mt-3 p-3 bg-[#2A2A2A] border-[#444]">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#FF00A8]" />
              <h4 className="text-sm font-medium text-white">{message.workflow.title}</h4>
              <Badge className="bg-gradient-to-r from-[#00D4FF] to-[#FF00A8] text-white text-xs">
                {message.workflow.difficulty}
              </Badge>
            </div>
            <p className="text-xs text-gray-400 mb-3">{message.workflow.description}</p>
            <Button
              size="sm"
              onClick={() => onSuggestWorkflow(message.workflow!)}
              className="w-full bg-[#FF00A8] hover:bg-[#E6009A] text-white"
            >
              <Target className="w-3 h-3 mr-2" />
              Apply Workflow
            </Button>
          </Card>
        )}

        <div className="text-xs text-gray-500 mt-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  )
}

function QuickAction({ icon, text, onClick }: { icon: React.ReactNode, text: string, onClick: () => void }) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="h-6 text-xs border-[#666] text-gray-400 hover:border-[#00D4FF] hover:text-[#00D4FF]"
      onClick={onClick}
    >
      {icon}
      <span className="ml-1">{text}</span>
    </Button>
  )
}

function generateAIResponse(userInput: string, components: BuilderComponent[]): AIMessage {
  const input = userInput.toLowerCase()
  
  // Simple pattern matching for demo
  if (input.includes("trading bot") || input.includes("bot")) {
    return {
      id: Date.now().toString(),
      type: "assistant",
      content: "Great choice! For a trading bot, you'll want to start with market data, add some decision logic, and execute orders. Here are the essential components:",
      timestamp: new Date(),
      suggestions: [
        {
          type: "market-data",
          name: "Price Feed",
          reason: "Essential for getting real-time market data",
          confidence: 95,
          category: "Data"
        },
        {
          type: "technical-indicators",
          name: "Technical Analysis",
          reason: "Helps make informed trading decisions",
          confidence: 90,
          category: "Data"
        },
        {
          type: "place-order",
          name: "Order Execution",
          reason: "Required to execute your trading strategy",
          confidence: 95,
          category: "Trading"
        },
        {
          type: "risk-monitor",
          name: "Risk Management",
          reason: "Protects your capital from excessive losses",
          confidence: 85,
          category: "Risk"
        }
      ]
    }
  }
  
  if (input.includes("risk") || input.includes("protection")) {
    return {
      id: Date.now().toString(),
      type: "assistant",
      content: "Risk management is crucial! I recommend adding these components to protect your capital:",
      timestamp: new Date(),
      suggestions: [
        {
          type: "risk-monitor",
          name: "Risk Monitor",
          reason: "Tracks portfolio risk metrics in real-time",
          confidence: 95,
          category: "Risk"
        },
        {
          type: "liquidation-protector",
          name: "Liquidation Protector",
          reason: "Prevents liquidations automatically",
          confidence: 90,
          category: "Risk"
        },
        {
          type: "drawdown-limiter",
          name: "Drawdown Limiter",
          reason: "Limits maximum portfolio losses",
          confidence: 85,
          category: "Risk"
        }
      ]
    }
  }

  if (input.includes("optimize") || input.includes("improve")) {
    return {
      id: Date.now().toString(),
      type: "assistant",
      content: "I can see you have some components already. Here's how to optimize your workflow:",
      timestamp: new Date(),
      workflow: {
        title: "Optimized Trading Strategy",
        description: "A complete workflow with market analysis, smart execution, and risk management",
        components: ["market-data", "technical-indicators", "condition-checker", "place-order", "risk-monitor"],
        connections: [
          { from: "market-data", to: "technical-indicators" },
          { from: "technical-indicators", to: "condition-checker" },
          { from: "condition-checker", to: "place-order" },
          { from: "place-order", to: "risk-monitor" }
        ],
        difficulty: "Intermediate"
      }
    }
  }

  // Default response
  return {
    id: Date.now().toString(),
    type: "assistant",
    content: "I'd be happy to help! Could you tell me more about what you're trying to build? Are you looking to create a trading bot, portfolio manager, or something else?",
    timestamp: new Date(),
    suggestions: [
      {
        type: "market-data",
        name: "Market Data",
        reason: "Good starting point for most applications",
        confidence: 80,
        category: "Data"
      },
      {
        type: "scheduler",
        name: "Scheduler",
        reason: "Useful for automated actions",
        confidence: 75,
        category: "Automation"
      }
    ]
  }
}
