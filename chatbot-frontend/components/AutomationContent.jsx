// File: components/AutomationContent.jsx
import React, { useCallback } from 'react'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  useNodesState,
  useEdgesState,
} from 'reactflow'
import 'reactflow/dist/style.css'

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start Chatbot Trigger' },
    position: { x: 250, y: 5 },
  },
]

const initialEdges = []

function AutomationFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds))
  }, [setEdges])

  return (
    <div className="h-screen flex">
      <aside className="w-1/4 p-4 bg-gray-50 border-r">
        <h2 className="text-xl font-semibold mb-4">Automation Builder</h2>
        <p className="text-gray-700 text-sm">
          Drag nodes to define the flow of your chatbot automation.
        </p>
      </aside>
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background gap={16} />
        </ReactFlow>
      </div>
    </div>
  )
}

export default AutomationFlow
