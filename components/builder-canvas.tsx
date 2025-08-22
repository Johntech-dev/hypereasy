"use client"

import type React from "react"
import { useState } from "react"

import type { BuilderComponent, WorkflowConnection } from "./no-code-builder"
import { ComponentRenderer } from "./component-renderer"
import { ConnectionLine } from "./connection-line"
import { Trash2 } from "lucide-react"

interface BuilderCanvasProps {
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

export function BuilderCanvas({
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
}: BuilderCanvasProps) {
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null)
  const [dragOverPosition, setDragOverPosition] = useState<{ x: number; y: number } | null>(null)

  const GRID_SIZE = 20

  const snapToGrid = (x: number, y: number) => ({
    x: Math.round(x / GRID_SIZE) * GRID_SIZE,
    y: Math.round(y / GRID_SIZE) * GRID_SIZE,
  })

  const handleComponentClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!previewMode) {
      onSelectComponent(selectedComponent === id ? null : id)
    }
  }

  const handleCanvasClick = () => {
    if (!previewMode) {
      onSelectComponent(null)
      if (connectingMode) {
        onCancelConnection()
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"

    const rect = e.currentTarget.getBoundingClientRect()
    const position = snapToGrid(e.clientX - rect.left, e.clientY - rect.top)
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
      const position = snapToGrid(e.clientX - rect.left, e.clientY - rect.top)

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

  const handleComponentDragStart = (e: React.DragEvent, componentId: string) => {
    e.stopPropagation()
    setDraggedComponent(componentId)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", componentId)
  }

  const handleComponentDragEnd = () => {
    setDraggedComponent(null)
  }

  const handleComponentDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    e.stopPropagation()

    const draggedId = e.dataTransfer.getData("text/plain")
    if (draggedId && draggedId !== targetId) {
      const rect = e.currentTarget.getBoundingClientRect()
      const position = snapToGrid(e.clientX - rect.left, e.clientY - rect.top)

      onUpdateComponent(draggedId, { position })
    }
  }

  return (
    <div
      className={`w-full h-full relative bg-[#0F0F0F] overflow-auto ${connectingMode ? "cursor-crosshair" : ""}`}
      onClick={handleCanvasClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Grid Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
        }}
      />

      {/* Connection Lines */}
      <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {connections.map((connection) => {
          const sourceComponent = components.find((c) => c.id === connection.sourceId)
          const targetComponent = components.find((c) => c.id === connection.targetId)

          if (!sourceComponent || !targetComponent) return null

          return (
            <ConnectionLine
              key={connection.id}
              connection={connection}
              sourcePosition={sourceComponent.position}
              targetPosition={targetComponent.position}
              onDelete={() => onDeleteConnection(connection.id)}
            />
          )
        })}
      </svg>

      {/* Drag Preview */}
      {dragOverPosition && (
        <div
          className="absolute w-64 h-32 border-2 border-dashed border-[#00D4FF] bg-[#00D4FF]/10 rounded-lg flex items-center justify-center"
          style={{
            left: dragOverPosition.x,
            top: dragOverPosition.y,
          }}
        >
          <span className="text-[#00D4FF] text-sm">Drop component here</span>
        </div>
      )}

      {/* Connecting Mode Overlay */}
      {connectingMode && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-[#FF00A8] text-white px-4 py-2 rounded-lg text-sm z-10">
          Click on a component to connect • ESC to cancel
        </div>
      )}

      {/* Components */}
      {components.map((component) => (
        <div
          key={component.id}
          className={`absolute transition-all duration-200 ${
            draggedComponent === component.id ? "opacity-50 scale-95" : ""
          } ${
            selectedComponent === component.id && !previewMode
              ? "ring-2 ring-[#00D4FF] ring-offset-2 ring-offset-[#0F0F0F]"
              : ""
          } ${
            connectingMode && connectionStart?.componentId !== component.id
              ? "ring-2 ring-[#FF00A8] ring-offset-1 ring-offset-[#0F0F0F]"
              : ""
          }`}
          style={{
            left: component.position.x,
            top: component.position.y,
            transform: selectedComponent === component.id && !previewMode ? "scale(1.02)" : "scale(1)",
            cursor: previewMode ? "default" : connectingMode ? "crosshair" : "grab",
            zIndex: 2,
          }}
          draggable={!previewMode && !connectingMode}
          onDragStart={(e) => handleComponentDragStart(e, component.id)}
          onDragEnd={handleComponentDragEnd}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => handleComponentDrop(e, component.id)}
          onClick={(e) => {
            if (connectingMode) {
              e.stopPropagation()
              onCompleteConnection(component.id, "input")
            } else {
              handleComponentClick(component.id, e)
            }
          }}
        >
          <ComponentRenderer
            component={component}
            previewMode={previewMode}
            connectingMode={connectingMode}
            onStartConnection={onStartConnection}
          />

          {/* Delete Button */}
          {selectedComponent === component.id && !previewMode && !connectingMode && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDeleteComponent(component.id)
              }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs transition-colors z-10"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      ))}

      {/* Empty State */}
      {components.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center space-y-4">
            <div className="text-6xl text-gray-600">🎯</div>
            <h3 className="text-xl font-medium text-gray-400">Start Building</h3>
            <p className="text-gray-500 max-w-md">
              Drag components from the sidebar to start building your Hyperliquid application
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
