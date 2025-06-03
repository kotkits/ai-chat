// components/LiveChatContent.jsx

import React, { useState, useEffect } from "react";
import { FaCommentDots, FaFilter, FaSort, FaEllipsisV } from "react-icons/fa";
import { useSession, signIn } from "next-auth/react";

export default function LiveChatContent({ onIncoming }) {
  const { data: session, status } = useSession();

  //
  // ─── STATE ───────────────────────────────────────────────────────────────────
  //
  // Conversations: { id, owner, name, avatar, channel, lastMessage, lastTime, history }
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [activeTab, setActiveTab] = useState("reply");
  const [replyText, setReplyText] = useState("");
  const [noteText, setNoteText] = useState("");

  //
  // ─── AUTH ─────────────────────────────────────────────────────────────────────
  //
  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  //
  // ─── FETCH CONVERSATIONS ──────────────────────────────────────────────────────
  //
  useEffect(() => {
    if (status !== "authenticated") return;

    async function fetchConversations() {
      try {
        const isAdmin = session.user.name === "admin";
        let url = "/api/conversations";
        if (!isAdmin) {
          const username = encodeURIComponent(session.user.name);
          url += `?username=${username}`;
        }
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setConversations(
          data.map((c) => ({
            id: c._id,
            owner: c.owner,
            name: c.name,
            avatar: c.avatar,
            channel: c.channel,       // website URL
            lastMessage: c.lastMessage,
            lastTime: c.lastTime,
            history: c.history || [],
          }))
        );
      } catch {
        console.warn("Could not load conversations; starting empty.");
        setConversations([]);
      }
    }

    fetchConversations();
  }, [status, session]);

  //
  // ─── HELPERS ─────────────────────────────────────────────────────────────────
  //
  const addConversationIfMissing = (fromName, fromAvatar, channel) => {
    const username = session.user.name;
    const existing = conversations.find(
      (c) =>
        c.name === fromName &&
        c.channel === channel &&
        (session.user.name === "admin" ? true : c.owner === username)
    );
    if (existing) return existing;

    const newConv = {
      id: Date.now().toString(),
      owner: username,
      name: fromName,
      avatar: fromAvatar,
      channel,
      lastMessage: "",
      lastTime: "",
      history: [],
    };

    setConversations((prev) => [...prev, newConv]);
    return newConv;
  };

  // Called whenever a new incoming message arrives.
  // Update “channel” (current website) and notify parent via onIncoming(...)
  const handleIncomingMessage = (fromName, fromAvatar, channel, messageText) => {
    if (status !== "authenticated") return;
    const convObj = addConversationIfMissing(fromName, fromAvatar, channel);

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
            channel,
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

    setSelectedConversation({
      ...convObj,
      channel,
      lastMessage: messageText,
      lastTime: nowStr,
      history: [
        ...convObj.history,
        {
          id: Date.now().toString(),
          from: "them",
          text: messageText,
          time: nowStr,
        },
      ],
    });

    // Notify parent: new incoming chat on website “channel”
    if (typeof onIncoming === "function") {
      onIncoming({
        id: convObj.id,
        name: fromName,
        avatar: fromAvatar,
        channel,           // the website URL
        messageText,
        timestamp: nowStr,
      });
    }
  };

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

    setSelectedConversation((prev) =>
      prev && {
        ...prev,
        lastMessage: replyText,
        lastTime: nowStr,
        history: [...prev.history, replyMsgObj],
      }
    );

    setReplyText("");
  };

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
            history: [...c.history, noteMsgObj],
          };
        }
        return c;
      })
    );

    setSelectedConversation((prev) =>
      prev && { ...prev, history: [...prev.history, noteMsgObj] }
    );

    setNoteText("");
  };

  //
  // ─── RENDER ─────────────────────────────────────────────────────────────────
  //
  if (status === "loading") {
    return (
      <div className="text-center py-20 text-gray-500">
        Checking authentication…
      </div>
    );
  }
  if (status === "unauthenticated") {
    return null;
  }

  const isAdmin = session.user.name === "admin";

  return (
    <div className="flex h-full bg-gray-50">
      {/* ────────── Left Sidebar ────────── */}
      <aside className="w-1/3 border-r bg-white flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-2xl font-bold text-[#1A202C]">Live Chat</h2>
          {isAdmin && (
            <div className="mt-2 text-sm text-gray-600">
              (Admin: see all users’ websites)
            </div>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          {/* Conversations Header */}
          <div className="p-4">
            <div className="text-sm font-semibold text-gray-700 mb-2">
              Conversations
            </div>
            <ul className="space-y-1">
              {!isAdmin && (
                <>
                  <li className="flex items-center justify-between px-2 py-1 hover:bg-gray-100 rounded">
                    <div className="flex items-center space-x-2">
                      <FaCommentDots className="text-gray-500" />
                      <span className="text-sm">You</span>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-600 rounded-full px-2">
                      {conversations.filter(
                        (c) => c.owner === session.user.name
                      ).length}
                    </span>
                  </li>
                  <li className="flex items-center justify-between px-2 py-1 hover:bg-gray-100 rounded">
                    <div className="flex items-center space-x-2">
                      <FaCommentDots className="text-gray-500" />
                      <span className="text-sm">Team</span>
                    </div>
                    <span className="text-xs bg-gray-200 text-gray-600 rounded-full px-2">
                      {conversations.length}
                    </span>
                  </li>
                </>
              )}
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

          {/* Channels (websites) */}
          <div className="px-4">
            <div className="text-sm font-semibold text-gray-700 mb-2">
              Channels
            </div>
            <ul className="space-y-1">
              <li className="flex items-center space-x-2 px-2 py-1 hover:bg-gray-100 rounded">
                <FaCommentDots className="text-gray-500" />
                <span className="text-sm">All websites</span>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      {/* ────────── Middle Conversations List ────────── */}
      <div className="w-1/3 border-r bg-white flex flex-col">
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
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-800">
                        {conv.name}
                      </span>
                      {isAdmin && (
                        <span className="text-xs text-gray-500">
                          (User: {conv.owner})
                        </span>
                      )}
                    </div>
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
      <div className="w-1/3 flex flex-col bg-white">
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
                {isAdmin && (
                  <div className="text-xs text-gray-500">
                    Chatting with: {selectedConversation.owner}
                  </div>
                )}
                <div className="text-xs text-gray-500">
                  Current Website: {selectedConversation.channel}
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
