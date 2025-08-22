"use client"

import type { WorkflowConnection } from "./no-code-builder"
import { X } from "lucide-react"

interface ConnectionLineProps {
  connection: WorkflowConnection
  sourcePosition: { x: number; y: number }
  targetPosition: { x: number; y: number }
  onDelete: () => void
}

export function ConnectionLine({ connection, sourcePosition, targetPosition, onDelete }: ConnectionLineProps) {
  // Calculate connection points (right side of source, left side of target)
  const sourceX = sourcePosition.x + 256 // Component width
  const sourceY = sourcePosition.y + 64 // Component height / 2
  const targetX = targetPosition.x
  const targetY = targetPosition.y + 64

  // Create curved path
  const midX = sourceX + (targetX - sourceX) / 2
  const path = `M ${sourceX} ${sourceY} C ${midX} ${sourceY}, ${midX} ${targetY}, ${targetX} ${targetY}`

  // Calculate midpoint for delete button
  const deleteX = sourceX + (targetX - sourceX) / 2
  const deleteY = sourceY + (targetY - sourceY) / 2

  return (
    <g>
      {/* Connection Path */}
      <path d={path} stroke="#00D4FF" strokeWidth="2" fill="none" strokeDasharray="5,5" className="animate-pulse" />

      {/* Arrow Head */}
      <polygon
        points={`${targetX - 8},${targetY - 4} ${targetX},${targetY} ${targetX - 8},${targetY + 4}`}
        fill="#00D4FF"
      />

      {/* Delete Button */}
      <foreignObject x={deleteX - 10} y={deleteY - 10} width="20" height="20">
        <button
          onClick={onDelete}
          className="w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white transition-colors"
          style={{ fontSize: "10px" }}
        >
          <X className="w-3 h-3" />
        </button>
      </foreignObject>

      {/* Connection Label */}
      <foreignObject x={deleteX - 30} y={deleteY - 30} width="60" height="20">
        <div className="text-xs text-[#00D4FF] bg-[#1A1A1A] px-2 py-1 rounded border border-[#333] text-center">
          {connection.sourceOutput} → {connection.targetInput}
        </div>
      </foreignObject>
    </g>
  )
}
