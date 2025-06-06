// File: components/AutomationContent.jsx

import React, { useCallback, useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  Handle,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

//
// ─── TriggerNode ────────────────────────────────────────────────────────────
// A green‐bordered box with header “⚡ When…”, description text, a dashed “+ New Trigger”
// area, and a right‐side outgoing handle labeled “Next Step →”.
//
const TriggerNode = React.memo(
  function TriggerNode({ id, data }) {
    const nodeRef = useRef(null);

    // Resize tracking
    const isResizingRef = useRef(false);
    const startXRef = useRef(0);
    const startYRef = useRef(0);
    const startWRef = useRef(data.width);
    const startHRef = useRef(data.height);

    // Begin resize
    const onResizeMouseDown = (e) => {
      e.stopPropagation();
      isResizingRef.current = true;
      startXRef.current = e.clientX;
      startYRef.current = e.clientY;
      startWRef.current = data.width;
      startHRef.current = data.height;
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    };

    // During resize
    const onMouseMove = (e) => {
      if (!isResizingRef.current) return;
      const dx = e.clientX - startXRef.current;
      const dy = e.clientY - startYRef.current;
      const newW = Math.max(200, startWRef.current + dx);
      const newH = Math.max(120, startHRef.current + dy);
      data.onResize(id, newW, newH);
    };

    // End resize
    const onMouseUp = () => {
      isResizingRef.current = false;
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
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
          border-2 border-green-400
          rounded-lg
          shadow-md
          p-4
          flex flex-col
          overflow-hidden
        "
      >
        {/* Top handle (incoming) */}
        <Handle
          type="target"
          position="top"
          id="in"
          style={{ background: "#34D399", width: 10, height: 10 }}
        />

        {/* Header row: ⚡ When… */}
        <div className="flex items-center mb-2">
          <span className="text-2xl text-green-500 mr-2">⚡</span>
          <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            When…
          </span>
        </div>

        {/* Description text */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-snug">
          A Trigger is an event that starts your Automation. Click to add a Trigger.
        </p>

        {/* Dashed “+ New Trigger” box */}
        <div className="flex-1">
          <button
            onClick={() => data.onAddTrigger && data.onAddTrigger(id)}
            className="
              w-full h-10
              border-2 border-dashed border-blue-400
              rounded-lg
              flex items-center justify-center
              text-blue-600 font-semibold text-sm
              hover:bg-blue-50 dark:hover:bg-gray-700
              transition
            "
          >
            + New Trigger
          </button>
        </div>

        {/* Right‐side “Next Step →” handle */}
        <div className="absolute right-[-5px] top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          <Handle
            type="source"
            position="right"
            id="out"
            style={{ background: "#34D399", width: 10, height: 10 }}
          />
          <span className="text-xs text-gray-700 dark:text-gray-300">Next Step →</span>
        </div>

        {/* Resize handle (tiny green square) */}
        <div
          onMouseDown={onResizeMouseDown}
          className="absolute bottom-2 right-2 w-3 h-3 bg-green-400 cursor-se-resize rounded-sm"
          title="Drag to resize"
        />
      </div>
    );
  },
  (prev, next) =>
    prev.data.width === next.data.width && prev.data.height === next.data.height
);

//
// ─── SelectorNode ──────────────────────────────────────────────────────────
// A dashed‐border panel listing all possible “first steps.” Clicking one calls data.onSelect(label).
// Has a top (incoming) handle and a right (outgoing) handle.
//
const SelectorNode = React.memo(function SelectorNode({ id, data }) {
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
          { label: "Instagram", color: "#E4405F" },
          { label: "Telegram", color: "#37AEE2" },
          { label: "SMS", color: "#34D399" },
          { label: "Email", color: "#8B5CF6" },
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
          AI
        </div>
        <button
          onClick={() => handlePick("AI Step")}
          className="
            w-full flex items-center space-x-2 px-3 py-2 mt-1
            bg-white dark:bg-gray-700
            border border-gray-300 dark:border-gray-600
            rounded-md hover:bg-gray-100 dark:hover:bg-gray-600
            transition
          "
        >
          <span className="h-5 w-5 flex items-center justify-center rounded-full bg-[#6366F1] text-white text-xs">
            🤖
          </span>
          <span className="text-sm text-gray-800 dark:text-gray-200">AI Step</span>
        </button>
      </div>

      {/* Logic Category */}
      <div>
        <div className="text-xs text-gray-600 dark:text-gray-400 uppercase font-medium">
          Logic
        </div>
        {[
          { label: "Actions", color: "#F59E0B", icon: "⚡" },
          { label: "Condition", color: "#06B6D4", icon: "⏱" },
          { label: "Randomizer", color: "#A78BFA", icon: "🔀" },
          { label: "Smart Delay", color: "#EF4444", icon: "⏳" },
        ].map(({ label, color, icon }) => (
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
            <span
              className="h-5 w-5 flex items-center justify-center rounded-full text-white text-xs"
              style={{ backgroundColor: color }}
            >
              {icon}
            </span>
            <span className="text-sm text-gray-800 dark:text-gray-200">{label}</span>
          </button>
        ))}
      </div>

      {/* The right‐side outgoing handle for chaining */}
      <Handle
        type="source"
        position="right"
        id="out"
        style={{ background: "#9CA3AF", width: 10, height: 10 }}
      />
    </div>
  );
});

//
// ─── FacebookMessageNode ────────────────────────────────────────────────────
// A blue‐bordered “Send Message” for Messenger, with brand‐colored icon,
// dashed “Add a text” area, and a bare circle handle on the right.
//
const FacebookMessageNode = React.memo(function FacebookMessageNode({ id, data }) {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef(null);
  const nodeRef = useRef(null);

  // Resize tracking
  const isResizingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startWRef = useRef(data.width);
  const startHRef = useRef(data.height);

  const onResizeMouseDown = (e) => {
    e.stopPropagation();
    isResizingRef.current = true;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    startWRef.current = data.width;
    startHRef.current = data.height;
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

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
      {/* Top incoming handle */}
      <Handle
        type="target"
        position="top"
        id="in"
        style={{ background: "#0084FF", width: 10, height: 10 }}
      />

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
          Send Message
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
          position="right"
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

      {/* Resize handle */}
      <div
        onMouseDown={onResizeMouseDown}
        className="absolute bottom-2 right-2 w-3 h-3 bg-green-400 cursor-se-resize rounded-sm"
        title="Drag to resize"
      />
    </div>
  );
});

//
// ─── InstagramMessageNode ───────────────────────────────────────────────────
// A pink‐bordered “Send Message” for Instagram, with gradient icon,
// dashed “Add a text” area, and a bare circle handle on the right.
//
const InstagramMessageNode = React.memo(function InstagramMessageNode({ id, data }) {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef(null);
  const nodeRef = useRef(null);

  // Resize tracking
  const isResizingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startWRef = useRef(data.width);
  const startHRef = useRef(data.height);

  const onResizeMouseDown = (e) => {
    e.stopPropagation();
    isResizingRef.current = true;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    startWRef.current = data.width;
    startHRef.current = data.height;
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

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
        border-2 border-pink-500
        rounded-lg
        shadow-md
        p-4
        flex flex-col
        overflow-hidden
        cursor-default
      "
    >
      {/* Top incoming handle */}
      <Handle
        type="target"
        position="top"
        id="in"
        style={{ background: "#E4405F", width: 10, height: 10 }}
      />

      {/* Header row: Instagram gradient circle + “Send Message” */}
      <div className="flex items-center space-x-2 mb-2">
        <div
          className="h-6 w-6 flex-shrink-0 rounded-full flex items-center justify-center"
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
            <path d="M7.75 2C5.402 2 3.182 3.402 2 5.75v12.5C3.182 20.598 5.402 22 7.75 22h8.5c2.348 0 4.568-1.402 5.75-3.75V5.75C20.568 3.402 18.348 2 15.999 2h-8.25Zm4.249 3.2a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6Zm5.3-0.25a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z" />
          </svg>
        </div>
        <span className="text-base font-medium text-gray-800 dark:text-gray-200">
          Send Message
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
          position="right"
          id="out"
          style={{
            background: "#FFFFFF",
            width: 12,
            height: 12,
            border: "2px solid #E4405F",
            borderRadius: "50%",
          }}
        />
      </div>

      {/* Resize handle */}
      <div
        onMouseDown={onResizeMouseDown}
        className="absolute bottom-2 right-2 w-3 h-3 bg-green-400 cursor-se-resize rounded-sm"
        title="Drag to resize"
      />
    </div>
  );
});

//
// ─── TelegramMessageNode ───────────────────────────────────────────────────
// A light–blue bordered “Send Message” for Telegram, with brand icon,
// dashed “Add a text” area, and a bare circle handle on the right.
//
const TelegramMessageNode = React.memo(function TelegramMessageNode({ id, data }) {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef(null);
  const nodeRef = useRef(null);

  // Resize tracking
  const isResizingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startWRef = useRef(data.width);
  const startHRef = useRef(data.height);

  const onResizeMouseDown = (e) => {
    e.stopPropagation();
    isResizingRef.current = true;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    startWRef.current = data.width;
    startHRef.current = data.height;
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

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
        border-2 border-[#37AEE2]
        rounded-lg
        shadow-md
        p-4
        flex flex-col
        overflow-hidden
        cursor-default
      "
    >
      {/* Top incoming handle */}
      <Handle
        type="target"
        position="top"
        id="in"
        style={{ background: "#37AEE2", width: 10, height: 10 }}
      />

      {/* Header row: Telegram circle + “Send Message” */}
      <div className="flex items-center space-x-2 mb-2">
        <div className="h-6 w-6 flex-shrink-0 rounded-full flex items-center justify-center bg-[#37AEE2]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 text-white"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12c0 4.418 2.86 8.166 6.844 9.5L12 22l3.156-.5C19.14 20.16 22 16.418 22 12c0-5.52-4.48-10-10-10Zm4.825 7.2l-1.9 9.07c-.143.61-.52.76-1.05.47l-2.9-2.14-1.4 1.35c-.155.155-.285.285-.585.285l.21-3.03 6.52-4.96c.24-.21-.05-.33-.37-.12l-6.82 4.28-2.94-.92c-.64-.195-.65-.64.13-.95l11.66-4.47c.56-.21 1.06.15.88 1.01Z" />
          </svg>
        </div>
        <span className="text-base font-medium text-gray-800 dark:text-gray-200">
          Send Message
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
          position="right"
          id="out"
          style={{
            background: "#FFFFFF",
            width: 12,
            height: 12,
            border: "2px solid #37AEE2",
            borderRadius: "50%",
          }}
        />
      </div>

      {/* Resize handle */}
      <div
        onMouseDown={onResizeMouseDown}
        className="absolute bottom-2 right-2 w-3 h-3 bg-green-400 cursor-se-resize rounded-sm"
        title="Drag to resize"
      />
    </div>
  );
});

//
// ─── SMSMessageNode ────────────────────────────────────────────────────────
// A green‐bordered “Send Message” for SMS, with brand icon,
// dashed “Add a text” area, and a bare circle handle on the right.
//
const SMSMessageNode = React.memo(function SMSMessageNode({ id, data }) {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef(null);
  const nodeRef = useRef(null);

  // Resize tracking
  const isResizingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startWRef = useRef(data.width);
  const startHRef = useRef(data.height);

  const onResizeMouseDown = (e) => {
    e.stopPropagation();
    isResizingRef.current = true;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    startWRef.current = data.width;
    startHRef.current = data.height;
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

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
        border-2 border-[#34D399]
        rounded-lg
        shadow-md
        p-4
        flex flex-col
        overflow-hidden
        cursor-default
      "
    >
      {/* Top incoming handle */}
      <Handle
        type="target"
        position="top"
        id="in"
        style={{ background: "#34D399", width: 10, height: 10 }}
      />

      {/* Header row: SMS circle + “Send Message” */}
      <div className="flex items-center space-x-2 mb-2">
        <div className="h-6 w-6 flex-shrink-0 rounded-full flex items-center justify-center bg-[#34D399]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 text-white"
            viewBox="0 0 24 24"
          >
            <path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1v3.5c0 .55-.45 1-1 1C9.16 21.5 2.5 14.84 2.5 6c0-.55.45-1 1-1H7c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
        </div>
        <span className="text-base font-medium text-gray-800 dark:text-gray-200">
          Send Message
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
          position="right"
          id="out"
          style={{
            background: "#FFFFFF",
            width: 12,
            height: 12,
            border: "2px solid #34D399",
            borderRadius: "50%",
          }}
        />
      </div>

      {/* Resize handle */}
      <div
        onMouseDown={onResizeMouseDown}
        className="absolute bottom-2 right-2 w-3 h-3 bg-green-400 cursor-se-resize rounded-sm"
        title="Drag to resize"
      />
    </div>
  );
});

//
// ─── EmailMessageNode ───────────────────────────────────────────────────────
// A purple‐bordered “Send Message” for Email, with brand icon,
// dashed “Add a text” area, and a bare circle handle on the right.
//
const EmailMessageNode = React.memo(function EmailMessageNode({ id, data }) {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef(null);
  const nodeRef = useRef(null);

  // Resize tracking
  const isResizingRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startWRef = useRef(data.width);
  const startHRef = useRef(data.height);

  const onResizeMouseDown = (e) => {
    e.stopPropagation();
    isResizingRef.current = true;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    startWRef.current = data.width;
    startHRef.current = data.height;
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

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
        border-2 border-[#8B5CF6]
        rounded-lg
        shadow-md
        p-4
        flex flex-col
        overflow-hidden
        cursor-default
      "
    >
      {/* Top incoming handle */}
      <Handle
        type="target"
        position="top"
        id="in"
        style={{ background: "#8B5CF6", width: 10, height: 10 }}
      />

      {/* Header row: Email circle + “Send Message” */}
      <div className="flex items-center space-x-2 mb-2">
        <div className="h-6 w-6 flex-shrink-0 rounded-full flex items-center justify-center bg-[#8B5CF6]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 text-white"
            viewBox="0 0 24 24"
          >
            <path d="M20 4H4C2.897 4 2 4.897 2 6v12c0 1.103.897 2 2 2h16c1.103 0 2-0.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 5.333-8-5.333V6h16zM4 18V8.489l8 5.333 8-5.333V18H4z" />
          </svg>
        </div>
        <span className="text-base font-medium text-gray-800 dark:text-gray-200">
          Send Message
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
          position="right"
          id="out"
          style={{
            background: "#FFFFFF",
            width: 12,
            height: 12,
            border: "2px solid #8B5CF6",
            borderRadius: "50%",
          }}
        />
      </div>

      {/* Resize handle */}
      <div
        onMouseDown={onResizeMouseDown}
        className="absolute bottom-2 right-2 w-3 h-3 bg-green-400 cursor-se-resize rounded-sm"
        title="Drag to resize"
      />
    </div>
  );
});

//
// ─── AIModuleNode ───────────────────────────────────────────────────────────
// A generic “AI” block; click to add/edit text. It already has top and right handles.
//
const AIModuleNode = React.memo(function AIModuleNode({ id, data }) {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef(null);

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

  const handleChange = (e) => data.onChange(id, e.target.value);
  const handleBlur = () => setIsEditing(false);
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setIsEditing(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      className="
        relative
        bg-white dark:bg-gray-800
        border border-gray-300 dark:border-gray-600
        rounded-lg
        shadow-sm p-3
        hover:shadow-md transition
        cursor-text
      "
      style={{ minWidth: 200, minHeight: 80 }}
    >
      {/* Top handle (incoming) */}
      <Handle
        type="target"
        position="top"
        id="in"
        style={{ background: "#6366F1", width: 10, height: 10 }}
      />
      {isEditing ? (
        <textarea
          ref={textareaRef}
          onMouseDown={(e) => e.stopPropagation()}
          className="
            w-full h-full
            bg-transparent text-gray-900 dark:text-gray-100
            text-sm focus:outline-none resize-none overflow-hidden
          "
          value={data.label}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Click to add message"
        />
      ) : (
        <div className="min-h-[20px] text-gray-900 dark:text-gray-100 text-sm whitespace-normal break-words">
          {data.label || (
            <span className="text-gray-400 dark:text-gray-500 italic">
              Click to add message
            </span>
          )}
        </div>
      )}
      {/* Right handle (outgoing) */}
      <div className="absolute right-[-5px] top-1/2 transform -translate-y-1/2">
        <Handle
          type="source"
          position="right"
          id="out"
          style={{ background: "#6366F1", width: 10, height: 10 }}
        />
      </div>
    </div>
  );
}); // ← React.memo is now properly closed


//
// ─── Register Node Types ─────────────────────────────────────────────────────
const nodeTypes = {
  trigger: TriggerNode,
  selector: SelectorNode,
  facebook: FacebookMessageNode,
  instagram: InstagramMessageNode,
  telegram: TelegramMessageNode,
  sms: SMSMessageNode,
  email: EmailMessageNode,
  ai: AIModuleNode,
};

let idCounter = 1;
function getId() {
  return `node_${idCounter++}`;
}

//
// ─── Main Component: AutomationFlow ─────────────────────────────────────────
export default function AutomationFlow() {
  const router = useRouter();

  // Start with an empty canvas:
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeIds, setSelectedNodeIds] = useState([]);

  // Handler for editing any node’s text field:
  const handleLabelChange = useCallback(
    (id, value) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === id
            ? {
                ...n,
                data: {
                  ...n.data,
                  label: value,
                  onChange: handleLabelChange,
                },
              }
            : n
        )
      );
    },
    [setNodes]
  );

  // Resize callback (for both Trigger and message nodes):
  const handleResize = useCallback(
    (id, newW, newH) => {
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
                  onAddTrigger: n.type === "trigger" ? spawnSelector : n.data.onAddTrigger,
                },
              }
            : n
        )
      );
    },
    [setNodes]
  );

  // Called whenever you draw a connection by hand:
  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  //
  // ─── spawnSelector ──────────────────────────────────────────────────────────
  // When a Trigger node’s “+ New Trigger” is clicked, create a Selector node
  // directly to the right of it AND immediately connect them with an edge
  // (from Trigger’s right handle → Selector’s top handle).
  //
  const spawnSelector = useCallback(
    (triggerId) => {
      setNodes((nds) => {
        const triggerNode = nds.find((n) => n.id === triggerId);
        if (!triggerNode) return nds;

        // 1) Create the new Selector node to the right of the Trigger:
        const newSelectorId = getId();
        const newSelector = {
          id: newSelectorId,
          type: "selector",
          data: {
            width: 200,
            height: 300,
            onSelect: (choiceLabel) => spawnBranchNode(choiceLabel, newSelectorId),
          },
          position: {
            x: triggerNode.position.x + triggerNode.data.width + 50,
            y: triggerNode.position.y,
          },
        };

        // 2) Immediately add an edge from the Trigger → Selector:
        setEdges((prevEdges) =>
          addEdge(
            {
              id: `edge_${triggerId}_${newSelectorId}`,
              source: triggerId,
              sourceHandle: "out",
              target: newSelectorId,
              targetHandle: "in",
              type: "smoothstep",
            },
            prevEdges
          )
        );

        return [...nds, newSelector];
      });
    },
    [setNodes, setEdges]
  );

  //
  // ─── spawnBranchNode ────────────────────────────────────────────────────────
  // Depending on the user’s choice (Messenger/Instagram/…), spawn the appropriate
  // message-node and place it to the right of the Selector.
  //
  const spawnBranchNode = useCallback(
    (label, selectorId) => {
      setNodes((nds) => {
        const selector = nds.find((n) => n.id === selectorId);
        const newId = getId();
        let nodeType = "ai";
        let width = 300;
        let height = 180;

        switch (label) {
          case "Messenger":
            nodeType = "facebook";
            break;
          case "Instagram":
            nodeType = "instagram";
            break;
          case "Telegram":
            nodeType = "telegram";
            break;
          case "SMS":
            nodeType = "sms";
            break;
          case "Email":
            nodeType = "email";
            break;
          default:
            nodeType = "ai";
            break;
        }

        const newNode = {
          id: newId,
          type: nodeType,
          data: {
            width,
            height,
            label: "",
            onResize: handleResize,
            onChange: handleLabelChange,
          },
          position: {
            x: selector ? selector.position.x + selector.data.width + 50 : 600,
            y: selector ? selector.position.y : 100,
          },
        };
        return [...nds, newNode];
      });
    },
    [setNodes, handleResize, handleLabelChange]
  );

  // Delete all currently selected nodes (and their connecting edges):
  const deleteSelectedNodes = () => {
    if (selectedNodeIds.length === 0) return;
    setNodes((nds) => nds.filter((n) => !selectedNodeIds.includes(n.id)));
    setEdges((eds) =>
      eds.filter(
        (e) =>
          !selectedNodeIds.includes(e.source) && !selectedNodeIds.includes(e.target)
      )
    );
    setSelectedNodeIds([]);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Top bar with Back button */}
      <div className="p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow"
        >
          ← Back
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-1/4 p-6 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col space-y-6 overflow-y-auto">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            ✨ Automation Builder
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Click “+ New Trigger” below to add your first trigger.
          </p>

          {/* + New Trigger (in Sidebar) */}
          <div className="space-y-2">
            <div className="font-medium text-gray-700 dark:text-gray-300">When…</div>
            <button
              onClick={() => {
                const newId = getId();
                setNodes((nds) => [
                  ...nds,
                  {
                    id: newId,
                    type: "trigger",
                    data: {
                      width: 300,
                      height: 160,
                      onResize: handleResize,
                      onAddTrigger: spawnSelector,
                    },
                    position: { x: 200, y: 20 + nds.length * 200 },
                  },
                ]);
              }}
              className="
                w-full text-center
                px-3 py-2
                border-2 border-dashed border-green-400
                rounded-lg text-green-600 font-semibold
                hover:bg-green-50 dark:hover:bg-gray-700
                transition
              "
            >
              + New Trigger
            </button>
          </div>

          {/* Delete Selected Nodes */}
          <button
            onClick={deleteSelectedNodes}
            disabled={selectedNodeIds.length === 0}
            className="
              mt-auto bg-red-600 text-white font-semibold
              py-2 px-4 rounded-lg hover:bg-red-700
              transition disabled:opacity-50
            "
          >
            🗑 Delete Selected Node{selectedNodeIds.length > 1 ? "s" : ""}
          </button>
        </aside>

        {/* Canvas Area */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onSelectionChange={({ nodes: selNodes }) => {
              setSelectedNodeIds(selNodes.map((n) => n.id));
            }}
            fitView
          >
            <MiniMap
              nodeColor={(node) => {
                if (node.type === "trigger") return "#34D399";
                if (node.type === "selector") return "#9CA3AF";
                if (node.type === "facebook") return "#0084FF";
                if (node.type === "instagram") return "#E4405F";
                if (node.type === "telegram") return "#37AEE2";
                if (node.type === "sms") return "#34D399";
                if (node.type === "email") return "#8B5CF6";
                return "#6366F1"; // AI and others
              }}
            />
            <Controls />
            <Background variant="dots" gap={24} size={1} color="#d1d5db" />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
