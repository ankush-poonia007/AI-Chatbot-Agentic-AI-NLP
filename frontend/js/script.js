let currentChatId = null;
const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');
const messagesArea = document.getElementById('messagesArea');

async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    messagesArea.innerHTML += `
        <div class="flex flex-col gap-2 max-w-[80%] self-end">
            <div class="flex items-center justify-end gap-2 mb-1">
                <span class="text-label-md font-label-md text-on-surface-variant">You</span>
            </div>
            <div class="user-bubble p-4 rounded-2xl bg-gradient-to-br from-primary-container to-inverse-primary text-on-primary-container bloom-primary text-body-md font-body-md">
                ${message}
            </div>
        </div>`;

    userInput.value = '';
    messagesArea.scrollTop = messagesArea.scrollHeight;

    messagesArea.insertAdjacentHTML('beforeend', `
        <div id="loader-bubble" class="flex flex-col gap-2 max-w-[80%] self-start">
            <div class="flex items-center gap-2 mb-1">
                <span class="text-label-md font-label-md text-on-surface-variant">NeuraChat AI</span>
            </div>
            <div class="bot-bubble p-4 rounded-2xl glass-panel text-body-md font-body-md text-on-surface flex items-center justify-center">
                <div class="typing-indicator">
                    <span></span><span></span><span></span>
                </div>
            </div>
        </div>`);
    messagesArea.scrollTop = messagesArea.scrollHeight;

    try {
        
        if (!currentChatId) {
            const newRes = await fetch('/api/chats/new', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: message.substring(0, 30) || 'New Chat' })
            });
            const newData = await newRes.json();
            if(newData.success) {
                currentChatId = newData.chat_id;
                loadChats();
            }
        }

        const res = await fetch('http://127.0.0.1:5000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message, chat_id: currentChatId })
        });

        const data = await res.json();

        const loader = document.getElementById('loader-bubble');
        if (loader) loader.remove();

        if (data.limit_reached) {
            messagesArea.insertAdjacentHTML('beforeend', `
                <div class="flex flex-col gap-2 max-w-[80%] self-start w-full">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="text-label-md font-label-md text-error">Warning</span>
                    </div>
                    <div class="bot-bubble p-4 rounded-2xl bg-error-container text-on-error-container text-body-md font-body-md">
                        ${data.response}
                    </div>
                </div>`);
            sendBtn.disabled = true;
            userInput.disabled = true;
            userInput.placeholder = "Message limit reached";
        } else {
            messagesArea.insertAdjacentHTML('beforeend', `
                <div class="flex flex-col gap-2 max-w-[80%] self-start">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="text-label-md font-label-md text-on-surface-variant">NeuraChat AI</span>
                    </div>
                    <div class="bot-bubble p-4 rounded-2xl glass-panel text-body-md font-body-md text-on-surface">
                        ${data.response}
                    </div>
                </div>`);
        }
    } catch (error) {
        const loader = document.getElementById('loader-bubble');
        if (loader) loader.remove();

        let errorMessage = "Something went wrong. Please try again.";
        if (error instanceof TypeError || error.message.includes('fetch')) {
            errorMessage = "Connection error. Please try again.";
        }

        messagesArea.insertAdjacentHTML('beforeend', `
            <div class="flex flex-col gap-2 max-w-[80%] self-start">
                <div class="flex items-center gap-2 mb-1">
                    <span class="text-label-md font-label-md text-error">Error</span>
                </div>
                <div class="bot-bubble p-4 rounded-2xl bg-error-container text-on-error-container text-body-md font-body-md">
                    ${errorMessage}
                </div>
            </div>`);
    }

    messagesArea.scrollTop = messagesArea.scrollHeight;
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

const newChatBtn = document.getElementById('newChatBtn');
if (newChatBtn) {
    newChatBtn.addEventListener('click', () => {
        if (messagesArea) {
            messagesArea.innerHTML = '';
            currentChatId = null;
        }
    });
}

async function loadChats() {
    try {
        const res = await fetch('/api/chats');
        const data = await res.json();
        const chatList = document.getElementById('chatHistoryList');
        if(!chatList) return;
        chatList.innerHTML = `
            <div class="px-2 py-3">
                <span class="text-caption font-caption text-outline uppercase tracking-widest">Recent Chats</span>
            </div>
        `;
        if(data.success && data.chats) {
            data.chats.forEach(chat => {
                const isActive = chat.chat_id === currentChatId ? 'bg-surface-container-high border-primary/20' : 'hover:bg-surface-variant/50 border-transparent';
                chatList.innerHTML += `
                    <div onclick="loadMessages('${chat.chat_id}')" class="group relative flex items-center justify-between p-4 rounded-xl ${isActive} transition-colors cursor-pointer mb-2">
                        <div class="flex flex-col overflow-hidden">
                            <span class="text-label-md font-label-md text-on-surface truncate">${chat.title}</span>
                        </div>
                    </div>
                `;
            });
        }
    } catch(err) {
        console.error("Failed to load chats", err);
    }
}

async function loadMessages(chatId) {
    currentChatId = chatId;
    loadChats(); // to update active styling
    if(messagesArea) messagesArea.innerHTML = '';
    
    try {
        const res = await fetch(`/api/chats/${chatId}/messages`);
        const data = await res.json();
        if(data.success && data.messages) {
            data.messages.forEach(msg => {
                if(msg.role === 'user') {
                    messagesArea.innerHTML += `
                        <div class="flex flex-col gap-2 max-w-[80%] self-end">
                            <div class="flex items-center justify-end gap-2 mb-1">
                                <span class="text-label-md font-label-md text-on-surface-variant">You</span>
                            </div>
                            <div class="user-bubble p-4 rounded-2xl bg-gradient-to-br from-primary-container to-inverse-primary text-on-primary-container bloom-primary text-body-md font-body-md">
                                ${msg.content}
                            </div>
                        </div>`;
                } else {
                    messagesArea.innerHTML += `
                        <div class="flex flex-col gap-2 max-w-[80%] self-start">
                            <div class="flex items-center gap-2 mb-1">
                                <span class="text-label-md font-label-md text-on-surface-variant">NeuraChat AI</span>
                            </div>
                            <div class="bot-bubble p-4 rounded-2xl glass-panel text-body-md font-body-md text-on-surface">
                                ${msg.content}
                            </div>
                        </div>`;
                }
            });
            messagesArea.scrollTop = messagesArea.scrollHeight;
        }
    } catch(err) {
        console.error("Failed to load messages");
    }
}

document.addEventListener('DOMContentLoaded', loadChats);
