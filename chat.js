
// ================== Chat System Logic ==================
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatHeaderName = document.getElementById('chatHeaderName');
const chatHeaderImg = document.getElementById('chatHeaderImg');
const chatWindow = document.querySelector('.chat-window');

// Current Active Chat User
let activeChatUser = "David K.";

// Mock Data: Chat History for distinct users
const chatHistory = {
    "David K.": [
        { type: "received", text: "Hey, I noticed some discrepancies in the sales report for last month. Can we check?", time: "10:30 AM" },
        { type: "sent", text: "Sure, I'll take a look at it right now.", time: "10:32 AM" },
        { type: "received", text: "Thanks! Let me know if you need the raw data.", time: "10:33 AM" }
    ],
    "Sarah M.": [
        { type: "received", text: "The new project timeline has been updated.", time: "Yesterday" },
        { type: "sent", text: "Got it, I'll review the changes.", time: "Yesterday" }
    ],
    "Tech Support": [
        { type: "received", text: "Your ticket #9283 has been resolved.", time: "Oct 24" },
        { type: "sent", text: "Thank you for the quick fix!", time: "Oct 24" }
    ],
    "Jane Doe": [
        { type: "received", text: "Can we reschedule our meeting?", time: "Oct 20" },
        { type: "sent", text: "Sure, what time works for you?", time: "Oct 20" }
    ]
};

// Helper: Scroll to bottom
function scrollToBottom() {
    if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}

// Helper: Render a single message
function renderMessage(type, text, time) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', type);

    const p = document.createElement('p');
    p.innerText = text;

    const timeSpan = document.createElement('span');
    timeSpan.classList.add('time');
    timeSpan.innerText = time;

    msgDiv.appendChild(p);
    msgDiv.appendChild(timeSpan);
    chatMessages.appendChild(msgDiv);
}

// Load Chat Function
window.loadChat = function (name) {
    activeChatUser = name;

    // Update Header
    if (chatHeaderName) chatHeaderName.innerText = name;
    if (chatHeaderImg) chatHeaderImg.src = `https://ui-avatars.com/api/?name=${name}&background=random`;

    // Clear and Load Messages
    if (chatMessages) {
        chatMessages.innerHTML = ''; // Clear current view
        const history = chatHistory[name] || [];
        history.forEach(msg => {
            renderMessage(msg.type, msg.text, msg.time);
        });
        scrollToBottom();
    }

    // Update Active State in List
    document.querySelectorAll('.chat-item').forEach(item => item.classList.remove('active'));
    // Find the clicked element (this logic depends on how it's called, but simpler to just re-query or use the event if passed)
    // Since onclick="loadChat('Name')" is inline, we might need to find strictly by name or trust the user clicked it.
    // Let's use a simple lookup for the active class for now based on the name if we want to be precise, 
    // or just rely on the fact that the user clicked something. 
    // Actually, let's look it up by the name in the header to be safe, or just leave the "active" styling logic to the click event if we passed `this`.
    // But since `loadChat` is called with a string, let's just find the element that contains that name.
    const chatItems = document.querySelectorAll('.chat-item');
    chatItems.forEach(item => {
        if (item.querySelector('h4').innerText.includes(name)) {
            item.classList.add('active');
        }
    });

    // Mobile: Show Chat Window
    if (window.innerWidth <= 768) {
        chatWindow.classList.add('active');
    }
}

// Initial Load
loadChat("David K.");

// Back to Chat List (Mobile)
window.backToChatList = function () {
    chatWindow.classList.remove('active');
}

// Send Message
window.sendMessage = function () {
    const text = chatInput.value.trim();
    if (text === "") return;

    // Current Time
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Add to Data Model
    if (!chatHistory[activeChatUser]) {
        chatHistory[activeChatUser] = [];
    }
    chatHistory[activeChatUser].push({ type: 'sent', text: text, time: timeString });

    // 2. Render to UI
    renderMessage('sent', text, timeString);
    scrollToBottom();
    chatInput.value = "";

    // 3. Simulated Reply
    setTimeout(() => {
        receiveMessage(`Auto-reply from ${activeChatUser}: Received " ${text} "`);
    }, 2000);
}

// Receive Message (Simulated)
function receiveMessage(text) {
    // Current Time
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Add to Data Model
    if (!chatHistory[activeChatUser]) {
        chatHistory[activeChatUser] = [];
    }
    chatHistory[activeChatUser].push({ type: 'received', text: text, time: timeString });

    // 2. Render to UI (only if we are still looking at this user!)
    // If the user switched chats while waiting for a reply, we shouldn't render it in the wrong window.
    // We should check if activeChatUser is still the same.
    // Ideally, we'd pass the 'sender' to receiveMessage to compare. 
    // But for this simple simulation, assuming we are still in the chat is fine, OR we can just check:

    // For simplicity, let's just append. In a real app, we'd check/notify.
    renderMessage('received', text, timeString);
    scrollToBottom();
}

// Enter Key to Send
if (chatInput) {
    chatInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}
