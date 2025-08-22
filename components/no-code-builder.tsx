"use client"

import { useState, useEffect } from "react"
import { ComponentLibrary } from "./component-library"
import { EnhancedComponentLibrary } from "./enhanced-component-library"
import { AdvancedComponentLibrary } from "./advanced-component-library"
import { HyperliquidComponentLibrary } from "./hyperliquid-component-library"
import { HyperliquidTemplates } from "./hyperliquid-templates"
import { BuilderCanvas } from "./builder-canvas"
import { EnhancedBuilderCanvas } from "./enhanced-builder-canvas"
import { ComponentConfig } from "./component-config"
import { WorkflowPanel } from "./workflow-panel"
import { TemplateMarketplace } from "./template-marketplace"
import { EnhancedTemplateMarketplace } from "./enhanced-template-marketplace"
import { AppPreview } from "./app-preview"
import { ExportPanel } from "./export-panel"
import { AIAssistant } from "./ai-assistant"
import { OnboardingFlow } from "./onboarding-flow"
import { Play, Settings, Workflow, Package, Download, Eye, EyeOff, Save, Bot, HelpCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

export interface BuilderComponent {
  id: string
  type: string
  name: string
  config: Record<string, any>
  position: { x: number; y: number }
}

export interface WorkflowConnection {
  id: string
  sourceId: string
  targetId: string
  sourceOutput: string
  targetInput: string
}

export function NoCodeBuilder() {
  const [components, setComponents] = useState<BuilderComponent[]>([])
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [connections, setConnections] = useState<WorkflowConnection[]>([])
  const [connectingMode, setConnectingMode] = useState(false)
  const [connectionStart, setConnectionStart] = useState<{ componentId: string; output: string } | null>(null)
  const [workflowPanelOpen, setWorkflowPanelOpen] = useState(false)
  const [templateMarketplaceOpen, setTemplateMarketplaceOpen] = useState(false)
  const [exportPanelOpen, setExportPanelOpen] = useState(false)
  const [fullPreviewMode, setFullPreviewMode] = useState(false)
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [useEnhancedMode, setUseEnhancedMode] = useState(true)

  const addComponent = (type: string, name: string) => {
    const newComponent: BuilderComponent = {
      id: `${type}-${Date.now()}`,
      type,
      name,
      config: {},
      position: { x: 100, y: 100 },
    }
    setComponents([...components, newComponent])
  }

  const updateComponent = (id: string, updates: Partial<BuilderComponent>) => {
    if (!components.find((c) => c.id === id)) {
      setComponents([...components, updates as BuilderComponent])
    } else {
      setComponents(components.map((comp) => (comp.id === id ? { ...comp, ...updates } : comp)))
    }
  }

  const deleteComponent = (id: string) => {
    setComponents(components.filter((comp) => comp.id !== id))
    setConnections(connections.filter((conn) => conn.sourceId !== id && conn.targetId !== id))
    if (selectedComponent === id) setSelectedComponent(null)
  }

  const addConnection = (sourceId: string, targetId: string, sourceOutput: string, targetInput: string) => {
    const newConnection: WorkflowConnection = {
      id: `${sourceId}-${targetId}-${Date.now()}`,
      sourceId,
      targetId,
      sourceOutput,
      targetInput,
    }
    setConnections([...connections, newConnection])
  }

  const deleteConnection = (connectionId: string) => {
    setConnections(connections.filter((conn) => conn.id !== connectionId))
  }

  const startConnection = (componentId: string, output: string) => {
    setConnectingMode(true)
    setConnectionStart({ componentId, output })
  }

  const completeConnection = (targetId: string, input: string) => {
    if (connectionStart && connectionStart.componentId !== targetId) {
      addConnection(connectionStart.componentId, targetId, connectionStart.output, input)
    }
    setConnectingMode(false)
    setConnectionStart(null)
  }

  const cancelConnection = () => {
    setConnectingMode(false)
    setConnectionStart(null)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Delete" && selectedComponent) {
      deleteComponent(selectedComponent)
    }
    if (e.key === "Escape") {
      setSelectedComponent(null)
      cancelConnection()
    }
  }

  const loadTemplate = (template: any) => {
    // Convert template components to BuilderComponent format
    const templateComponents = template.components.map((comp: any, index: number) => ({
      id: `${comp.type}-${Date.now()}-${index}`,
      type: comp.type,
      name: comp.name,
      position: { x: 100 + (index % 3) * 200, y: 100 + Math.floor(index / 3) * 150 },
      config: comp.config || {}
    }))

    // Convert template connections to WorkflowConnection format
    const templateConnections = template.connections.map((conn: any, index: number) => {
      const fromComponent = templateComponents.find((c: any) => c.type === conn.from)
      const toComponent = templateComponents.find((c: any) => c.type === conn.to)
      
      if (fromComponent && toComponent) {
        return {
          id: `connection-${Date.now()}-${index}`,
          from: fromComponent.id,
          to: toComponent.id,
          fromOutput: "output",
          toInput: "input"
        }
      }
      return null
    }).filter(Boolean)

    setComponents(templateComponents)
    setConnections(templateConnections)
    setSelectedComponent(null)
    setTemplateMarketplaceOpen(false)
    
    console.log(`Loaded Hyperliquid template: ${template.name}`)
  }

  const handleAISuggestion = (workflow: any) => {
    // Implementation for AI workflow suggestions
    console.log("AI suggested workflow:", workflow)
  }

  const completeOnboarding = () => {
    console.log("Completing onboarding") // Debug log
    setShowOnboarding(false)
    localStorage.setItem("hypereasy-onboarding-completed", "true")
  }

  const skipOnboarding = () => {
    console.log("Skipping onboarding") // Debug log
    setShowOnboarding(false)
    localStorage.setItem("hypereasy-onboarding-completed", "true")
  }

  const restartOnboarding = () => {
    console.log("Restarting onboarding") // Debug log
    localStorage.removeItem("hypereasy-onboarding-completed")
    setShowOnboarding(true)
  }

  useEffect(() => {
    // Check if user has completed onboarding before
    try {
      const onboardingCompleted = localStorage.getItem("hypereasy-onboarding-completed")
      console.log("Onboarding completed:", onboardingCompleted) // Debug log
      
      if (!onboardingCompleted) {
        // First time user - show onboarding after a brief delay to ensure component is mounted
        const timer = setTimeout(() => {
          console.log("Showing onboarding for first-time user") // Debug log
          setShowOnboarding(true)
        }, 1000) // Increased delay to 1 second
        return () => clearTimeout(timer)
      } else {
        console.log("User has already completed onboarding") // Debug log
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error)
      // If localStorage fails, show onboarding as fallback
      const timer = setTimeout(() => {
        setShowOnboarding(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const saveAsTemplate = () => {
    const template = {
      components,
      connections,
      metadata: {
        name: "My Custom Template",
        description: "Custom template created by user",
        category: "Custom",
        createdAt: new Date().toISOString(),
      },
    }
    console.log("Saving template:", template)
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [selectedComponent])

  if (showOnboarding) {
    return <OnboardingFlow onComplete={completeOnboarding} onSkip={skipOnboarding} />
  }

  if (fullPreviewMode) {
    return (
      <div className="h-[calc(100vh-200px)]">
        <AppPreview components={components} connections={connections} onClose={() => setFullPreviewMode(false)} />
      </div>
    )
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-200px)] p-6 bg-gradient-to-br from-card/50 via-background to-card/30 rounded-3xl border border-border/50 shadow-2xl backdrop-blur-sm">
      <div className="w-80 bg-gradient-to-b from-card to-card/95 border border-border/50 rounded-2xl p-6 overflow-y-auto shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold gradient-text">Components</h2>
            <p className="text-sm text-muted-foreground">✨ Drag to build your Hyperliquid app</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setTemplateMarketplaceOpen(!templateMarketplaceOpen)}
            className={`group px-4 py-2.5 rounded-xl border text-xs font-medium transition-all duration-300 hover:scale-105 ${
              templateMarketplaceOpen
                ? "bg-gradient-to-r from-primary to-chart-2 text-white border-primary/50 shadow-lg shadow-primary/25"
                : "bg-card/80 text-muted-foreground border-border/50 hover:bg-card hover:text-foreground hover:border-primary/30 hover:shadow-md backdrop-blur-sm"
            }`}
          >
            <Package className="w-3 h-3 mr-1.5 group-hover:animate-pulse" />
            Templates
          </button>
          <button
            onClick={() => setWorkflowPanelOpen(!workflowPanelOpen)}
            className={`group px-4 py-2.5 rounded-xl border text-xs font-medium transition-all duration-300 hover:scale-105 ${
              workflowPanelOpen
                ? "bg-gradient-to-r from-chart-2 to-chart-3 text-white border-chart-2/50 shadow-lg shadow-chart-2/25"
                : "bg-card/80 text-muted-foreground border-border/50 hover:bg-card hover:text-foreground hover:border-chart-2/30 hover:shadow-md backdrop-blur-sm"
            }`}
          >
            <Workflow className="w-3 h-3 mr-1.5 group-hover:animate-pulse" />
            Workflows
          </button>
          <button
            onClick={() => setExportPanelOpen(!exportPanelOpen)}
            className={`group px-4 py-2.5 rounded-xl border text-xs font-medium transition-all duration-300 hover:scale-105 ${
              exportPanelOpen
                ? "bg-gradient-to-r from-chart-3 to-chart-4 text-white border-chart-3/50 shadow-lg shadow-chart-3/25"
                : "bg-card/80 text-muted-foreground border-border/50 hover:bg-card hover:text-foreground hover:border-chart-3/30 hover:shadow-md backdrop-blur-sm"
            }`}
          >
            <Download className="w-3 h-3 mr-1.5 group-hover:animate-bounce" />
            Export
          </button>
          <button
            onClick={() => setAiAssistantOpen(!aiAssistantOpen)}
            className={`group px-4 py-2.5 rounded-xl border text-xs font-medium transition-all duration-300 hover:scale-105 ${
              aiAssistantOpen
                ? "bg-gradient-to-r from-chart-4 to-primary text-white border-chart-4/50 shadow-lg shadow-chart-4/25"
                : "bg-card/80 text-muted-foreground border-border/50 hover:bg-card hover:text-foreground hover:border-chart-4/30 hover:shadow-md backdrop-blur-sm"
            }`}
          >
            <Bot className="w-3 h-3 mr-1.5 group-hover:animate-spin" />
            AI Assistant
          </button>
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`group px-4 py-2.5 rounded-xl border text-xs font-medium transition-all duration-300 hover:scale-105 ${
              previewMode
                ? "bg-gradient-to-r from-primary to-chart-1 text-white border-primary/50 shadow-lg shadow-primary/25"
                : "bg-gradient-to-r from-primary to-chart-2 text-white border-primary/50 hover:shadow-lg hover:shadow-primary/25"
            }`}
          >
            {previewMode ? <EyeOff className="w-3 h-3 mr-1.5 group-hover:animate-pulse" /> : <Eye className="w-3 h-3 mr-1.5 group-hover:animate-pulse" />}
            {previewMode ? "Edit" : "Preview"}
          </button>
        </div>

        <Tabs defaultValue="hyperliquid" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 bg-gradient-to-r from-muted to-muted/80 rounded-xl p-1 shadow-inner">
            <TabsTrigger value="hyperliquid" className="text-xs font-medium rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-chart-2 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">
              🚀 Hyperliquid
            </TabsTrigger>
            <TabsTrigger value="enhanced" className="text-xs font-medium rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-chart-2 data-[state=active]:to-chart-3 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">
              ✨ Enhanced
            </TabsTrigger>
            <TabsTrigger value="advanced" className="text-xs font-medium rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-chart-3 data-[state=active]:to-chart-4 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300">
              ⚡ Advanced
            </TabsTrigger>
          </TabsList>
          <TabsContent value="hyperliquid" className="mt-0">
            <HyperliquidComponentLibrary onAddComponent={addComponent} />
          </TabsContent>
          <TabsContent value="enhanced" className="mt-0">
            <EnhancedComponentLibrary onAddComponent={addComponent} />
          </TabsContent>
          <TabsContent value="advanced" className="mt-0">
            <AdvancedComponentLibrary onAddComponent={addComponent} />
          </TabsContent>
        </Tabs>

        <div className="mt-6 bg-gradient-to-br from-card to-card/95 border border-border/50 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
          <h4 className="text-lg font-bold gradient-text mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-primary" />
            💡 Quick Tips
          </h4>
          <ul className="text-xs text-muted-foreground space-y-2 mb-3">
            <li className="flex items-start">
              <span className="w-1 h-1 bg-accent rounded-full mt-2 mr-2 flex-shrink-0"></span>
              Drag components from library to canvas
            </li>
            <li className="flex items-start">
              <span className="w-1 h-1 bg-accent rounded-full mt-2 mr-2 flex-shrink-0"></span>
              Click components to configure settings
            </li>
            <li className="flex items-start">
              <span className="w-1 h-1 bg-accent rounded-full mt-2 mr-2 flex-shrink-0"></span>
              Connect components for automated workflows
            </li>
            <li className="flex items-start">
              <span className="w-1 h-1 bg-accent rounded-full mt-2 mr-2 flex-shrink-0"></span>
              Use Delete key to remove selected items
            </li>
          </ul>
          <Button
            size="sm"
            variant="outline"
            onClick={restartOnboarding}
            className="w-full text-xs border-border text-muted-foreground hover:text-foreground"
          >
            <HelpCircle className="w-3 h-3 mr-2" />
            Restart Tour
          </Button>
        </div>

        {components.length > 0 && (
          <div className="mt-6 space-y-3">
            <button
              onClick={saveAsTemplate}
              className="w-full px-4 py-2 rounded-md bg-background text-muted-foreground border border-border hover:bg-muted transition-colors flex items-center justify-center"
            >
              <Save className="w-4 h-4 mr-2" />
              Save as Template
            </button>
            <button
              onClick={() => setFullPreviewMode(true)}
              className="w-full px-4 py-2 rounded-md bg-accent text-accent-foreground hover:bg-accent/90 transition-colors flex items-center justify-center"
            >
              <Play className="w-4 h-4 mr-2" />
              Full Preview
            </button>
          </div>
        )}
      </div>

      <div
        className="flex-1 bg-gradient-to-br from-card via-card/95 to-card/90 border border-border/50 rounded-2xl relative overflow-hidden shadow-2xl backdrop-blur-sm"
        style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--primary) / 0.1) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      >
        <EnhancedBuilderCanvas
          components={components}
          connections={connections}
          selectedComponent={selectedComponent}
          connectingMode={connectingMode}
          connectionStart={connectionStart}
          onSelectComponent={setSelectedComponent}
          onUpdateComponent={updateComponent}
          onDeleteComponent={deleteComponent}
          onStartConnection={startConnection}
          onCompleteConnection={completeConnection}
          onCancelConnection={cancelConnection}
          onDeleteConnection={deleteConnection}
          previewMode={previewMode}
        />
      </div>

      {selectedComponent && !previewMode && !workflowPanelOpen && !templateMarketplaceOpen && !exportPanelOpen && (
        <div className="w-80 bg-gradient-to-b from-card to-card/95 border border-border/50 rounded-2xl p-6 overflow-y-auto shadow-xl backdrop-blur-sm">
          <ComponentConfig
            component={components.find((c) => c.id === selectedComponent)!}
            onUpdate={(updates) => updateComponent(selectedComponent, updates)}
          />
        </div>
      )}

      {workflowPanelOpen && !templateMarketplaceOpen && !exportPanelOpen && (
        <div className="w-80 bg-gradient-to-b from-card to-card/95 border border-border/50 rounded-2xl p-6 overflow-y-auto shadow-xl backdrop-blur-sm">
          <WorkflowPanel
            components={components}
            connections={connections}
            onDeleteConnection={deleteConnection}
            onClose={() => setWorkflowPanelOpen(false)}
          />
        </div>
      )}

      {templateMarketplaceOpen && !exportPanelOpen && (
        <div className="w-80 bg-gradient-to-b from-card to-card/95 border border-border/50 rounded-2xl p-6 overflow-y-auto shadow-xl backdrop-blur-sm">
          <HyperliquidTemplates onLoadTemplate={loadTemplate} onClose={() => setTemplateMarketplaceOpen(false)} />
        </div>
      )}

      {exportPanelOpen && (
        <div className="w-80 bg-gradient-to-b from-card to-card/95 border border-border/50 rounded-2xl p-6 overflow-y-auto shadow-xl backdrop-blur-sm">
          <ExportPanel components={components} connections={connections} onClose={() => setExportPanelOpen(false)} />
        </div>
      )}

      {/* AI Assistant */}
      <AIAssistant
        components={components}
        onAddComponent={addComponent}
        onSuggestWorkflow={handleAISuggestion}
        isOpen={aiAssistantOpen}
        onToggle={() => setAiAssistantOpen(!aiAssistantOpen)}
      />
    </div>
  )
}
