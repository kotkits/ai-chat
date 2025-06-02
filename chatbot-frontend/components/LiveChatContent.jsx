// File: components/LiveChatContent.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  FaFacebookMessenger,
  FaCommentDots,
  FaFilter,
  FaSort,
  FaEllipsisV,
} from "react-icons/fa";

export default function LiveChatContent() {
  //
  // ─── STATE ───────────────────────────────────────────────────────────────────
  //
  // Conversations list: an array of objects like:
  // { id, name, avatar, channel, lastMessage, lastTime, history: [ ... ] }
  const [conversations, setConversations] = useState([]);

  // Currently selected conversation (object from `conversations`) or null
  const [selectedConversation, setSelectedConversation] = useState(null);

  // Which tab is active in the right pane: "reply" or "note"
  const [activeTab, setActiveTab] = useState("reply");
  const [replyText, setReplyText] = useState("");
  const [noteText, setNoteText] = useState("");

  //
  // ─── HELPERS ─────────────────────────────────────────────────────────────────
  //
  // Given a user‐name (fromName) and channel (e.g. "Facebook"), add a conversation
  // entry to `conversations` if it doesn't already exist. Returns the new or existing object.
  const addConversationIfMissing = (fromName, fromAvatar, channel) => {
    // Check if conversation already exists (by name + channel)
    const existing = conversations.find(
      (c) => c.name === fromName && c.channel === channel
    );
    if (existing) return existing;

    // Otherwise, create a new conversation object
    const newConv = {
      id: Date.now().toString(), // simple unique ID
      name: fromName,
      avatar: fromAvatar,
      channel: channel,
      lastMessage: "", // will be updated once we append to history
      lastTime: "", // same
      history: [], // array of { id, from: "them"|"me"|"note", text, time }
    };

    setConversations((prev) => [...prev, newConv]);
    return newConv;
  };

  // Given a conversation object and a new incoming message (from the user),
  // append that message to the conversation’s history and update lastMessage/lastTime,
  // then select that conversation in the right pane.
  const handleIncomingMessage = (fromName, fromAvatar, channel, messageText) => {
    const convObj = addConversationIfMissing(fromName, fromAvatar, channel);

    // Find up‐to‐date object from state
    setConversations((prevConvs) =>
      prevConvs.map((c) => {
        if (c.id === convObj.id) {
          // Append a new message to history
          const nowStr = new Date().toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
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

    // Now select this conversation in the UI
    setSelectedConversation((prev) => {
      // Because setConversations is async, find the updated object by ID
      const updated = conversations.find((c) => c.name === fromName && c.channel === channel);
      return updated || { ...convObj, lastMessage: messageText, lastTime: new Date().toLocaleString() };
    });
  };

  // When YOU send a reply (in the Reply tab), append that to the current conversation
  const handleSendReply = () => {
    if (!selectedConversation || replyText.trim() === "") return;

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
      text: replyText,
      time: nowStr,
    };

    setConversations((prevConvs) =>
      prevConvs.map((c) => {
        if (c.id === selectedConversation.id) {
          return {
            ...c,
            lastMessage: replyText,
            lastTime: nowStr,
            history: [...c.history, replyMsgObj],
          };
        }
        return c;
      })
    );

    // Clear input, keep conversation selected
    setReplyText("");
  };

  // When YOU add a note (in the Note tab), append that to the current conversation
  const handleSaveNote = () => {
    if (!selectedConversation || noteText.trim() === "") return;

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
      text: noteText,
      time: nowStr,
    };

    setConversations((prevConvs) =>
      prevConvs.map((c) => {
        if (c.id === selectedConversation.id) {
          return {
            ...c,
            // Note does not count as lastMessage; keep previous lastMessage/lastTime
            history: [...c.history, noteMsgObj],
          };
        }
        return c;
      })
    );

    setNoteText("");
  };

  //
  // ─── DEMO: SIMULATE AN INCOMING MESSAGE AFTER 2 SECONDS ─────────────────────
  //
  // Remove this useEffect in production; it’s only here to show how
  // handleIncomingMessage(...) will automatically create a new conversation
  // item and display it in the right pane.
  useEffect(() => {
    const demoTimer = setTimeout(() => {
      handleIncomingMessage(
        "Jane Doe", // incoming user name
        "https://via.placeholder.com/40", // avatar URL
        "Facebook",
        "Hi, I just landed here. Can you help me?"
      );
    }, 2000);

    return () => clearTimeout(demoTimer);
  }, []); // run once on mount

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
              <li className="flex items-center space-x-2 px-2 py-1 hover:bg-gray-100 rounded">
                <FaFacebookMessenger className="text-blue-500" />
                <span className="text-sm">Facebook</span>
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
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <FaFacebookMessenger />
                  <span>{selectedConversation.channel}</span>
                </div>
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
                onClick={() => setActiveTab("reply")}
                className={`pb-2 text-sm font-semibold ${
                  activeTab === "reply"
                    ? "border-b-2 border-blue-500 text-gray-800"
                    : "text-gray-500"
                }`}
              >
                Reply
              </button>
              <button
                onClick={() => setActiveTab("note")}
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
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Type your reply..."
                  className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <button
                  onClick={handleSendReply}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-r-lg"
                >
                  Send
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Add a note..."
                  className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
                <button
                  onClick={handleSaveNote}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 rounded-r-lg"
                >
                  Save
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
