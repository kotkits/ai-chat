
const sessionId = localStorage.getItem("chatSessionId") || (() => {
  const id = (crypto.randomUUID?.() || Math.random().toString(36).slice(2));
  localStorage.setItem("chatSessionId", id);
  return id;
})();

let inputEl, chatbox, sendBtn;

document.addEventListener("DOMContentLoaded", () => {

  inputEl  = document.getElementById("userInput");
  chatbox  = document.getElementById("chatbox");
  sendBtn  = document.getElementById("send-button");

  applyThemePreference();
  loadChatHistory();
  scrollChatToBottom();

  inputEl.addEventListener("keypress", e => {
    if (e.key === "Enter") sendMessage();
  });
});

async function sendMessage() {
  const text = inputEl.value.trim();
  if (!text || sendBtn.disabled) return;

  // lock UI
  sendBtn.disabled  = true;
  inputEl.disabled  = true;

  const userMessage = sanitizeInput(text);
  inputEl.value = "";
  appendMessage(userMessage, "user-message");

  const typingEl = appendMessage("", "ai-message typing-indicator");

  try {
    const res = await fetch("/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage, sessionId })
    });
    if (!res.ok) throw new Error(`Server ${res.status}`);

    const { reply } = await res.json();
    if (!reply) throw new Error("No reply from server");

    const delay = Math.min(reply.length * 2 + Math.random() * 500, 1500);
    await new Promise(r => setTimeout(r, delay));

    removeMessage(typingEl);
    appendMessage(processMarkdown(reply), "ai-message");
    saveChatHistory();

  } catch (err) {
    console.error("❌", err);
    removeMessage(typingEl);
    appendMessage(
      "⚠️ I couldn't process your request. Please try again.",
      "ai-message error"
    );
  } finally {
    sendBtn.disabled = false;
    inputEl.disabled = false;
  }
}

function scrollChatToBottom() {
  chatbox.scrollTo({ top: chatbox.scrollHeight, behavior: "auto" });
}


function displayUserMessage(text) {
  appendMessage(text, "user-message");
}

function displayAIMessage(rawText, isError = false) {
  const className = isError ? "ai-message error" : "ai-message";
  appendMessage(processMarkdown(rawText), className);
}

function removeLoadingMessage(loadingMessage) {
  if (loadingMessage && loadingMessage.parentNode) {
    loadingMessage.parentNode.removeChild(loadingMessage);
  }
}

function removeMessage(el) {
  if (el && el.parentNode) el.parentNode.removeChild(el);
}

function appendMessage(txt, cls) {
  const div = document.createElement("div");
  div.className = `message ${cls}`;
  div.innerHTML = `
    <span class="timestamp">${new Date().toLocaleTimeString([], {
      hour: "2-digit", minute: "2-digit"
    })}</span><br>
    <span class="message-text">${txt}</span>
  `;
  chatbox.appendChild(div);
  chatbox.scrollTo({ top: chatbox.scrollHeight, behavior: "smooth" });
  return div;
}

function processMarkdown(text) {
  let p = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g,
             '<a href="$2" target="_blank">$1</a>');
  p = p
    .replace(/```(\w*)\n([\s\S]*?)\n```/g,
             '<pre><code class="language-$1">$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
  return p;
}

function saveChatHistory() {
  const html = chatbox.innerHTML;
  sessionStorage.chatSession = html;
  localStorage.chatHistory = html;
}

function loadChatHistory() {
  const saved = sessionStorage.chatSession || localStorage.chatHistory;
  if (saved) chatbox.innerHTML = saved;
  scrollChatToBottom();
}


function toggleSettings() {
  const btn  = document.getElementById('settings-toggle');
  const opts = document.getElementById('settings-options');
  const isOpen = getComputedStyle(opts).display === 'block';
  opts.style.display = isOpen ? 'none' : 'block';
  btn.setAttribute('aria-expanded', String(!isOpen));
}

function restoreChatHistory() {
  const old = sessionStorage.cleared || localStorage.chatHistory;
  if (old) chatbox.innerHTML = old;
}

function clearChat() {
  sessionStorage.cleared = chatbox.innerHTML;
  chatbox.innerHTML = "";
  sessionStorage.removeItem("chatSession");
  localStorage.removeItem("chatHistory");
}

function sanitizeInput(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function toggleTheme() {
  document.body.classList.toggle("light-mode");
  localStorage.dark =
    document.body.classList.contains("light-mode");
}

function applyThemePreference() {
  document.body.classList.toggle(
    "light-mode",
    localStorage.dark === "true"
  );
}

async function startNewSession() {
  clearChat();
  await fetch("/clearChatHistory", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId })
  });
  console.log("✅ New session started");
}
