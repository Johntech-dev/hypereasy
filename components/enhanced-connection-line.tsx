"use client"

import { useState } from "react"
import type { WorkflowConnection } from "./no-code-builder"
import { Trash2, Zap } from "lucide-react"

interface EnhancedConnectionLineProps {
  connection: WorkflowConnection
  sourcePosition: { x: number; y: number }
  targetPosition: { x: number; y: number }
  onDelete: () => void
  isSelected: boolean
  animated?: boolean
}

export function EnhancedConnectionLine({
  connection,
  sourcePosition,
  targetPosition,
  onDelete,
  isSelected,
  animated = false
}: EnhancedConnectionLineProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Calculate connection points
  const sourceX = sourcePosition.x + 320 // Component width
  const sourceY = sourcePosition.y + 80  // Component height / 2
  const targetX = targetPosition.x
  const targetY = targetPosition.y + 80

  // Calculate control points for smooth curve
  const controlPointOffset = Math.min(Math.abs(targetX - sourceX) / 2, 150)
  const control1X = sourceX + controlPointOffset
  const control1Y = sourceY
  const control2X = targetX - controlPointOffset
  const control2Y = targetY

  // Create the path
  const pathData = `M ${sourceX} ${sourceY} C ${control1X} ${control1Y}, ${control2X} ${control2Y}, ${targetX} ${targetY}`

  // Calculate midpoint for delete button
  const midX = (sourceX + targetX) / 2
  const midY = (sourceY + targetY) / 2

  // Connection type styling
  const getConnectionStyle = () => {
    const baseStyle = {
      stroke: "hsl(var(--primary))",
      strokeWidth: isSelected ? 3 : isHovered ? 2.5 : 2,
      opacity: isHovered || isSelected ? 1 : 0.7
    }

    if (animated) {
      return {
        ...baseStyle,
        stroke: "hsl(var(--chart-1))",
        strokeDasharray: "5,5",
        strokeDashoffset: "0",
        animation: "dash 2s linear infinite"
      }
    }

    return baseStyle
  }

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => setIsHovered(false)

  return (
    <g>
      {/* Animated dash keyframes - inline styles for SVG */}
      <defs>
        <style>
          {`
            @keyframes dash {
              to {
                stroke-dashoffset: -10;
              }
            }
          `}
        </style>
      </defs>

      {/* Connection shadow/glow */}
      <path
        d={pathData}
        fill="none"
        stroke={animated ? "hsl(var(--chart-1))" : "hsl(var(--primary))"}
        strokeWidth={isSelected ? 6 : isHovered ? 5 : 4}
        opacity={0.2}
        filter="blur(2px)"
      />

      {/* Main connection line */}
      <path
        d={pathData}
        fill="none"
        style={getConnectionStyle()}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="cursor-pointer transition-all duration-200"
      />

      {/* Data flow animation dots */}
      {animated && (
        <>
          <circle r="3" fill="hsl(var(--chart-1))" opacity="0.8">
            <animateMotion dur="3s" repeatCount="indefinite" path={pathData} />
          </circle>
          <circle r="2" fill="hsl(var(--chart-2))" opacity="0.6">
            <animateMotion dur="3s" repeatCount="indefinite" path={pathData} begin="0.5s" />
          </circle>
          <circle r="2" fill="hsl(var(--chart-3))" opacity="0.6">
            <animateMotion dur="3s" repeatCount="indefinite" path={pathData} begin="1s" />
          </circle>
        </>
      )}

      {/* Connection arrowhead */}
      <defs>
        <marker
          id={`arrowhead-${connection.id}`}
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill={animated ? "hsl(var(--chart-1))" : "hsl(var(--primary))"}
            opacity={isHovered || isSelected ? 1 : 0.7}
          />
        </marker>
      </defs>

      {/* Apply arrowhead to main line */}
      <path
        d={pathData}
        fill="none"
        stroke="transparent"
        strokeWidth="2"
        markerEnd={`url(#arrowhead-${connection.id})`}
      />

      {/* Connection label */}
      {(isHovered || isSelected) && (
        <g>
          {/* Label background */}
          <rect
            x={midX - 40}
            y={midY - 15}
            width="80"
            height="30"
            rx="15"
            fill="hsl(var(--background))"
            stroke="hsl(var(--border))"
            strokeWidth="1"
            opacity="0.95"
          />
          
          {/* Label text */}
          <text
            x={midX}
            y={midY + 5}
            textAnchor="middle"
            fontSize="11"
            fill="hsl(var(--foreground))"
            fontWeight="500"
          >
            {connection.sourceOutput}
          </text>

          {/* Data flow indicator */}
          {animated && (
            <g>
              <Zap className="w-3 h-3" />
              <circle
                cx={midX + 25}
                cy={midY - 5}
                r="2"
                fill="hsl(var(--chart-1))"
                opacity="0.8"
              >
                <animate
                  attributeName="opacity"
                  values="0.8;0.3;0.8"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          )}
        </g>
      )}

      {/* Delete button */}
      {(isHovered || isSelected) && (
        <g>
          <circle
            cx={midX}
            cy={midY - 25}
            r="12"
            fill="hsl(var(--destructive))"
            stroke="hsl(var(--background))"
            strokeWidth="2"
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          />
          <foreignObject
            x={midX - 6}
            y={midY - 31}
            width="12"
            height="12"
            className="cursor-pointer pointer-events-none"
          >
            <Trash2 className="w-3 h-3 text-destructive-foreground" />
          </foreignObject>
        </g>
      )}

      {/* Connection endpoints */}
      <circle
        cx={sourceX}
        cy={sourceY}
        r="4"
        fill="hsl(var(--chart-1))"
        stroke="hsl(var(--background))"
        strokeWidth="2"
      />
      <circle
        cx={targetX}
        cy={targetY}
        r="4"
        fill="hsl(var(--chart-3))"
        stroke="hsl(var(--background))"
        strokeWidth="2"
      />

      {/* Connection info tooltip */}
      {isHovered && (
        <g>
          <rect
            x={midX - 60}
            y={midY + 20}
            width="120"
            height="40"
            rx="8"
            fill="hsl(var(--popover))"
            stroke="hsl(var(--border))"
            strokeWidth="1"
            opacity="0.95"
            filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
          />
          <text
            x={midX}
            y={midY + 35}
            textAnchor="middle"
            fontSize="10"
            fill="hsl(var(--popover-foreground))"
            fontWeight="500"
          >
            {connection.sourceOutput} → {connection.targetInput}
          </text>
          <text
            x={midX}
            y={midY + 50}
            textAnchor="middle"
            fontSize="9"
            fill="hsl(var(--muted-foreground))"
          >
            Click to delete
          </text>
        </g>
      )}
    </g>
  )
}
