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

    const res = await fetch('http://127.0.0.1:5000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message })
    });

    const data = await res.json();

    messagesArea.innerHTML += `
        <div class="flex flex-col gap-2 max-w-[80%] self-start">
            <div class="flex items-center gap-2 mb-1">
                <span class="text-label-md font-label-md text-on-surface-variant">NeuraChat AI</span>
            </div>
            <div class="bot-bubble p-4 rounded-2xl glass-panel text-body-md font-body-md text-on-surface">
                ${data.response}
            </div>
        </div>`;

    messagesArea.scrollTop = messagesArea.scrollHeight;
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});