"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import type { BuilderComponent, WorkflowConnection } from "./no-code-builder"
import { EnhancedComponentRenderer } from "./enhanced-component-renderer"
import { EnhancedConnectionLine } from "./enhanced-connection-line"
import { Trash2, Plus, Maximize2, Minimize2, RotateCcw, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface EnhancedBuilderCanvasProps {
  components: BuilderComponent[]
  connections: WorkflowConnection[]
  selectedComponent: string | null
  connectingMode: boolean
  connectionStart: { componentId: string; output: string } | null
  onSelectComponent: (id: string | null) => void
  onUpdateComponent: (id: string, updates: Partial<BuilderComponent>) => void
  onDeleteComponent: (id: string) => void
  onStartConnection: (componentId: string, output: string) => void
  onCompleteConnection: (targetId: string, input: string) => void
  onCancelConnection: () => void
  onDeleteConnection: (connectionId: string) => void
  previewMode: boolean
}

export function EnhancedBuilderCanvas({
  components,
  connections,
  selectedComponent,
  connectingMode,
  connectionStart,
  onSelectComponent,
  onUpdateComponent,
  onDeleteComponent,
  onStartConnection,
  onCompleteConnection,
  onCancelConnection,
  onDeleteConnection,
  previewMode,
}: EnhancedBuilderCanvasProps) {
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null)
  const [dragOverPosition, setDragOverPosition] = useState<{ x: number; y: number } | null>(null)
  const [canvasZoom, setCanvasZoom] = useState(1)
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)

  const GRID_SIZE = 20
  const MIN_ZOOM = 0.5
  const MAX_ZOOM = 2

  const snapToGrid = useCallback((x: number, y: number) => ({
    x: Math.round(x / GRID_SIZE) * GRID_SIZE,
    y: Math.round(y / GRID_SIZE) * GRID_SIZE,
  }), [])

  const handleComponentClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!previewMode) {
      onSelectComponent(selectedComponent === id ? null : id)
    }
  }

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (!previewMode) {
        onSelectComponent(null)
        if (connectingMode) {
          onCancelConnection()
        }
      }
    }
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? 0.9 : 1.1
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, canvasZoom * delta))
    setCanvasZoom(newZoom)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.metaKey)) { // Middle mouse or Cmd+click
      setIsPanning(true)
      setPanStart({ x: e.clientX - canvasOffset.x, y: e.clientY - canvasOffset.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setCanvasOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"

    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left - canvasOffset.x) / canvasZoom
    const y = (e.clientY - rect.top - canvasOffset.y) / canvasZoom
    const position = snapToGrid(x, y)
    setDragOverPosition(position)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverPosition(null)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOverPosition(null)

    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"))
      const rect = e.currentTarget.getBoundingClientRect()
      const x = (e.clientX - rect.left - canvasOffset.x) / canvasZoom
      const y = (e.clientY - rect.top - canvasOffset.y) / canvasZoom
      const position = snapToGrid(x, y)

      const newComponent: BuilderComponent = {
        id: `${data.type}-${Date.now()}`,
        type: data.type,
        name: data.name,
        config: {},
        position,
      }

      onUpdateComponent(newComponent.id, newComponent)
    } catch (error) {
      console.error("Failed to parse drop data:", error)
    }
  }

  const resetCanvas = () => {
    setCanvasZoom(1)
    setCanvasOffset({ x: 0, y: 0 })
  }

  const fitToScreen = () => {
    if (components.length === 0) return

    const padding = 100
    const minX = Math.min(...components.map(c => c.position.x)) - padding
    const minY = Math.min(...components.map(c => c.position.y)) - padding
    const maxX = Math.max(...components.map(c => c.position.x + 320)) + padding // 320 is component width
    const maxY = Math.max(...components.map(c => c.position.y + 200)) + padding // 200 is component height

    const canvasRect = canvasRef.current?.getBoundingClientRect()
    if (!canvasRect) return

    const contentWidth = maxX - minX
    const contentHeight = maxY - minY
    const scaleX = canvasRect.width / contentWidth
    const scaleY = canvasRect.height / contentHeight
    const scale = Math.min(scaleX, scaleY, MAX_ZOOM)

    setCanvasZoom(scale)
    setCanvasOffset({
      x: (canvasRect.width - contentWidth * scale) / 2 - minX * scale,
      y: (canvasRect.height - contentHeight * scale) / 2 - minY * scale
    })
  }

  return (
    <div className="relative w-full h-full overflow-hidden bg-background rounded-lg border border-border">
      {/* Canvas Controls */}
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
          {Math.round(canvasZoom * 100)}%
        </Badge>
        <Button
          size="sm"
          variant="outline"
          onClick={resetCanvas}
          className="bg-background/80 backdrop-blur-sm"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={fitToScreen}
          className="bg-background/80 backdrop-blur-sm"
          title="Fit to Screen"
        >
          <Maximize2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Connection Mode Indicator */}
      {connectingMode && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <Badge className="bg-chart-2 text-chart-2-foreground animate-pulse">
            <Zap className="w-3 h-3 mr-1" />
            Connecting Mode - Click target component
          </Badge>
        </div>
      )}

      {/* Canvas */}
      <div
        ref={canvasRef}
        className={`w-full h-full relative ${connectingMode ? "cursor-crosshair" : isPanning ? "cursor-grabbing" : "cursor-grab"}`}
        onClick={handleCanvasClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          transform: `scale(${canvasZoom}) translate(${canvasOffset.x / canvasZoom}px, ${canvasOffset.y / canvasZoom}px)`,
          transformOrigin: '0 0'
        }}
      >
        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
            backgroundPosition: `${canvasOffset.x % GRID_SIZE}px ${canvasOffset.y % GRID_SIZE}px`
          }}
        />

        {/* Enhanced Grid Lines */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: `${GRID_SIZE * 5}px ${GRID_SIZE * 5}px`,
          }}
        />

        {/* Connection Lines */}
        <svg 
          className="absolute inset-0 pointer-events-none" 
          style={{ 
            zIndex: 1,
            width: '100%',
            height: '100%'
          }}
        >
          {connections.map((connection) => {
            const sourceComponent = components.find((c) => c.id === connection.sourceId)
            const targetComponent = components.find((c) => c.id === connection.targetId)

            if (!sourceComponent || !targetComponent) return null

            return (
              <EnhancedConnectionLine
                key={connection.id}
                connection={connection}
                sourcePosition={sourceComponent.position}
                targetPosition={targetComponent.position}
                onDelete={() => onDeleteConnection(connection.id)}
                isSelected={false}
                animated={previewMode}
              />
            )
          })}
        </svg>

        {/* Drag Preview */}
        {dragOverPosition && (
          <div
            className="absolute pointer-events-none"
            style={{
              left: dragOverPosition.x,
              top: dragOverPosition.y,
              zIndex: 5
            }}
          >
            <div className="w-80 h-48 border-2 border-dashed border-primary bg-primary/5 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <div className="text-center">
                <Plus className="w-8 h-8 text-primary mx-auto mb-2" />
                <span className="text-primary text-sm font-medium">Drop component here</span>
              </div>
            </div>
          </div>
        )}

        {/* Components */}
        {components.map((component) => (
          <div
            key={component.id}
            className="absolute transition-all duration-200"
            style={{
              left: component.position.x,
              top: component.position.y,
              zIndex: selectedComponent === component.id ? 10 : 2,
            }}
            onClick={(e) => {
              if (connectingMode) {
                e.stopPropagation()
                onCompleteConnection(component.id, "input")
              } else {
                handleComponentClick(component.id, e)
              }
            }}
          >
            <EnhancedComponentRenderer
              component={component}
              previewMode={previewMode}
              connectingMode={connectingMode}
              onStartConnection={onStartConnection}
              isSelected={selectedComponent === component.id}
              connectionPorts={{
                inputs: ["input", "trigger"],
                outputs: ["output", "data", "result"]
              }}
            />

            {/* Delete Button */}
            {selectedComponent === component.id && !previewMode && !connectingMode && (
              <Button
                size="sm"
                variant="destructive"
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full p-0 shadow-lg"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteComponent(component.id)
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}

        {/* Empty State */}
        {components.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center space-y-6 max-w-md">
              <div className="w-24 h-24 mx-auto bg-gradient-to-r from-primary to-chart-2 rounded-full flex items-center justify-center opacity-20">
                <Plus className="w-12 h-12 text-primary-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">Start Building Your App</h3>
                <p className="text-muted-foreground">
                  Drag components from the sidebar to create your Hyperliquid application.
                  Connect them together to build powerful automated workflows.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="border-chart-1 text-chart-1">Trading Bots</Badge>
                <Badge variant="outline" className="border-chart-2 text-chart-2">Portfolio Managers</Badge>
                <Badge variant="outline" className="border-chart-3 text-chart-3">Risk Tools</Badge>
                <Badge variant="outline" className="border-chart-4 text-chart-4">Analytics</Badge>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Canvas Info */}
      <div className="absolute bottom-4 left-4 z-10">
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm text-xs">
            {components.length} components
          </Badge>
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm text-xs">
            {connections.length} connections
          </Badge>
          {previewMode && (
            <Badge className="bg-chart-1 text-chart-1-foreground text-xs animate-pulse">
              Live Preview
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
