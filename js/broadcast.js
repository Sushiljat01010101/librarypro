// ===========================
//   BROADCAST PAGE LOGIC
// ===========================

const telegramNotifier = new TelegramNotifier();

let allMembers = [];
let currentFilter = 'with-chatid';
let currentMsgType = 'text';
let selectedPhotoFile = null;
let selectedVideoFile = null;
let selectedDocumentFile = null;
let isSending = false;

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
    loadMembers();
    checkBotStatus();
    setupTabs();
    setupFileDropZones();
    setupMemberControls();
    setupSendButton();
    updateSelectedCount();
});

// ---- Load Members ----
function loadMembers() {
    allMembers = JSON.parse(localStorage.getItem('libraryMembers')) || [];
    updateStats();
    renderMembers();
}

function updateStats() {
    const withChatId = allMembers.filter(m => m.telegramChatId && m.telegramChatId.toString().trim() !== '');
    const without = allMembers.filter(m => !m.telegramChatId || m.telegramChatId.toString().trim() === '');

    document.getElementById('totalMembers').textContent = allMembers.length;
    document.getElementById('chatIdMembers').textContent = withChatId.length;
    document.getElementById('noChatIdCount').textContent = without.length;
    updateSelectedCount();
}

function updateSelectedCount() {
    const checked = document.querySelectorAll('.member-checkbox:checked');
    document.getElementById('selectedCount').textContent = checked.length;
    const sendBtn = document.getElementById('sendBroadcastBtn');
    if (checked.length > 0 && !isSending) {
        sendBtn.disabled = false;
    } else {
        sendBtn.disabled = true;
    }
}

// ---- Render Members ----
function renderMembers() {
    const searchVal = (document.getElementById('memberSearch').value || '').toLowerCase();
    const list = document.getElementById('membersList');

    let filtered = allMembers;

    if (currentFilter === 'with-chatid') {
        filtered = allMembers.filter(m => m.telegramChatId && m.telegramChatId.toString().trim() !== '');
    } else if (currentFilter === 'no-chatid') {
        filtered = allMembers.filter(m => !m.telegramChatId || m.telegramChatId.toString().trim() === '');
    }

    if (searchVal) {
        filtered = filtered.filter(m =>
            (m.name || '').toLowerCase().includes(searchVal) ||
            (m.contact || '').toLowerCase().includes(searchVal) ||
            (m.seat || '').toString().includes(searchVal)
        );
    }

    if (filtered.length === 0) {
        list.innerHTML = `<div class="no-data-msg">
            ${currentFilter === 'with-chatid' ? 'No members with Telegram Chat ID found.<br><small>Go to Members page and add chat IDs.</small>' : 'No members found.'}
        </div>`;
        updateSelectedCount();
        return;
    }

    list.innerHTML = filtered.map(m => {
        const hasChatId = m.telegramChatId && m.telegramChatId.toString().trim() !== '';
        const initials = (m.name || 'M').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
        const avatarHtml = m.photo
            ? `<img src="${m.photo}" alt="${escapeHtml(m.name)}">`
            : initials;

        return `<div class="member-item ${hasChatId ? '' : 'no-chatid'}" data-id="${m.id}">
            <input type="checkbox" class="member-checkbox" data-id="${m.id}" ${hasChatId ? '' : 'disabled'} onchange="updateSelectedCount()">
            <div class="member-avatar">${avatarHtml}</div>
            <div class="member-info">
                <div class="member-name">${escapeHtml(m.name || 'Unknown')}</div>
                <div class="member-meta">
                    ${m.contact ? `📱 ${escapeHtml(m.contact)}` : ''}
                    ${m.seat ? ` · 🪑 Seat ${m.seat}` : ''}
                    ${hasChatId ? ` · ID: ${m.telegramChatId}` : ''}
                </div>
            </div>
            <span class="chatid-badge ${hasChatId ? 'has' : 'none'}">
                ${hasChatId ? '✅ Chat ID' : '❌ No ID'}
            </span>
        </div>`;
    }).join('');

    updateSelectedCount();
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ---- Bot Status ----
function checkBotStatus() {
    const settings = JSON.parse(localStorage.getItem('librarySettings')) || {};
    const botToken = settings.telegramBotToken;
    const statusEl = document.getElementById('botStatus');
    const dotEl = statusEl.querySelector('.status-text');

    if (!botToken || botToken.trim() === '') {
        statusEl.className = 'bot-status not-configured';
        dotEl.textContent = 'Bot not configured';
        return;
    }

    fetch(`https://api.telegram.org/bot${botToken}/getMe`)
        .then(r => r.json())
        .then(data => {
            if (data.ok) {
                statusEl.className = 'bot-status configured';
                dotEl.textContent = `@${data.result.username} Ready`;
            } else {
                statusEl.className = 'bot-status not-configured';
                dotEl.textContent = 'Invalid bot token';
            }
        })
        .catch(() => {
            statusEl.className = 'bot-status not-configured';
            dotEl.textContent = 'Connection error';
        });
}

// ---- Message Type Tabs ----
function setupTabs() {
    document.querySelectorAll('.msg-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.msg-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.msg-panel').forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            currentMsgType = tab.dataset.type;
            document.getElementById(`panel-${currentMsgType}`).classList.add('active');
        });
    });

    // Char counter
    const textarea = document.getElementById('broadcastText');
    textarea.addEventListener('input', () => {
        document.getElementById('charCount').textContent = textarea.value.length;
    });
}

// ---- File Drop Zones ----
function setupFileDropZones() {
    setupDropZone('photoDropZone', 'photoInput', 'photo');
    setupDropZone('videoDropZone', 'videoInput', 'video');
    setupDropZone('documentDropZone', 'documentInput', 'document');

    document.getElementById('removePhoto').addEventListener('click', () => {
        selectedPhotoFile = null;
        document.getElementById('photoPreview').style.display = 'none';
        document.getElementById('photoDropZone').style.display = 'block';
        document.getElementById('photoInput').value = '';
    });

    document.getElementById('removeVideo').addEventListener('click', () => {
        selectedVideoFile = null;
        document.getElementById('videoPreview').style.display = 'none';
        document.getElementById('videoDropZone').style.display = 'block';
        document.getElementById('videoInput').value = '';
    });

    document.getElementById('removeDocument').addEventListener('click', () => {
        selectedDocumentFile = null;
        document.getElementById('documentInfo').style.display = 'none';
        document.getElementById('documentDropZone').style.display = 'block';
        document.getElementById('documentInput').value = '';
    });
}

function setupDropZone(zoneId, inputId, type) {
    const zone = document.getElementById(zoneId);
    const input = document.getElementById(inputId);

    zone.addEventListener('click', () => input.click());

    zone.addEventListener('dragover', e => {
        e.preventDefault();
        zone.classList.add('drag-over');
    });

    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));

    zone.addEventListener('drop', e => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file, type);
    });

    input.addEventListener('change', e => {
        const file = e.target.files[0];
        if (file) handleFileSelect(file, type);
    });
}

function handleFileSelect(file, type) {
    if (type === 'photo') {
        if (!file.type.startsWith('image/')) { alert('Please select an image file.'); return; }
        if (file.size > 10 * 1024 * 1024) { alert('Image must be under 10MB.'); return; }
        selectedPhotoFile = file;
        const reader = new FileReader();
        reader.onload = e => {
            document.getElementById('photoPreviewImg').src = e.target.result;
            document.getElementById('photoPreview').style.display = 'block';
            document.getElementById('photoDropZone').style.display = 'none';
        };
        reader.readAsDataURL(file);
    } else if (type === 'video') {
        if (!file.type.startsWith('video/')) { alert('Please select a video file.'); return; }
        if (file.size > 50 * 1024 * 1024) { alert('Video must be under 50MB.'); return; }
        selectedVideoFile = file;
        const url = URL.createObjectURL(file);
        document.getElementById('videoPreviewEl').src = url;
        document.getElementById('videoPreview').style.display = 'block';
        document.getElementById('videoDropZone').style.display = 'none';
    } else if (type === 'document') {
        if (file.size > 50 * 1024 * 1024) { alert('File must be under 50MB.'); return; }
        selectedDocumentFile = file;
        document.getElementById('documentName').textContent = file.name;
        document.getElementById('documentInfo').style.display = 'flex';
        document.getElementById('documentDropZone').style.display = 'none';
    }
}

// ---- Member Controls ----
function setupMemberControls() {
    document.getElementById('memberSearch').addEventListener('input', renderMembers);

    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.dataset.filter;
            renderMembers();
        });
    });

    document.getElementById('selectAllBtn').addEventListener('click', () => {
        document.querySelectorAll('.member-checkbox:not(:disabled)').forEach(cb => cb.checked = true);
        updateSelectedCount();
    });

    document.getElementById('deselectAllBtn').addEventListener('click', () => {
        document.querySelectorAll('.member-checkbox').forEach(cb => cb.checked = false);
        updateSelectedCount();
    });
}

// ---- Send Broadcast ----
function setupSendButton() {
    document.getElementById('sendBroadcastBtn').addEventListener('click', startBroadcast);
}

async function startBroadcast() {
    if (isSending) return;

    const settings = JSON.parse(localStorage.getItem('librarySettings')) || {};
    const botToken = settings.telegramBotToken;

    if (!botToken || botToken.trim() === '') {
        alert('❌ Telegram Bot Token not configured!\n\nGo to Settings → Telegram and add your bot token.');
        return;
    }

    const checkedBoxes = document.querySelectorAll('.member-checkbox:checked');
    if (checkedBoxes.length === 0) {
        alert('Please select at least one member to broadcast.');
        return;
    }

    // Validate content
    if (currentMsgType === 'text') {
        const text = document.getElementById('broadcastText').value.trim();
        if (!text) { alert('Please type a message to send.'); return; }
    } else if (currentMsgType === 'photo' && !selectedPhotoFile) {
        alert('Please select a photo to send.'); return;
    } else if (currentMsgType === 'video' && !selectedVideoFile) {
        alert('Please select a video to send.'); return;
    } else if (currentMsgType === 'document' && !selectedDocumentFile) {
        alert('Please select a document to send.'); return;
    }

    const memberIds = Array.from(checkedBoxes).map(cb => cb.dataset.id);
    const recipients = allMembers.filter(m => memberIds.includes(String(m.id)) && m.telegramChatId);

    if (recipients.length === 0) {
        alert('Selected members have no Telegram Chat ID.'); return;
    }

    if (!confirm(`Send broadcast to ${recipients.length} member(s)?`)) return;

    // Start sending
    isSending = true;
    const sendBtn = document.getElementById('sendBroadcastBtn');
    sendBtn.disabled = true;
    sendBtn.classList.add('sending');
    sendBtn.querySelector('.btn-text').textContent = 'Sending...';

    const progressCard = document.getElementById('progressCard');
    progressCard.style.display = 'block';
    progressCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    const progressBar = document.getElementById('progressBar');
    const progressLog = document.getElementById('progressLog');
    const sentCountEl = document.getElementById('sentCount');
    const failedCountEl = document.getElementById('failedCount');
    const totalSendCountEl = document.getElementById('totalSendCount');

    progressLog.innerHTML = '';
    totalSendCountEl.textContent = recipients.length;
    sentCountEl.textContent = '0';
    failedCountEl.textContent = '0';
    progressBar.style.width = '0%';

    addLogItem(progressLog, 'info', `📢 Starting broadcast to ${recipients.length} members...`);

    let sent = 0;
    let failed = 0;

    for (let i = 0; i < recipients.length; i++) {
        const member = recipients[i];
        const chatId = member.telegramChatId.toString().trim();

        try {
            let result;

            if (currentMsgType === 'text') {
                const text = document.getElementById('broadcastText').value.trim();
                result = await sendTelegramMessage(botToken, chatId, text);
            } else if (currentMsgType === 'photo') {
                const caption = document.getElementById('photoCaption').value.trim();
                result = await sendTelegramPhoto(botToken, chatId, selectedPhotoFile, caption);
            } else if (currentMsgType === 'video') {
                const caption = document.getElementById('videoCaption').value.trim();
                result = await sendTelegramVideo(botToken, chatId, selectedVideoFile, caption);
            } else if (currentMsgType === 'document') {
                const caption = document.getElementById('documentCaption').value.trim();
                result = await sendTelegramDocument(botToken, chatId, selectedDocumentFile, caption);
            }

            if (result && result.ok) {
                sent++;
                sentCountEl.textContent = sent;
                addLogItem(progressLog, 'success', `✅ ${escapeHtml(member.name)} — sent successfully`);
            } else {
                failed++;
                failedCountEl.textContent = failed;
                const errMsg = result ? result.description : 'Unknown error';
                addLogItem(progressLog, 'failed', `❌ ${escapeHtml(member.name)} — ${errMsg}`);
            }
        } catch (err) {
            failed++;
            failedCountEl.textContent = failed;
            addLogItem(progressLog, 'failed', `❌ ${escapeHtml(member.name)} — ${err.message}`);
        }

        const progress = Math.round(((i + 1) / recipients.length) * 100);
        progressBar.style.width = `${progress}%`;

        // Small delay to avoid rate limiting
        if (i < recipients.length - 1) {
            await sleep(350);
        }
    }

    addLogItem(progressLog, 'info', `🏁 Done! ✅ ${sent} sent, ❌ ${failed} failed`);

    isSending = false;
    sendBtn.classList.remove('sending');
    sendBtn.querySelector('.btn-text').textContent = 'Send Broadcast';
    updateSelectedCount();
}

function addLogItem(container, type, message) {
    const div = document.createElement('div');
    div.className = `log-item ${type}`;
    div.textContent = message;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ---- Telegram API Calls ----
async function sendTelegramMessage(botToken, chatId, text) {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' })
    });
    return res.json();
}

async function sendTelegramPhoto(botToken, chatId, file, caption) {
    const form = new FormData();
    form.append('chat_id', chatId);
    form.append('photo', file);
    if (caption) { form.append('caption', caption); form.append('parse_mode', 'HTML'); }
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, { method: 'POST', body: form });
    return res.json();
}

async function sendTelegramVideo(botToken, chatId, file, caption) {
    const form = new FormData();
    form.append('chat_id', chatId);
    form.append('video', file);
    if (caption) { form.append('caption', caption); form.append('parse_mode', 'HTML'); }
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendVideo`, { method: 'POST', body: form });
    return res.json();
}

async function sendTelegramDocument(botToken, chatId, file, caption) {
    const form = new FormData();
    form.append('chat_id', chatId);
    form.append('document', file);
    if (caption) { form.append('caption', caption); form.append('parse_mode', 'HTML'); }
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, { method: 'POST', body: form });
    return res.json();
}
