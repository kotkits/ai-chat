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
// A green‐bordered box with a description and a “+ New Trigger” button.
// Clicking that button calls data.onAddTrigger(id) to spawn a Selector next to it.
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

    // Start resize
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
          flex flex-col justify-center items-center text-center
          overflow-hidden
          cursor-default
        "
      >
        {/* Top handle (incoming) */}
        <Handle
          type="target"
          position="top"
          id="a"
          style={{ background: "#34D399", width: 10, height: 10 }}
        />

        {/* Description */}
        <div className="w-full mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-snug break-words">
            A Trigger is an event that starts your Automation. Click to add a Trigger.
          </p>
        </div>

        {/* + New Trigger button */}
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

        {/* Bottom handle (outgoing) */}
        <Handle
          type="source"
          position="bottom"
          id="b"
          style={{ background: "#34D399", width: 10, height: 10, bottom: "-5px" }}
        />

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
      <div className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
        Choose first step 👇
      </div>

      {/* Content Category */}
      <div className="mb-4">
        <div className="text-xs text-gray-600 dark:text-gray-400 uppercase font-medium">
          Content
        </div>
        {["Messenger", "Instagram", "Telegram", "SMS", "Email"].map((label) => (
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
            {/* SVG icons with brand colors */}
            <span className="flex-shrink-0">
              {label === "Messenger" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="#0084FF" // Messenger blue
                  viewBox="0 0 24 24"
                >
                  <path d="M12.002 2.002C6.475 2.002 2 6.478 2 12.006c0 2.487.951 4.768 2.504 6.502L4 22l3.51-1.888A9.966 9.966 0 0 0 12.002 22c5.528 0 10-4.476 10-9.994 0-5.528-4.472-9.994-9.998-9.994Zm-1.174 13.318l-2.257-2.421-4.672 2.393 5.146-5.574 2.257 2.421 4.672-2.393-5.146 5.574Z" />
                </svg>
              )}
              {label === "Instagram" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="#E4405F" // Instagram pink
                  viewBox="0 0 24 24"
                >
                  <path d="M7.75 2C5.4 2 3.18 3.4 2 5.75v12.5C3.18 20.6 5.4 22 7.75 22h8.5c2.35 0 4.57-1.4 5.75-3.75V5.75C20.6 3.4 18.4 2 16.25 2h-8.5ZM12 7.2a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6Zm5.3-.25a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z" />
                </svg>
              )}
              {label === "Telegram" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="#37AEE2" // Telegram blue
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 4.418 2.86 8.166 6.844 9.5L12 22l3.156-.5C19.14 20.16 22 16.418 22 12c0-5.52-4.48-10-10-10Zm4.825 7.2l-1.9 9.07c-.143.61-.52.76-1.05.47l-2.9-2.14-1.4 1.35c-.155.155-.285.285-.585.285l.21-3.03 6.52-4.96c.24-.21-.05-.33-.37-.12l-6.82 4.28-2.94-.92c-.64-.195-.65-.64.13-.95l11.66-4.47c.56-.21 1.06.15.88 1.01Z" />
                </svg>
              )}
              {label === "SMS" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="#34D399" // SMS green
                  viewBox="0 0 24 24"
                >
                  <path d="M20 2H4C2.897 2 2 2.897 2 4v16l4-4h14c1.103 0 2-.897 2-2V4C22 2.897 21.103 2 20 2z" />
                </svg>
              )}
              {label === "Email" && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="#374151" // Email gray
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4H4C2.897 4 2 4.897 2 6v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 5.333-8-5.333V6h16zM4 18V8.489l8 5.333 8-5.333V18H4z" />
                </svg>
              )}
            </span>
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
          <span className="text-base">🤖</span>
          <span className="text-sm text-gray-800 dark:text-gray-200">AI Step</span>
        </button>
      </div>

      {/* Logic Category */}
      <div>
        <div className="text-xs text-gray-600 dark:text-gray-400 uppercase font-medium">
          Logic
        </div>
        {["Actions", "Condition", "Randomizer", "Smart Delay"].map((label) => (
          <button
            key={label}
            onClick={() => handlePick(label)}
            className="
              w-full text-left px-3 py-2 mt-1
              bg-white dark:bg-gray-700
              border border-gray-300 dark:border-gray-600
              rounded-md hover:bg-gray-100 dark:hover:bg-gray-600
              transition
            "
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
});

//
// ─── FacebookMessageNode ────────────────────────────────────────────────────
// “Send Message” for Messenger, with gradient bubble icon
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
        border-2 border-blue-400
        rounded-lg
        shadow-md
        p-4
        flex flex-col
        overflow-hidden
        cursor-default
      "
    >
      {/* Top handle (incoming) */}
      <Handle
        type="target"
        position="top"
        id="a"
        style={{ background: "#8B5CF6", width: 10, height: 10 }}
      />

      {/* Header row: Messenger gradient bubble icon + “Send Message” */}
      <div className="flex items-center space-x-2 mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 flex-shrink-0"
          viewBox="0 0 512 512"
        >
          <defs>
            <linearGradient id="messengerBubbleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF5E3A" />
              <stop offset="25%" stopColor="#FF2A68" />
              <stop offset="50%" stopColor="#A516F0" />
              <stop offset="100%" stopColor="#0078FF" />
            </linearGradient>
          </defs>
          <path
            fill="url(#messengerBubbleGradient)"
            d="M512 256c0 141.4-114.6 256-256 256-45.9 0-89.7-12.2-127.9-35.1l-93.3 31 31-93.3C12.2 345.7 0 301.9 0 256 0 114.6 114.6 0 256 0s256 114.6 256 256z"
          />
          <path
            fill="#FFFFFF"
            d="M273.9 179.4l-63.4 90.6-41.8-47.3c-3.6-4.1-9.8-4.6-13.9-1-4.1 3.6-4.6 9.8-1 13.9l54.8 62.1c2 2.2 5.1 3.2 8 .8l71.3-101.9c3.1-4.5 1.7-11-3-14.1-4.7-3.2-11.2-1.7-14.1 3z"
          />
        </svg>
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
            placeholder="Type your message..."
          />
        ) : (
          <span className="whitespace-normal break-words">
            {data.label || "Add a text"}
          </span>
        )}
      </div>

      {/* “Next Step” label */}
      <div className="absolute right-3 bottom-8 text-xs text-gray-700 dark:text-gray-300">
        Next Step
      </div>

      {/* Bottom handle (outgoing) */}
      <Handle
        type="source"
        position="bottom"
        id="b"
        style={{ background: "#8B5CF6", width: 10, height: 10, bottom: "-5px" }}
      />

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
// “Send Message” for Instagram, with gradient camera icon
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
      {/* Top handle (incoming) */}
      <Handle
        type="target"
        position="top"
        id="a"
        style={{ background: "#EC4899", width: 10, height: 10 }}
      />

      {/* Header row: Instagram gradient camera icon + “Send Message” */}
      <div className="flex items-center space-x-2 mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 flex-shrink-0"
          viewBox="0 0 24 24"
        >
          <defs>
            <linearGradient id="instagramGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F58529" />
              <stop offset="50%" stopColor="#DD2A7B" />
              <stop offset="75%" stopColor="#8134AF" />
              <stop offset="100%" stopColor="#515BD4" />
            </linearGradient>
          </defs>
          <path
            fill="url(#instagramGradient)"
            d="M7.75 2C5.402 2 3.182 3.402 2 5.75v12.5C3.182 20.598 5.402 22 7.75 22h8.5c2.348 0 4.568-1.402 5.75-3.75V5.75C20.568 3.402 18.348 2 15.999 2h-8.25Zm4.249 3.2a4.8 4.8 0 1 1 0 9.6 4.8 4.8 0 0 1 0-9.6Zm5.3-0.25a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z"
          />
        </svg>
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
            placeholder="Type your message..."
          />
        ) : (
          <span className="whitespace-normal break-words">
            {data.label || "Add a text"}
          </span>
        )}
      </div>

      {/* “Next Step” label */}
      <div className="absolute right-3 bottom-8 text-xs text-gray-700 dark:text-gray-300">
        Next Step
      </div>

      {/* Bottom handle (outgoing) */}
      <Handle
        type="source"
        position="bottom"
        id="b"
        style={{ background: "#EC4899", width: 10, height: 10, bottom: "-5px" }}
      />

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
// “Send Message” for Telegram, with paper‐plane icon
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
        border-2 border-blue-300
        rounded-lg
        shadow-md
        p-4
        flex flex-col
        overflow-hidden
        cursor-default
      "
    >
      {/* Top handle (incoming) */}
      <Handle
        type="target"
        position="top"
        id="a"
        style={{ background: "#22D3EE", width: 10, height: 10 }}
      />

      {/* Header row: Telegram paper‐plane icon + “Send Message” */}
      <div className="flex items-center space-x-2 mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 flex-shrink-0"
          fill="#37AEE2" // Telegram blue
          viewBox="0 0 24 24"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.02 7.35l-1.72 8.5c-.13.62-.48.77-.97.48L9.3 14.2l-1.8 1.73c-.16.16-.29.29-.64.29l.24-3.53 6.5-5.88c.28-.25-.06-.39-.22-.25L7.3 12.14l-3.08-.96c-.68-.21-.69-.67.14-1.01l11.66-4.47c.56-.21 1.06.15.88 1.01z" />
        </svg>
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
            placeholder="Type your message..."
          />
        ) : (
          <span className="whitespace-normal break-words">
            {data.label || "Add a text"}
          </span>
        )}
      </div>

      {/* “Next Step” label */}
      <div className="absolute right-3 bottom-8 text-xs text-gray-700 dark:text-gray-300">
        Next Step
      </div>

      {/* Bottom handle (outgoing) */}
      <Handle
        type="source"
        position="bottom"
        id="b"
        style={{ background: "#22D3EE", width: 10, height: 10, bottom: "-5px" }}
      />

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
// “Send Message” for SMS, with phone‐bubble icon
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
        border-2 border-green-500
        rounded-lg
        shadow-md
        p-4
        flex flex-col
        overflow-hidden
        cursor-default
      "
    >
      {/* Top handle (incoming) */}
      <Handle
        type="target"
        position="top"
        id="a"
        style={{ background: "#10B981", width: 10, height: 10 }}
      />

      {/* Header row: SMS phone‐bubble icon + “Send Message” */}
      <div className="flex items-center space-x-2 mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 flex-shrink-0"
          fill="#34D399" // SMS green
          viewBox="0 0 24 24"
        >
          <path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1v3.5c0 .55-.45 1-1 1C9.16 21.5 2.5 14.84 2.5 6c0-.55.45-1 1-1H7c.55 0 1 .45 1 1 0 1.24.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
        </svg>
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
            placeholder="Type your message..."
          />
        ) : (
          <span className="whitespace-normal break-words">
            {data.label || "Add a text"}
          </span>
        )}
      </div>

      {/* “Next Step” label */}
      <div className="absolute right-3 bottom-8 text-xs text-gray-700 dark:text-gray-300">
        Next Step
      </div>

      {/* Bottom handle (outgoing) */}
      <Handle
        type="source"
        position="bottom"
        id="b"
        style={{ background: "#10B981", width: 10, height: 10, bottom: "-5px" }}
      />

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
// “Send Message” for Email, with envelope icon
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
        border-2 border-purple-500
        rounded-lg
        shadow-md
        p-4
        flex flex-col
        overflow-hidden
        cursor-default
      "
    >
      {/* Top handle (incoming) */}
      <Handle
        type="target"
        position="top"
        id="a"
        style={{ background: "#A78BFA", width: 10, height: 10 }}
      />

      {/* Header row: Envelope icon + “Send Message” */}
      <div className="flex items-center space-x-2 mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 flex-shrink-0"
          fill="#374151" // Email gray
          viewBox="0 0 24 24"
        >
          <path d="M20 4H4C2.897 4 2 4.897 2 6v12c0 1.103.897 2 2 2h16c1.103 0 2-0.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 5.333-8-5.333V6h16zM4 18V8.489l8 5.333 8-5.333V18H4z" />
        </svg>
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
            placeholder="Type your message..."
          />
        ) : (
          <span className="whitespace-normal break-words">
            {data.label || "Add a text"}
          </span>
        )}
      </div>

      {/* “Next Step” label */}
      <div className="absolute right-3 bottom-8 text-xs text-gray-700 dark:text-gray-300">
        Next Step
      </div>

      {/* Bottom handle (outgoing) */}
      <Handle
        type="source"
        position="bottom"
        id="b"
        style={{ background: "#A78BFA", width: 10, height: 10, bottom: "-5px" }}
      />

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
// A generic “AI” block; click to add/edit text.
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
    >
      <Handle
        type="target"
        position="top"
        id="a"
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
          placeholder="Type your message..."
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
      <Handle
        type="source"
        position="bottom"
        id="b"
        style={{ background: "#6366F1", width: 10, height: 10, bottom: "-5px" }}
      />
    </div>
  );
});

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

  // Start with an empty canvas (no initial Trigger)
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeIds, setSelectedNodeIds] = useState([]);

  // Handler for editing any node’s text field
  const handleLabelChange = useCallback(
    (id, value) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === id
            ? { ...n, data: { ...n.data, label: value, onChange: handleLabelChange } }
            : n
        )
      );
    },
    [setNodes]
  );

  // Resize callback (for both Trigger and message nodes)
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
                  onResize: n.type === "trigger" ? handleResize : n.data.onResize,
                  onAddTrigger:
                    n.type === "trigger" ? spawnSelector : n.data.onAddTrigger,
                },
              }
            : n
        )
      );
    },
    [setNodes]
  );

  // Called whenever you draw a connection
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [
    setEdges,
  ]);

  // spawnSelector: Create a SelectorNode just to the right of a TriggerNode
  const spawnSelector = (triggerId) => {
    setNodes((nds) => {
      const trigger = nds.find((n) => n.id === triggerId);
      if (!trigger) return nds;

      const newId = getId();
      const newSelector = {
        id: newId,
        type: "selector",
        data: {
          width: 200,
          height: 300,
          onSelect: (choiceLabel) => {
            spawnBranchNode(choiceLabel, newId);
          },
        },
        position: {
          x: trigger.position.x + trigger.data.width + 50,
          y: trigger.position.y,
        },
      };
      return [...nds, newSelector];
    });
  };

  // spawnBranchNode: Based on the chosen label, create the appropriate message‐node
  const spawnBranchNode = (label, selectorId) => {
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
          y: selector ? selector.position.y + 50 : 100,
        },
      };
      return [...nds, newNode];
    });
  };

  // Delete all currently selected nodes (and any connecting edges)
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
                if (node.type === "email") return "#374151";
                return "#6366F1";
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
