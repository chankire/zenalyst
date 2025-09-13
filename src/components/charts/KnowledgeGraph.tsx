import React, { useEffect, useRef, useState } from 'react'
import { CorrelationAnalysis, RootCauseAnalysis } from '@/lib/analytics'

interface Node {
  id: string
  label: string
  value: number
  group: 'metric' | 'cause' | 'effect'
  x?: number
  y?: number
  vx?: number
  vy?: number
}

interface Link {
  source: string
  target: string
  value: number
  type: 'correlation' | 'causation'
  strength: 'weak' | 'moderate' | 'strong'
}

interface KnowledgeGraphProps {
  correlations: CorrelationAnalysis[]
  rootCauses: RootCauseAnalysis[]
  width?: number
  height?: number
}

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ 
  correlations, 
  rootCauses, 
  width = 600, 
  height = 400 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [nodes, setNodes] = useState<Node[]>([])
  const [links, setLinks] = useState<Link[]>([])
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  
  useEffect(() => {
    const { nodes: newNodes, links: newLinks } = buildGraphData(correlations, rootCauses)
    setNodes(newNodes)
    setLinks(newLinks)
  }, [correlations, rootCauses])

  useEffect(() => {
    if (nodes.length === 0) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = width
    canvas.height = height

    // Initialize node positions if not set
    const initializedNodes = nodes.map(node => ({
      ...node,
      x: node.x || Math.random() * width,
      y: node.y || Math.random() * height,
      vx: node.vx || 0,
      vy: node.vy || 0
    }))

    // Simple force simulation
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height)
      
      // Apply forces
      applyForces(initializedNodes, links, width, height)
      
      // Draw links
      drawLinks(ctx, links, initializedNodes)
      
      // Draw nodes
      drawNodes(ctx, initializedNodes, hoveredNode)
      
      requestAnimationFrame(animate)
    }

    animate()

    // Mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      
      const hoveredNodeId = findNodeAtPosition(x, y, initializedNodes)
      setHoveredNode(hoveredNodeId)
    }

    canvas.addEventListener('mousemove', handleMouseMove)

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
    }
  }, [nodes, links, width, height, hoveredNode])

  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-muted/20 rounded-lg border border-border">
        <div className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
            🕸️
          </div>
          <p className="text-muted-foreground text-sm">
            No relationship data available for knowledge graph
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="border border-border rounded-lg cursor-pointer"
        style={{ width, height }}
      />
      
      {/* Legend */}
      <div className="absolute top-4 right-4 bg-card border border-border rounded-lg p-3 text-xs">
        <h4 className="font-semibold mb-2">Knowledge Graph</h4>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span>Metrics</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-secondary rounded-full"></div>
            <span>Causes</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <span>Effects</span>
          </div>
          <hr className="my-2" />
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 bg-blue-500"></div>
            <span>Correlation</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-0.5 bg-red-500"></div>
            <span>Causation</span>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredNode && (
        <div className="absolute bottom-4 left-4 bg-card border border-border rounded-lg p-3 text-sm shadow-lg max-w-xs">
          <div className="font-semibold">{hoveredNode}</div>
          <div className="text-muted-foreground text-xs mt-1">
            {getNodeDescription(hoveredNode, correlations, rootCauses)}
          </div>
        </div>
      )}
    </div>
  )
}

function buildGraphData(correlations: CorrelationAnalysis[], rootCauses: RootCauseAnalysis[]) {
  const nodeMap = new Map<string, Node>()
  const links: Link[] = []

  // Add nodes from correlations
  correlations.forEach(corr => {
    if (!nodeMap.has(corr.field1)) {
      nodeMap.set(corr.field1, {
        id: corr.field1,
        label: corr.field1,
        value: Math.abs(corr.correlation) * 100,
        group: 'metric'
      })
    }
    
    if (!nodeMap.has(corr.field2)) {
      nodeMap.set(corr.field2, {
        id: corr.field2,
        label: corr.field2,
        value: Math.abs(corr.correlation) * 100,
        group: 'metric'
      })
    }

    // Add correlation link
    links.push({
      source: corr.field1,
      target: corr.field2,
      value: Math.abs(corr.correlation),
      type: 'correlation',
      strength: corr.relationship as 'weak' | 'moderate' | 'strong'
    })
  })

  // Add nodes and links from root causes
  rootCauses.forEach(rc => {
    // Effect node
    if (!nodeMap.has(rc.effect)) {
      nodeMap.set(rc.effect, {
        id: rc.effect,
        label: rc.effect,
        value: 100,
        group: 'effect'
      })
    }

    // Cause nodes and links
    rc.causes.forEach(cause => {
      if (!nodeMap.has(cause.cause)) {
        nodeMap.set(cause.cause, {
          id: cause.cause,
          label: cause.cause,
          value: cause.contribution,
          group: 'cause'
        })
      }

      links.push({
        source: cause.cause,
        target: rc.effect,
        value: cause.contribution / 100,
        type: 'causation',
        strength: cause.contribution > 70 ? 'strong' : cause.contribution > 40 ? 'moderate' : 'weak'
      })
    })
  })

  return {
    nodes: Array.from(nodeMap.values()),
    links
  }
}

function applyForces(nodes: Node[], links: Link[], width: number, height: number) {
  const centerX = width / 2
  const centerY = height / 2
  const damping = 0.9
  
  // Reset forces
  nodes.forEach(node => {
    node.vx = (node.vx || 0) * damping
    node.vy = (node.vy || 0) * damping
  })

  // Repulsion between nodes
  nodes.forEach((node1, i) => {
    nodes.slice(i + 1).forEach(node2 => {
      const dx = (node1.x || 0) - (node2.x || 0)
      const dy = (node1.y || 0) - (node2.y || 0)
      const distance = Math.sqrt(dx * dx + dy * dy) || 1
      
      const repulsion = 500 / (distance * distance)
      const fx = (dx / distance) * repulsion
      const fy = (dy / distance) * repulsion
      
      node1.vx = (node1.vx || 0) + fx
      node1.vy = (node1.vy || 0) + fy
      node2.vx = (node2.vx || 0) - fx
      node2.vy = (node2.vy || 0) - fy
    })
  })

  // Attraction along links
  links.forEach(link => {
    const source = nodes.find(n => n.id === link.source)
    const target = nodes.find(n => n.id === link.target)
    
    if (source && target) {
      const dx = (target.x || 0) - (source.x || 0)
      const dy = (target.y || 0) - (source.y || 0)
      const distance = Math.sqrt(dx * dx + dy * dy) || 1
      
      const attraction = link.value * 0.1
      const fx = (dx / distance) * attraction
      const fy = (dy / distance) * attraction
      
      source.vx = (source.vx || 0) + fx
      source.vy = (source.vy || 0) + fy
      target.vx = (target.vx || 0) - fx
      target.vy = (target.vy || 0) - fy
    }
  })

  // Center force
  nodes.forEach(node => {
    const dx = centerX - (node.x || 0)
    const dy = centerY - (node.y || 0)
    
    node.vx = (node.vx || 0) + dx * 0.001
    node.vy = (node.vy || 0) + dy * 0.001
  })

  // Update positions
  nodes.forEach(node => {
    node.x = Math.max(30, Math.min(width - 30, (node.x || 0) + (node.vx || 0)))
    node.y = Math.max(30, Math.min(height - 30, (node.y || 0) + (node.vy || 0)))
  })
}

function drawLinks(ctx: CanvasRenderingContext2D, links: Link[], nodes: Node[]) {
  links.forEach(link => {
    const source = nodes.find(n => n.id === link.source)
    const target = nodes.find(n => n.id === link.target)
    
    if (source && target) {
      ctx.beginPath()
      ctx.moveTo(source.x || 0, source.y || 0)
      ctx.lineTo(target.x || 0, target.y || 0)
      
      // Style based on link type and strength
      const alpha = link.strength === 'strong' ? 0.8 : link.strength === 'moderate' ? 0.6 : 0.3
      const color = link.type === 'correlation' ? `rgba(59, 130, 246, ${alpha})` : `rgba(239, 68, 68, ${alpha})`
      const width = link.strength === 'strong' ? 3 : link.strength === 'moderate' ? 2 : 1
      
      ctx.strokeStyle = color
      ctx.lineWidth = width
      ctx.stroke()
    }
  })
}

function drawNodes(ctx: CanvasRenderingContext2D, nodes: Node[], hoveredNode: string | null) {
  nodes.forEach(node => {
    const x = node.x || 0
    const y = node.y || 0
    const radius = Math.max(8, Math.sqrt(node.value) * 2)
    const isHovered = hoveredNode === node.id
    
    // Node color based on group
    let color = '#6366f1' // primary
    if (node.group === 'cause') color = '#10b981' // secondary
    if (node.group === 'effect') color = '#f59e0b' // accent
    
    // Draw node
    ctx.beginPath()
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.fillStyle = isHovered ? color : `${color}dd`
    ctx.fill()
    
    // Draw border
    ctx.strokeStyle = isHovered ? '#ffffff' : `${color}44`
    ctx.lineWidth = isHovered ? 3 : 1
    ctx.stroke()
    
    // Draw label
    if (isHovered || radius > 12) {
      ctx.fillStyle = '#374151'
      ctx.font = `${Math.min(12, radius)}px Inter, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      
      const maxWidth = radius * 2
      const text = node.label.length > 8 ? node.label.substring(0, 8) + '...' : node.label
      ctx.fillText(text, x, y + radius + 12, maxWidth)
    }
  })
}

function findNodeAtPosition(x: number, y: number, nodes: Node[]): string | null {
  for (const node of nodes) {
    const dx = x - (node.x || 0)
    const dy = y - (node.y || 0)
    const radius = Math.max(8, Math.sqrt(node.value) * 2)
    
    if (Math.sqrt(dx * dx + dy * dy) <= radius) {
      return node.id
    }
  }
  return null
}

function getNodeDescription(nodeId: string, correlations: CorrelationAnalysis[], rootCauses: RootCauseAnalysis[]): string {
  // Check if it's in correlations
  const corr = correlations.find(c => c.field1 === nodeId || c.field2 === nodeId)
  if (corr) {
    const otherField = corr.field1 === nodeId ? corr.field2 : corr.field1
    return `${corr.relationship} correlation with ${otherField} (${(corr.correlation * 100).toFixed(1)}%)`
  }
  
  // Check if it's an effect in root causes
  const effect = rootCauses.find(rc => rc.effect === nodeId)
  if (effect) {
    return `Influenced by ${effect.causes.length} factors, primarily ${effect.causes[0]?.cause || 'unknown'}`
  }
  
  // Check if it's a cause
  for (const rc of rootCauses) {
    const cause = rc.causes.find(c => c.cause === nodeId)
    if (cause) {
      return `Contributes ${cause.contribution.toFixed(1)}% to ${rc.effect} (${cause.confidence.toFixed(1)}% confidence)`
    }
  }
  
  return 'Data relationship node'
}

export default KnowledgeGraph