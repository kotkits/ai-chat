// File: components/AutomationContent.jsx
import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
} from "react";
import { useRouter } from "next/router";
import ReactFlow, {
  
  Controls,
  Background,
  addEdge,
  Handle,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";



const TopHandle = ({ color = "#9CA3AF" }) => (
  <Handle type="target" position="top" id="in" style={{ background: color, width: 10, height: 10 }} />
);

const BottomHandle = ({ color = "#9CA3AF" }) => (
  <Handle type="source" position="bottom" id="out" style={{ background: color, width: 10, height: 10 }} />
);


//
// Trigger Node
const TriggerNode = React.memo(({ id, data, selected }) => {
  const nodeRef = useRef(null);
  return (
    <div
      ref={nodeRef}
      style={{ width: data.width, minHeight: data.height }}
      className="relative bg-white dark:bg-gray-800 border-2 border-green-400 rounded-lg shadow-md p-4 flex flex-col"
    >
      {selected && (
   <button
    onClick={() => data.onDelete(id)}
    className="absolute -top-1% right-3 bg-white p-1 rounded-full shadow hover:bg-red-50 transition"
    title="Delete this node"
  >
  <svg xmlns="http://www.w3.org/2000/svg"
       className="h-4 w-4 text-red-600"
       fill="none"
       viewBox="0 0 24 24"
       stroke="currentColor"
  >
    <path strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-4 0h14"
    />
  </svg>
  </button>
      )}
      <div className="flex items-center mb-2">
        <span className="text-2xl text-green-500 mr-2">⚡</span>
        <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">When…</span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        A Trigger is an event that starts your Automation. Click to add a Trigger.
      </p>
      <div className="flex-1">
        <button
          onClick={() => data.onAddTrigger(id)}
          className="w-full h-10 border border-dashed border-blue-400 rounded-lg text-blue-600 font-semibold hover:bg-blue-50 dark:hover:bg-gray-700 transition"
        >
          + New Trigger
        </button>
      </div>
      <div className="absolute bottom-1 right-2 flex items-center space-x-1">
        <span className="text-xs text-gray-700 dark:text-gray-300">Then</span>
        <Handle
          type="source"
          position="bottom"
          id="out"
          style={{ position: "static", transform: "none", marginLeft: 4, background: "#34D399", width: 10, height: 10 }}
        />
      </div>
    </div>
  );
});

//
// ─── SelectorNode ──────────────────────────────────────────────────────────
// A dashed‐border panel listing all possible “first steps.” Clicking one calls data.onSelect(label).
// Has a top (incoming) handle and a right (outgoing) handle.
//
const SelectorNode = React.memo(function SelectorNode({ id, data, selected }) {
  const nodeRef = useRef(null);

  const handlePick = (label) => {
    data.onSelect(label);
  };




  return (
    <div
      ref={nodeRef}
      style={{
        width: data.width,
        minHeight: data.height,
        boxSizing: "border-box",
      }}
      className="
        relative
        bg-white dark:bg-gray-800
        border-2 border-dashed border-gray-400
        rounded-lg
        shadow-sm
        p-4
        overflow-auto
      "
    >
 {selected && (
  <button
    onClick={() => data.onDelete(id)}
    className="absolute -top-1% right-3 bg-white p-1 rounded-full shadow hover:bg-red-50 transition"
    title="Delete this node"
  >
    <svg xmlns="http://www.w3.org/2000/svg"
         className="h-4 w-4 text-red-600"
         fill="none"
         viewBox="0 0 24 24"
         stroke="currentColor"
    >
      <path strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>
)}


      
      {/* Top handle (incoming) */}
      <Handle
        type="target"
        position="top"
        id="in"
        style={{ background: "#9CA3AF", width: 10, height: 10 }}
      />

      {/* Header */}
      <div className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
        Choose first step 👇
      </div>

      {/* Content Category */}
      <div className="mb-4">
        <div className="text-xs text-gray-600 dark:text-gray-400 uppercase font-medium">
          Content
        </div>
        {[
          { label: "Messenger", color: "#0084FF" },
        ].map(({ label, color }) => (
          <button
            key={label}
            onClick={() => handlePick(label)}
            className="
              w-full flex items-center space-x-2 px-3 py-2 mt-1
              bg-white dark:bg-gray-700
              border border-gray-300 dark:border-gray-600
              rounded-md hover:bg-gray-100 dark:hover:bg-gray-600
              transition
            "
          >
            {label === "Messenger" ? (
              <div
                className="h-5 w-5 flex-shrink-0 rounded-full flex items-center justify-center bg-[#0084FF]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-white"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 4.418 2.86 8.166 6.844 9.5L12 22l3.156-.5C19.14 20.16 22 16.418 22 12c0-5.52-4.48-10-10-10zm4.825 7.2l-1.9 9.07c-.143.61-.52.76-1.05.47l-2.9-2.14-1.4 1.35c-.155.155-.285.285-.585.285l.21-3.03 6.52-4.96c.24-.21-.05-.33-.37-.12l-6.82 4.28-2.94-.92c-.64-.195-.65-.64.13-.95l11.66-4.47c.56-.21 1.06.15.88 1.01Z" />
                </svg>
              </div>
            ) : label === "Instagram" ? (
              <div
                className="h-5 w-5 flex-shrink-0 rounded-full flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(45deg, #F58529 0%, #DD2A7B 50%, #8134AF 75%, #515BD4 100%)",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-white"
                  viewBox="0 0 24 24"
                >
                  <path d="M7.75 2C5.4 2 3.18 3.4 2 5.75v12.5C3.18 20.6 5.4 22 7.75 22h8.5c2.35 0 4.57-1.4 5.75-3.75V5.75C20.6 3.4 18.4 2 16.25 2h-8.5ZM12 7.2a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6Zm5.3-.25a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z" />
                </svg>
              </div>
            ) : label === "Telegram" ? (
              <div
                className="h-5 w-5 flex-shrink-0 rounded-full flex items-center justify-center bg-[#37AEE2]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-white"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 4.418 2.86 8.166 6.844 9.5L12 22l3.156-.5C19.14 20.16 22 16.418 22 12c0-5.52-4.48-10-10-10Zm4.825 7.2l-1.9 9.07c-.143.61-.52.76-1.05.47l-2.9-2.14-1.4 1.35c-.155.155-.285.285-.585.285l.21-3.03 6.52-4.96c.24-.21-.05-.33-.37-.12l-6.82 4.28-2.94-.92c-.64-.195-.65-.64.13-.95l11.66-4.47c.56-.21 1.06.15.88 1.01Z" />
                </svg>
              </div>
            ) : label === "SMS" ? (
              <div
                className="h-5 w-5 flex-shrink-0 rounded-full flex items-center justify-center bg-[#34D399]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-white"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 2H4C2.897 2 2 2.897 2 4v16l4-4h14c1.103 0 2-.897 2-2V4C22 2.897 21.103 2 20 2z" />
                </svg>
              </div>
            ) : (
              <div
                className="h-5 w-5 flex-shrink-0 rounded-full flex items-center justify-center bg-[#8B5CF6]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 text-white"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4H4C2.897 4 2 4.897 2 6v12c0 1.103.897 2 2 2h16c1.103 0 2-0.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 5.333-8-5.333V6h16zM4 18V8.489l8 5.333 8-5.333V18H4z" />
                </svg>
              </div>
            )}
            <span className="text-sm text-gray-800 dark:text-gray-200">{label}</span>
          </button>
        ))}
      </div>

      {/* AI Category */}
     <div className="mb-4">
        <div className="text-xs text-gray-600 dark:text-gray-400 uppercase font-medium">
          AI Steps
        </div>
       {[
    { label: "ChatGPT", icon: "🤖", bg: "#6366F1" },
    { label: "Cloude AI", icon: "☁️", bg: "#10B981" },
  ].map(({ label, icon, bg }) => (
    <button
      key={label}
      onClick={() => data.onSelectAI(label, id)}
      className="
        w-full flex items-center space-x-2 px-3 py-2 mt-1
        bg-white dark:bg-gray-700
        border border-gray-300 dark:border-gray-600
        rounded-md hover:bg-gray-100 dark:hover:bg-gray-600
        transition
      "
    >
      <span
        className="h-5 w-5 flex items-center justify-center rounded-full text-white text-xs"
        style={{ background: bg }}
      >
        {icon}
      </span>
      <span className="text-sm text-gray-800 dark:text-gray-200">
        {label}
      </span>
    </button>
  ))}
</div>




    </div>
  );
});

//
// ─── FacebookMessageNode ────────────────────────────────────────────────────
// A blue‐bordered “Send Message” for Messenger, with brand‐colored icon,
// dashed “Add a text” area, and a bare circle handle on the right.
//
const FacebookMessageNode = React.memo(function FacebookMessageNode({ id, data, selected }) {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef(null);
  const nodeRef = useRef(null);

  // Resize tracking
  const isResizingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startWRef = useRef(data.width);
  const startHRef = useRef(data.height);

  // const onResizeMouseDown = (e) => {
  //   e.stopPropagation();
  //   isResizingRef.current = true;
  //   startXRef.current = e.clientX;
  //   startYRef.current = e.clientY;
  //   startWRef.current = data.width;
  //   startHRef.current = data.height;
  //   window.addEventListener("mousemove", onMouseMove);
  //   window.addEventListener("mouseup", onMouseUp);
  // };

  const onMouseMove = (e) => {
    if (!isResizingRef.current) return;
    const dx = e.clientX - startXRef.current;
    const dy = e.clientY - startYRef.current;
    const newW = Math.max(200, startWRef.current + dx);
    const newH = Math.max(100, startHRef.current + dy);
    data.onResize(id, newW, newH);
  };

  const onMouseUp = () => {
    isResizingRef.current = false;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [data.label, isEditing]);

  const handleContentChange = (e) => {
    data.onChange(id, e.target.value);
  };
  const handleBlur = () => setIsEditing(false);
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsEditing(false);
    }
  };




  return (
    <div
      ref={nodeRef}
      style={{
        width: data.width,
        minHeight: data.height,
        boxSizing: "border-box",
      }}
      className="
        relative
        bg-white dark:bg-gray-800
        border-2 border-[#0084FF]
        rounded-lg
        shadow-md
        p-4
        flex flex-col
        overflow-hidden
        cursor-default
      "
    >
{selected && (
  <button
    onClick={() => data.onDelete(id)}
    className="absolute -top-1% right-3 bg-white p-1 rounded-full shadow hover:bg-red-50 transition"
    title="Delete this node"
  >
  <svg xmlns="http://www.w3.org/2000/svg"
       className="h-4 w-4 text-red-600"
       fill="none"
       viewBox="0 0 24 24"
       stroke="currentColor"
  >
    <path strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-4 0h14"
    />
  </svg>
  </button>
)}


      {/* Top incoming handle */}
      <Handle
        type="target"
        position="top"
        id="in"
        style={{ background: "#0084FF", width: 10, height: 10 }}
      />
      
    {/* Inline “Next Step →” label + handle */}
<div className="absolute bottom-2 right-2 flex items-center space-x-1">
  <span className="text-xs text-gray-700 dark:text-gray-300">
    Next Step 
  </span>
 <Handle
  type="source"
  position="bottom"
  id="out"
  style={{
    position: "static",
    transform: "none",
    marginLeft: 4,
    background: "#34D399",
    width: 10,
    height: 10,
    cursor: "pointer",            // hint that it’s clickable
  }}
  onClick={() => data.onAddTrigger(id)}
/>
</div>


      {/* Header row: circular Messenger icon + “Send Message” */}
      <div className="flex items-center space-x-2 mb-2">
        <div
          className="h-6 w-6 flex-shrink-0 rounded-full flex items-center justify-center bg-[#0084FF]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 text-white"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12c0 4.418 2.86 8.166 6.844 9.5L12 22l3.156-.5C19.14 20.16 22 16.418 22 12c0-5.52-4.48-10-10-10zm4.825 7.2l-1.9 9.07c-.143.61-.52.76-1.05.47l-2.9-2.14-1.4 1.35c-.155.155-.285.285-.585.285l.21-3.03 6.52-4.96c.24-.21-.05-.33-.37-.12l-6.82 4.28-2.94-.92c-.64-.195-.65-.64.13-.95l11.66-4.47c.56-.21 1.06.15.88 1.01Z" />
          </svg>
        </div>
        <span className="text-base font-medium text-gray-800 dark:text-gray-200">
          Messenger
        </span>
      </div>

      {/* Dashed “Add a text” area */}
      <div
        className="
          flex-1
          border-2 border-dashed border-gray-300 dark:border-gray-600
          rounded-lg
          p-2
          flex items-center justify-center
          text-gray-500 dark:text-gray-400
          text-sm
          mb-3
          cursor-text
          overflow-hidden
        "
        onClick={() => setIsEditing(true)}
      >
        {isEditing ? (
          <textarea
            ref={textareaRef}
            className="
              w-full h-full
              bg-transparent text-gray-900 dark:text-gray-100
              text-sm focus:outline-none resize-none overflow-hidden
            "
            value={data.label}
            onChange={handleContentChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            rows={1}
            placeholder="Add a text"
          />
        ) : (
          <span className="whitespace-normal break-words">
            {data.label || "Add a text"}
          </span>
        )}
      </div>

      {/* Right‐side outgoing handle (bare circle) */}
      <div className="absolute right-[-6px] top-1/2 transform -translate-y-1/2">
        <Handle
          type="source"
          position="bottom"
          id="out"
          style={{
            background: "#FFFFFF",
            width: 12,
            height: 12,
            border: "2px solid #0084FF",
            borderRadius: "50%",
          }}
        />
      </div>
    </div>
  );
});


//
// ─── AIModuleNode ───────────────────────────────────────────────────────────
// A generic “AI” block; click to add/edit text. It already has top and right handles.
//
const AIModuleNode = React.memo(function AIModuleNode({ id, data, selected }) {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef(null);
  const nodeRef = useRef(null);

const aiGoal = data.aiGoal || '';
const aiContext = data.aiContext || '';


  // Resize tracking
  const isResizingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startWRef = useRef(data.width);
  const startHRef = useRef(data.height);


  const onMouseMove = (e) => {
    if (!isResizingRef.current) return;
    const dx = e.clientX - startXRef.current;
    const dy = e.clientY - startYRef.current;
    const newW = Math.max(200, startWRef.current + dx);
    const newH = Math.max(100, startHRef.current + dy);
    data.onResize(id, newW, newH);
  };

  const onMouseUp = () => {
    isResizingRef.current = false;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  // Sync local state back to the node data when it changes
 useEffect(() => {
    if (data.onChange) {
      // NOTE: onChange signature: (id, { aiGoal, aiContext }) 
      data.onChange(id, { aiGoal, aiContext });
    }
  }, [aiGoal, aiContext]);


  // Auto-resize textarea on edit
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [data.label, isEditing]);

  const handleContentChange = (e) => data.onChange(id, e.target.value);
  const handleBlur = () => setIsEditing(false);
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsEditing(false);
    }
  };

  // Determine dynamic styling
  const color = data.provider === 'chatgpt' ? '#6366F1' : '#10B981';
  const iconSvg = data.provider === 'chatgpt'
    ? (<span className="h-6 w-6 flex items-center justify-center rounded-full bg-[#6366F1] text-white text-xs">🤖</span>)
    : (<span className="h-6 w-6 flex items-center justify-center rounded-full bg-[#10B981] text-white text-xs">☁️</span>);
  const title = data.provider === 'chatgpt' ? 'ChatGPT' : 'Cloude AI';

  return (
    <div
      ref={nodeRef}
      style={{
        width: data.width || 280,
        height: 'auto',
        boxSizing: 'border-box',
      }}
      className="relative bg-white dark:bg-gray-800 border-2 rounded-lg shadow-md p-4 flex flex-col cursor-default"
    >
      {selected && (
        <button
          onClick={() => data.onDelete(id)}
          className="absolute -top-1% right-3 bg-white p-1 rounded-full shadow hover:bg-red-50 transition"
          title="Delete this node"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3m-4 0h14" />
          </svg>
        </button>
      )}

      {/* Top handle */}
      <Handle
        type="target"
        position="top"
        style={{
          background: data.provider === 'chatgpt' ? '#6366F1' : '#10B981',
          width: 10,
          height: 10,
        }}
      />

      
      {/* Header: icon + title */}
      <div className="flex items-center space-x-2 mb-2">
        {iconSvg}
        <span className="text-base font-medium text-gray-800 dark:text-gray-200">{title}</span>
      </div>

      {/* AI configuration panel */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Tell AI what to do</h3>
                <textarea
          value={aiGoal}
          onChange={e =>
            data.onChange(id, {
              aiGoal: e.target.value,
              aiContext,
            })
          }
        />


        <h3 className="text-lg font-semibold mb-2">Give AI context</h3>
              <textarea
        value={aiContext}
        onChange={e =>
          data.onChange(id, {
            aiGoal,
            aiContext: e.target.value,
          })
        }
      />

       
      </div>

      {/* Inline “Next Step →” label + handle */}
     <div className="absolute bottom-2 right-2 flex items-center space-x-1">
  <span className="text-xs text-gray-700 dark:text-gray-300">
    Next Step 
  </span>
  <Handle
  type="source"
  position="bottom"
  id="out"
  style={{
    position: "static",
    transform: "none",
    marginLeft: 4,
    background: "#34D399",
    width: 10,
    height: 10,
    cursor: "pointer",            // hint that it’s clickable
  }}
  onClick={() => data.onAddTrigger(id)}
/>
</div>
    </div>
  );
});

//
// ─── Register Node Types ─────────────────────────────────────────────────────
const nodeTypes = {
  trigger:  TriggerNode,
  selector: SelectorNode,
  facebook: FacebookMessageNode,
  ai:       AIModuleNode,
};

let idCounter = 1;
function getId() {
  return `node_${idCounter++}`;
}

export default function AutomationFlow() {
  const router = useRouter();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeIds, setSelectedNodeIds] = useState([]);
  const [selectedNode, setSelectedNode]       = useState(null);


  const [openAIConfig, setOpenAIConfig] = useState(null);
// openAIConfig will hold the node id or null


// Opens the AI-config panel
const handleOpenAIConfig = useCallback((nodeId) => {
  setOpenAIConfig(nodeId);
}, []);



  // ────── DELETE A SINGLE NODE ───────────────────────────────────────────────
 const deleteNode = useCallback((nodeId) => {
   // remove the node
  setNodes((nds) => nds.filter((n) => n.id !== nodeId));
   // remove any edges connected to it
  setEdges((eds) =>
    eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
   );
 }, [setNodes, setEdges]);

const handleLabelChange = useCallback((id, value) => {
  setNodes((nds) => {
    const newNodes = nds.map((n) => {
      if (n.id === id) {
        return {
          ...n,
          data: {
            ...n.data,
            ...(typeof value === 'string'
              ? { label: value }
              : value),
            onChange: handleLabelChange,
          },
        };
      }
      return n;
    });

    // Update the sidebar if that node is open
    if (selectedNode?.id === id) {
      const updatedNode = newNodes.find((n) => n.id === id);
      setSelectedNode(updatedNode);
    }

    return newNodes;
  });
}, [setNodes, selectedNode, setSelectedNode]);


  
  // Called when any node is clicked
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const handleResize = useCallback((id, newW, newH) => {
    setNodes((nds) =>
      nds.map((n) =>
        n.id === id
          ? {
              ...n,
              data: {
                ...n.data,
                width: newW,
                height: newH,
                onResize: handleResize,
                onDelete: deleteNode,
                onAddTrigger: n.type === "trigger" ? spawnSelector : n.data.onAddTrigger,
              },
            }
          : n
      )
    );
  }, [setNodes]);

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  const spawnSelector = useCallback((triggerId) => {
    setNodes((nds) => {
      const triggerNode = nds.find((n) => n.id === triggerId);
      if (!triggerNode) return nds;
      const newSelectorId = getId();
      const newSelector = {
        id: newSelectorId,
        type: "selector",
        data: {
      width: 200, height: 300,
      onSelect: choiceLabel => spawnBranchNode(choiceLabel, newSelectorId),
      onSelectAI: (aiLabel, selectorId) => spawnBranchNode(aiLabel, selectorId),
      onDelete: deleteNode,
      onOpenAI: handleOpenAIConfig,
    },
        position: { x: triggerNode.position.x + triggerNode.data.width + 50, y: triggerNode.position.y },
      };
      setEdges((prev) =>
        addEdge({ id: `edge_${triggerId}_${newSelectorId}`, source: triggerId, sourceHandle: "out", target: newSelectorId, targetHandle: "in", type: "smoothstep" }, prev)
      );
      return [...nds, newSelector];
    });
  }, [setNodes, setEdges]);

  const spawnBranchNode = useCallback((label, parentId) => {
  setNodes((nds) => {
    const parent = nds.find(n => n.id === parentId);
    const newId = getId();
 let nodeType = "ai", provider = label.toLowerCase().replace(" ", "");
    switch (label) {
      case "Messenger":
        nodeType = "facebook";
        provider = null;
        break;
      case "ChatGPT":
      case "Cloude AI":
        nodeType = "ai"; // reuse AIModuleNode
        break;
      default:
        nodeType = "ai";
      }
   
    const newNode = {
      id: newId,
      type: nodeType,
      data: {
        width: 300,
        height: 180,
        label: "",
        provider,               // <-- tell the node which AI provider
        onOpenAI: handleOpenAIConfig,
        onResize: handleResize,
        onChange: handleLabelChange,
        onDelete: deleteNode,
        onAddTrigger: spawnSelector, 
      },
      position: {
        x: parent.position.x + parent.data.width + 50,
        y: parent.position.y,
      },
    };

    // connect parent → newNode
    setEdges(edg => addEdge({
      id: `edge_${parentId}_${newId}`,
      source: parentId,
      sourceHandle: "out",
      target: newId,
      targetHandle: "in",
      type: "smoothstep",
    }, edg));

    return [...nds, newNode];
  });
}, [setNodes, setEdges, handleResize, handleLabelChange, deleteNode, handleOpenAIConfig]);

   return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-1/4 p-6 bg-white dark:bg-gray-800 border-r dark:border-gray-700 overflow-y-auto">
          {selectedNode ? (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Node Settings</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Type: {selectedNode.type}</p>
              {selectedNode.type === 'facebook' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message Text</label>
                  <textarea
                    className="w-full p-2 border rounded mb-4"
                    rows={3}
                    value={selectedNode.data.label || ''}
                    onChange={e => handleLabelChange(selectedNode.id, e.target.value)}
                  />
                </div>
              )}
                      {selectedNode.type === 'ai' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  AI Goal
                </label>
                <textarea
                  className="w-full p-2 border rounded mb-3"
                  rows={2}
                  value={selectedNode.data.aiGoal || ''}
                  onChange={(e) => {
                    const updated = {
                      aiGoal: e.target.value,
                      aiContext: selectedNode.data.aiContext,
                    };
                    handleLabelChange(selectedNode.id, updated);
                  }}
                />

                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  AI Context
                </label>
                <textarea
                  className="w-full p-2 border rounded mb-4"
                  rows={3}
                  value={selectedNode.data.aiContext || ''}
                  onChange={(e) => {
                    const updated = {
                      aiGoal: selectedNode.data.aiGoal,
                      aiContext: e.target.value,
                    };
                    handleLabelChange(selectedNode.id, updated);
                  }}
                />
              </div>
            )}

              <button
                onClick={() => setSelectedNode(null)}
                className="mt-4 text-sm text-red-600 hover:underline"
              >
                Close
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">✨Automation Builder</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Click “New Trigger” below to add your first trigger, or select a node to edit.</p>
              <button
                onClick={() => {
                  const newId = getId();
                  setNodes(nds => [
                    ...nds,
                    {
                      id: newId,
                      type: "trigger",
                      data: {
                        width: 300,
                        height: 160,
                        onOpenAI: handleOpenAIConfig,
                        onResize: handleResize,
                        onAddTrigger: spawnSelector,
                        onDelete: deleteNode,
                      },
                      position: { x: 200, y: 20 + nds.length * 200 },
                    },
                  ]);
                }}
                className="w-full text-center px-3 py-2 border-2 border-dashed border-green-400 rounded-lg text-green-600 font-semibold hover:bg-green-50 dark:hover:bg-gray-700 transition"
              >
                + New Trigger
              </button>
            </div>
          )}
        </aside>
        <div className="flex-1 relative">
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
               onSelectionChange={(elements) => {
        const selected = elements?.nodes?.map((n) => n.id) || [];
        setSelectedNodeIds(selected);
      }}
          >
           <Controls />
            <Background variant="dots" gap={24} size={1} color="#d1d5db" />
            </ReactFlow>
        </div>
      </div>
    </div>
  );
}

