// File: components/AutomationContent.jsx
import React, { useCallback, useState } from 'react'
import Link from 'next/link'
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  Handle,
  useNodesState,
  useEdgesState,
} from 'reactflow'
import 'reactflow/dist/style.css'

// Custom node with editable textarea and connection handles
function EditableNode({ id, data }) {
  const textareaRef = React.useRef(null)

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [data.label])

  const onChange = (evt) => {
    data.onChange(id, evt.target.value)
  }

  const onInput = (evt) => {
    const ta = evt.target
    ta.style.height = 'auto'
    ta.style.height = `${ta.scrollHeight}px`
    onChange(evt)
  }

  return (
   <div className="relative bg-white/60 dark:bg-gray-900/70 backdrop-blur-md border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg p-4 transition duration-300 hover:shadow-xl">
  <Handle type="target" position="top" id="a" style={{ background: '#8b5cf6' }} />
  <textarea
    ref={textareaRef}
    className="w-full bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none resize-none"
    value={data.label}
    onChange={onChange}
    onInput={onInput}
    rows={1}
    placeholder="Type your action..."
  />
  <Handle type="source" position="bottom" id="b" style={{ background: '#8b5cf6' }} />
</div>

  )
}

const nodeTypes = { editable: EditableNode }

const initialNodes = [
  {
    id: '1',
    type: 'editable',
    data: { label: 'Start Chatbot Trigger', onChange: null },
    position: { x: 250, y: 5 },
  },
]

const initialEdges = []

let idCounter = 2
function getId() {
  return `node_${idCounter++}`
}

export default function AutomationFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [nodeType, setNodeType] = useState('message')
  const [selectedNode, setSelectedNode] = useState(null)

  // ensure existing nodes have onChange handler
  React.useEffect(() => {
    setNodes((nds) =>
      nds.map((n) =>
        n.data.onChange
          ? n
          : { ...n, data: { ...n.data, onChange: handleLabelChange } }
      )
    )
  }, [])

  const handleLabelChange = useCallback((id, value) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, label: value, onChange: handleLabelChange } } : n
      )
    )
  }, [])

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds))
  }, [setEdges])

  const addNode = useCallback(() => {
    const position = { x: Math.random() * 400 + 100, y: Math.random() * 200 + 100 }
    let label = ''
    let type = 'editable'

    switch (nodeType) {
      case 'message':
        label = 'Chatbot Message'
        break
      case 'delay':
        label = 'Delay Action'
        break
      case 'apiCall':
        label = 'API Call'
        break
      case 'condition':
        label = 'Condition Branch'
        break
      case 'end':
        label = 'End Flow'
        break
      default:
        label = 'Node'
    }

    const newNode = {
      id: getId(),
      type,
      data: { label, onChange: handleLabelChange },
      position,
    }
    setNodes((nds) => nds.concat(newNode))
  }, [nodeType, setNodes, handleLabelChange])

  const deleteNode = () => {
    if (!selectedNode) return
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode))
    setEdges((eds) => eds.filter((e) => e.source !== selectedNode && e.target !== selectedNode))
    setSelectedNode(null)
  }

  return (
    <div className="h-screen flex">
      {/* Sidebar Controls */}
     <aside className="w-1/4 p-6 bg-gradient-to-b from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-r dark:border-gray-700 flex flex-col sticky top-0 h-screen overflow-y-auto shadow-xl">


       <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">✨ Automation Builder</h2>
<p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
  Add nodes, label them, and drag to connect. Visualize your flow beautifully.
</p>

<label className="text-gray-700 dark:text-gray-300 font-medium mb-1">Node Type</label>
<select
  value={nodeType}
  onChange={(e) => setNodeType(e.target.value)}
  className="w-full px-3 py-2 mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
>
  <option value="message">💬 Chatbot Message</option>
  <option value="delay">⏱ Delay Action</option>
  <option value="apiCall">🔗 API Call</option>
  <option value="condition">🔀 Condition Branch</option>
  <option value="end">🛑 End Flow</option>
</select>

<button
  onClick={addNode}
  className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg mb-3 hover:bg-purple-700 transition"
>
  ➕ Add Node
</button>

<button
  onClick={deleteNode}
  disabled={!selectedNode}
  className="bg-rose-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-rose-700 transition disabled:opacity-50"
>
  🗑 Delete Selected Node
</button>

      </aside>

      {/* Canvas Area */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={(evt, node) => setSelectedNode(node.id)}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background variant="dots" gap={24} size={1} color="#d1d5db" />
<Controls showInteractive={false} />

        </ReactFlow>
      </div>
    </div>
  )
}
