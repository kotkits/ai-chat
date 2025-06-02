// File: components/LiveChatContent.jsx
import React, { useState, useEffect } from "react";
import {
  FaCommentDots,
  FaFilter,
  FaSort,
  FaEllipsisV,
} from "react-icons/fa";

export default function LiveChatContent() {
  //
  // ─── STATE ───────────────────────────────────────────────────────────────────
  //
  // Each conversation: { id, name, avatar, lastMessage, lastTime, history: [ ... ] }
  const [conversations, setConversations] = useState([]);

  // Currently selected conversation or null
  const [selectedConversation, setSelectedConversation] = useState(null);

  // Tabs: "reply" or "note"
  const [activeTab, setActiveTab] = useState("reply");
  const [replyText, setReplyText] = useState("");
  const [noteText, setNoteText] = useState("");

  // Inline validation messages
  const [replyError, setReplyError] = useState("");
  const [noteError, setNoteError] = useState("");

  //
  // ─── HELPERS ─────────────────────────────────────────────────────────────────
  //
  // Ensure a conversation exists for a given user (fromName); create if missing.
  const addConversationIfMissing = (fromName, fromAvatar) => {
    const existing = conversations.find((c) => c.name === fromName);
    if (existing) return existing;

    const nowStr = new Date().toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const newConv = {
      id: Date.now().toString(),
      name: fromName,
      avatar: fromAvatar,
      lastMessage: "",
      lastTime: nowStr,
      history: [],
    };

    setConversations((prev) => [...prev, newConv]);
    return newConv;
  };

  // Handle an incoming “user → chatbot” message
  const handleIncomingMessage = (fromName, fromAvatar, messageText) => {
    const convObj = addConversationIfMissing(fromName, fromAvatar);

    const nowStr = new Date().toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    setConversations((prevConvs) =>
      prevConvs.map((c) => {
        if (c.id === convObj.id) {
          return {
            ...c,
            lastMessage: messageText,
            lastTime: nowStr,
            history: [
              ...c.history,
              {
                id: Date.now().toString(),
                from: "them",
                text: messageText,
                time: nowStr,
              },
            ],
          };
        }
        return c;
      })
    );

    setSelectedConversation((prev) => {
      const updated = conversations.find((c) => c.name === fromName);
      return updated
        ? updated
        : { ...convObj, lastMessage: messageText, lastTime: nowStr };
    });
  };

  // When you (the agent) send a reply, validate and append it
  const handleSendReply = () => {
    // Trim whitespace to check if user actually typed something
    if (!replyText.trim()) {
      setReplyError("Reply cannot be empty.");
      return;
    }
    setReplyError("");

    const nowStr = new Date().toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const replyMsgObj = {
      id: Date.now().toString(),
      from: "me",
      text: replyText.trim(),
      time: nowStr,
    };

    setConversations((prevConvs) =>
      prevConvs.map((c) => {
        if (c.id === selectedConversation.id) {
          return {
            ...c,
            lastMessage: replyText.trim(),
            lastTime: nowStr,
            history: [...c.history, replyMsgObj],
          };
        }
        return c;
      })
    );

    // Clear input and keep conversation selected
    setReplyText("");
  };

  // When you (the agent) save a note, validate and append it
  const handleSaveNote = () => {
    if (!noteText.trim()) {
      setNoteError("Note cannot be empty.");
      return;
    }
    setNoteError("");

    const nowStr = new Date().toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const noteMsgObj = {
      id: Date.now().toString(),
      from: "note",
      text: noteText.trim(),
      time: nowStr,
    };

    setConversations((prevConvs) =>
      prevConvs.map((c) => {
        if (c.id === selectedConversation.id) {
          return {
            ...c,
            history: [...c.history, noteMsgObj],
          };
        }
        return c;
      })
    );

    setNoteText("");
  };

  //
  // ─── DEMO: SIMULATE INCOMING MESSAGE AFTER 2 SECONDS ────────────────────────
  //
  // In production, remove this and call handleIncomingMessage(...) from your real API/WebSocket.
  useEffect(() => {
    const demoTimer = setTimeout(() => {
      handleIncomingMessage(
        "Visitor",
        "https://via.placeholder.com/40", // placeholder avatar
        "Hello! I have a question about pricing."
      );
    }, 2000);

    return () => clearTimeout(demoTimer);
  }, []);

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────
  //
  return (
    <div className="flex h-screen bg-gray-50">
      {/* ────────── Left Sidebar ────────── */}
      <aside className="w-1/4 border-r bg-white flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-2xl font-bold text-[#1A202C]">Live Chat</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Conversations Header */}
          <div className="p-4">
            <div className="text-sm font-semibold text-gray-700 mb-2">
              Conversations
            </div>
            <ul className="space-y-1">
              <li className="flex items-center justify-between px-2 py-1 hover:bg-gray-100 rounded">
                <div className="flex items-center space-x-2">
                  <FaCommentDots className="text-gray-500" />
                  <span className="text-sm">Unassigned</span>
                </div>
                <span className="text-xs bg-gray-200 text-gray-600 rounded-full px-2">
                  0
                </span>
              </li>

              <li className="flex items-center justify-between px-2 py-1 hover:bg-gray-100 rounded">
                <div className="flex items-center space-x-2">
                  <FaCommentDots className="text-gray-500" />
                  <span className="text-sm">You</span>
                </div>
                <span className="text-xs bg-blue-100 text-blue-600 rounded-full px-2">
                  {conversations.filter((c) => c.assignedTo === "you").length}
                </span>
              </li>

              <li className="flex items-center justify-between px-2 py-1 hover:bg-gray-100 rounded">
                <div className="flex items-center space-x-2">
                  <FaCommentDots className="text-gray-500" />
                  <span className="text-sm">Team</span>
                </div>
                <span className="text-xs bg-gray-200 text-gray-600 rounded-full px-2">
                  {conversations.filter((c) => c.assignedTo === "team").length}
                </span>
              </li>

              <li className="flex items-center justify-between px-2 py-1 bg-gray-100 rounded">
                <div className="flex items-center space-x-2">
                  <FaCommentDots className="text-gray-700" />
                  <span className="text-sm font-semibold text-gray-800">
                    All
                  </span>
                </div>
                <span className="text-xs bg-gray-300 text-gray-800 rounded-full px-2">
                  {conversations.length}
                </span>
              </li>
            </ul>
          </div>

          {/* Channels */}
          <div className="px-4">
            <div className="text-sm font-semibold text-gray-700 mb-2">
              Channels
            </div>
            <ul className="space-y-1">
              <li className="flex items-center space-x-2 px-2 py-1 hover:bg-gray-100 rounded">
                <FaCommentDots className="text-gray-500" />
                <span className="text-sm">All channels</span>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      {/* ────────── Middle Conversation List ────────── */}
      <div className="w-1/4 border-r bg-white flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-1">
            <span className="text-sm font-semibold text-gray-700">All Open</span>
            <span className="text-xs bg-gray-200 text-gray-600 rounded-full px-2">
              {conversations.length}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button>
              <FaFilter className="text-gray-500" />
            </button>
            <button>
              <FaSort className="text-gray-500" />
            </button>
          </div>
        </div>

        {conversations.length === 0 ? (
          // Placeholder when no conversations exist yet
          <div className="flex-1 flex items-center justify-center text-gray-500">
            No conversations yet
          </div>
        ) : (
          <ul className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
              <li
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`flex items-center px-4 py-3 space-x-3 cursor-pointer hover:bg-gray-100 ${
                  selectedConversation?.id === conv.id ? "bg-gray-100" : ""
                }`}
              >
                <img
                  src={conv.avatar}
                  alt={conv.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-800">
                      {conv.name}
                    </span>
                    <span className="text-xs text-gray-500">{conv.lastTime}</span>
                  </div>
                  <div className="text-xs text-gray-600 truncate">
                    {conv.lastMessage}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ────────── Right Chat Detail Pane ────────── */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          {selectedConversation ? (
            <div className="flex items-center space-x-3">
              <img
                src={selectedConversation.avatar}
                alt={selectedConversation.name}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <div className="text-lg font-semibold text-gray-800">
                  {selectedConversation.name}
                </div>
                {/* No channel displayed here */}
              </div>
            </div>
          ) : (
            <div className="text-gray-500 italic">Select a conversation</div>
          )}
          <div className="flex items-center space-x-4 text-gray-500">
            <button>
              <FaSort />
            </button>
            <button>
              <FaEllipsisV />
            </button>
          </div>
        </div>

        {/* Chat history */}
        <div className="flex-1 px-6 py-4 overflow-y-auto space-y-6">
          {selectedConversation ? (
            selectedConversation.history.length > 0 ? (
              selectedConversation.history.map((msg) => {
                if (msg.from === "me") {
                  return (
                    <div
                      key={msg.id}
                      className="flex flex-col items-end space-y-1"
                    >
                      <div className="bg-blue-100 text-gray-800 px-3 py-2 rounded-2xl max-w-xs">
                        {msg.text}
                      </div>
                      <span className="text-xs text-gray-400">{msg.time}</span>
                    </div>
                  );
                } else if (msg.from === "them") {
                  return (
                    <div
                      key={msg.id}
                      className="flex flex-col items-start space-y-1"
                    >
                      <div className="bg-gray-100 text-gray-800 px-3 py-2 rounded-2xl max-w-xs">
                        {msg.text}
                      </div>
                      <span className="text-xs text-gray-400">{msg.time}</span>
                    </div>
                  );
                } else if (msg.from === "note") {
                  return (
                    <div
                      key={msg.id}
                      className="flex flex-col items-center space-y-1"
                    >
                      <span className="text-xs text-yellow-600">
                        ┈┈┈┈┈┈┈┈┈┈
                      </span>
                      <div className="text-xs text-gray-600 italic max-w-md">
                        {msg.text}
                      </div>
                      <span className="text-xs text-gray-400">{msg.time}</span>
                    </div>
                  );
                }
                return null;
              })
            ) : (
              <div className="text-gray-500 italic">No messages yet</div>
            )
          ) : (
            <div className="text-gray-500 italic">No messages to show</div>
          )}
        </div>

        {/* Reply / Note tabs + input */}
        {selectedConversation && (
          <div className="border-t px-6 py-4 flex flex-col">
            {/* Tabs */}
            <div className="flex space-x-6 mb-4">
              <button
                onClick={() => {
                  setActiveTab("reply");
                  setReplyError("");
                  setNoteError("");
                }}
                className={`pb-2 text-sm font-semibold ${
                  activeTab === "reply"
                    ? "border-b-2 border-blue-500 text-gray-800"
                    : "text-gray-500"
                }`}
              >
                Reply
              </button>
              <button
                onClick={() => {
                  setActiveTab("note");
                  setReplyError("");
                  setNoteError("");
                }}
                className={`pb-2 text-sm font-semibold ${
                  activeTab === "note"
                    ? "border-b-2 border-blue-500 text-gray-800"
                    : "text-gray-500"
                }`}
              >
                Note
              </button>
            </div>

            {/* Input area */}
            {activeTab === "reply" ? (
              <div className="flex flex-col space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Type your reply..."
                    className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none"
                    value={replyText}
                    onChange={(e) => {
                      setReplyText(e.target.value);
                      if (e.target.value.trim()) setReplyError("");
                    }}
                  />
                  <button
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                    className={`px-4 rounded-r-lg text-white ${
                      replyText.trim()
                        ? "bg-blue-500 hover:bg-blue-600"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    Send
                  </button>
                </div>
                {replyError && (
                  <span className="text-xs text-red-500">{replyError}</span>
                )}
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Add a note..."
                    className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none"
                    value={noteText}
                    onChange={(e) => {
                      setNoteText(e.target.value);
                      if (e.target.value.trim()) setNoteError("");
                    }}
                  />
                  <button
                    onClick={handleSaveNote}
                    disabled={!noteText.trim()}
                    className={`px-4 rounded-r-lg text-white ${
                      noteText.trim()
                        ? "bg-yellow-400 hover:bg-yellow-500"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    Save
                  </button>
                </div>
                {noteError && (
                  <span className="text-xs text-red-500">{noteError}</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
