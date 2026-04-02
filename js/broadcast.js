/* =========================================
   BROADCAST PAGE — Main Logic
   ========================================= */

'use strict';

// ── State ──────────────────────────────────────────────────────────────────
var bcMembers   = [];
var bcFilter    = 'all';
var bcMsgType   = 'text';
var bcPhotoFile = null;
var bcVideoFile = null;
var bcDocFile   = null;
var bcSending   = false;

var BC_HISTORY_KEY = 'broadcastHistory';

// ── Bootstrap ──────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
    loadBcMembers();
    checkBotStatus();
    initTypeTabs();
    initTemplates();
    initUploads();
    initMemberControls();
    initSendButton();
    loadHistory();
    document.getElementById('clearHistoryBtn').addEventListener('click', clearHistory);
});

// ── Members ─────────────────────────────────────────────────────────────────
function loadBcMembers() {
    bcMembers = JSON.parse(localStorage.getItem('libraryMembers') || '[]');
    updateStats();
    renderMembers();
}

function updateStats() {
    var total   = bcMembers.length;
    var ready   = bcMembers.filter(function(m){ return hasChatId(m); }).length;
    var noid    = total - ready;
    var sel     = document.querySelectorAll('.m-cb:checked').length;

    document.getElementById('stat-total').textContent    = total;
    document.getElementById('stat-ready').textContent    = ready;
    document.getElementById('stat-no-id').textContent    = noid;
    document.getElementById('stat-selected').textContent = sel;

    var sendBtn = document.getElementById('sendBtn');
    sendBtn.disabled = (sel === 0 || bcSending);
}

function hasChatId(m) {
    return m.telegramChatId && String(m.telegramChatId).trim() !== '';
}

function renderMembers() {
    var q    = (document.getElementById('memberSearch').value || '').toLowerCase().trim();
    var list = bcMembers;

    if (bcFilter === 'ready')    list = list.filter(function(m){ return hasChatId(m); });
    if (bcFilter === 'active')   list = list.filter(function(m){ return m.status === 'active'; });
    if (bcFilter === 'inactive') list = list.filter(function(m){ return m.status !== 'active'; });

    if (q) {
        list = list.filter(function(m){
            return (m.name    || '').toLowerCase().includes(q) ||
                   (m.contact || '').toLowerCase().includes(q) ||
                   String(m.seat || '').includes(q);
        });
    }

    var container = document.getElementById('membersList');

    if (list.length === 0) {
        container.innerHTML = '<div class="no-members-msg">' +
            (bcFilter === 'ready'
                ? '😔 No members with Telegram Chat ID.<br><small>Add Chat IDs from the <a href="members.html" style="color:var(--primary-gold)">Members</a> page.</small>'
                : 'No members found.') +
            '</div>';
        updateStats();
        return;
    }

    container.innerHTML = list.map(function(m) {
        var chatId  = hasChatId(m);
        var initials = (m.name || 'M').trim().split(/\s+/).map(function(w){ return w[0]; }).join('').toUpperCase().slice(0, 2);
        var avatar  = m.photo
            ? '<img src="' + m.photo + '" alt="">'
            : initials;
        var badge   = chatId
            ? '<span class="m-badge ready">💬 Chat ID</span>'
            : '<span class="m-badge noid">No ID</span>';
        var status  = m.status === 'active'
            ? '<span class="m-badge active">Active</span>'
            : '';
        var sub     = [
            m.contact ? '📱 ' + esc(m.contact) : '',
            m.seat    ? '🪑 Seat ' + m.seat     : ''
        ].filter(Boolean).join(' · ');

        return '<div class="member-row' + (chatId ? '' : ' disabled') + '" data-id="' + m.id + '" onclick="toggleMember(this)">' +
            '<input type="checkbox" class="m-cb" data-id="' + m.id + '" ' + (chatId ? '' : 'disabled') + ' onclick="event.stopPropagation();countUpdate()">' +
            '<div class="m-av">' + avatar + '</div>' +
            '<div class="m-info">' +
                '<div class="m-name">' + esc(m.name || 'Unknown') + '</div>' +
                '<div class="m-sub">' + sub + '</div>' +
            '</div>' +
            badge + ' ' + status +
        '</div>';
    }).join('');

    updateStats();
}

function toggleMember(row) {
    if (row.classList.contains('disabled')) return;
    var cb = row.querySelector('.m-cb');
    cb.checked = !cb.checked;
    row.classList.toggle('checked', cb.checked);
    countUpdate();
}

function countUpdate() {
    updateStats();
}

// ── Bot Status ───────────────────────────────────────────────────────────────
function checkBotStatus() {
    var settings = JSON.parse(localStorage.getItem('librarySettings') || '{}');
    var token    = settings.telegramBotToken;
    var pill     = document.getElementById('botStatusPill');
    var txt      = document.getElementById('statusText');
    var warning  = document.getElementById('botWarning');

    if (!token || token.trim() === '') {
        pill.className = 'bot-status-pill err';
        txt.textContent = 'Bot not configured';
        warning.style.display = 'flex';
        return;
    }

    fetch('https://api.telegram.org/bot' + token + '/getMe')
        .then(function(r){ return r.json(); })
        .then(function(data){
            if (data.ok) {
                pill.className = 'bot-status-pill ok';
                txt.textContent = '@' + data.result.username + ' — Connected';
                warning.style.display = 'none';
            } else {
                pill.className = 'bot-status-pill err';
                txt.textContent = 'Invalid token';
                warning.style.display = 'flex';
            }
        })
        .catch(function(){
            pill.className = 'bot-status-pill err';
            txt.textContent = 'Connection error';
        });
}

// ── Type Tabs ────────────────────────────────────────────────────────────────
function initTypeTabs() {
    document.querySelectorAll('.type-btn').forEach(function(btn){
        btn.addEventListener('click', function(){
            document.querySelectorAll('.type-btn').forEach(function(b){ b.classList.remove('active'); });
            document.querySelectorAll('.msg-panel').forEach(function(p){ p.classList.remove('active'); });
            btn.classList.add('active');
            bcMsgType = btn.dataset.type;
            document.getElementById('panel-' + bcMsgType).classList.add('active');
            document.getElementById('templateRow').style.display = bcMsgType === 'text' ? 'flex' : 'none';
        });
    });

    var ta = document.getElementById('broadcastText');
    ta.addEventListener('input', function(){
        document.getElementById('charCount').textContent = ta.value.length;
    });
}

// ── Templates ────────────────────────────────────────────────────────────────
var TEMPLATES = {
    fee: '💰 <b>Fee Reminder</b>\n\nDear Member,\n\nThis is a reminder that your library fee for this month is due.\n\nPlease visit the library or contact us to make your payment.\n\nThank you! 🙏',
    holiday: '🎉 <b>Holiday Notice</b>\n\nDear Member,\n\nWe wish you a very Happy Holiday! 🎊\n\nThe library will be closed on this occasion and will resume normal hours shortly.\n\nStay safe and enjoy! 🌟',
    closed: '🔒 <b>Library Closed Today</b>\n\nDear Member,\n\nPlease note that the library will be <b>closed today</b> due to maintenance / holiday.\n\nWe will reopen as per our regular schedule.\n\nSorry for any inconvenience. Thank you for your understanding! 🙏',
    custom: '🌟 <b>Welcome to Our Library!</b>\n\nDear Member,\n\nThank you for being a valued member of our library family! 📚\n\nWe are always here to serve you with the best reading experience.\n\nHappy Reading! 📖✨'
};

function initTemplates() {
    document.querySelectorAll('.tmpl-btn').forEach(function(btn){
        btn.addEventListener('click', function(){
            var ta  = document.getElementById('broadcastText');
            var key = btn.dataset.tmpl;
            var settings = JSON.parse(localStorage.getItem('librarySettings') || '{}');
            var name = settings.libraryName || 'My Library';
            ta.value = TEMPLATES[key] + '\n\n📚 ' + name;
            document.getElementById('charCount').textContent = ta.value.length;
        });
    });
}

// ── File Uploads ──────────────────────────────────────────────────────────────
function initUploads() {
    setupZone('photoZone', 'photoFile', 'photo', 10);
    setupZone('videoZone', 'videoFile', 'video', 50);
    setupZone('docZone',   'docFile',   'document', 50);

    document.querySelectorAll('.remove-btn[data-remove]').forEach(function(btn){
        btn.addEventListener('click', function(e){
            e.stopPropagation();
            var type = btn.dataset.remove;
            removeFile(type);
        });
    });
}

function setupZone(zoneId, inputId, type, maxMB) {
    var zone  = document.getElementById(zoneId);
    var input = document.getElementById(inputId);

    zone.addEventListener('click', function(){ input.click(); });

    zone.addEventListener('dragover', function(e){
        e.preventDefault();
        zone.classList.add('drag-over');
    });
    zone.addEventListener('dragleave', function(){ zone.classList.remove('drag-over'); });
    zone.addEventListener('drop', function(e){
        e.preventDefault();
        zone.classList.remove('drag-over');
        var f = e.dataTransfer.files[0];
        if (f) handleFile(f, type, maxMB);
    });

    input.addEventListener('change', function(){
        var f = input.files[0];
        if (f) handleFile(f, type, maxMB);
    });
}

function handleFile(file, type, maxMB) {
    if (file.size > maxMB * 1024 * 1024) {
        showToast('File too large. Maximum ' + maxMB + 'MB allowed.', 'error');
        return;
    }

    if (type === 'photo') {
        if (!file.type.startsWith('image/')) { showToast('Please select an image file.', 'error'); return; }
        bcPhotoFile = file;
        var reader = new FileReader();
        reader.onload = function(e){
            document.getElementById('photoImg').src = e.target.result;
            document.getElementById('photoThumb').style.display = 'block';
            document.getElementById('photoZone').style.display = 'none';
        };
        reader.readAsDataURL(file);

    } else if (type === 'video') {
        if (!file.type.startsWith('video/')) { showToast('Please select a video file.', 'error'); return; }
        bcVideoFile = file;
        document.getElementById('videoEl').src = URL.createObjectURL(file);
        document.getElementById('videoThumb').style.display = 'block';
        document.getElementById('videoZone').style.display = 'none';

    } else if (type === 'document') {
        bcDocFile = file;
        document.getElementById('docName').textContent = file.name;
        document.getElementById('docInfo').style.display = 'flex';
        document.getElementById('docZone').style.display = 'none';
    }
}

function removeFile(type) {
    if (type === 'photo') {
        bcPhotoFile = null;
        document.getElementById('photoThumb').style.display = 'none';
        document.getElementById('photoZone').style.display = 'block';
        document.getElementById('photoFile').value = '';
    } else if (type === 'video') {
        bcVideoFile = null;
        document.getElementById('videoThumb').style.display = 'none';
        document.getElementById('videoZone').style.display = 'block';
        document.getElementById('videoFile').value = '';
    } else if (type === 'document') {
        bcDocFile = null;
        document.getElementById('docInfo').style.display = 'none';
        document.getElementById('docZone').style.display = 'block';
        document.getElementById('docFile').value = '';
    }
}

// ── Member Controls ───────────────────────────────────────────────────────────
function initMemberControls() {
    document.getElementById('memberSearch').addEventListener('input', renderMembers);

    document.querySelectorAll('.mf-tab').forEach(function(tab){
        tab.addEventListener('click', function(){
            document.querySelectorAll('.mf-tab').forEach(function(t){ t.classList.remove('active'); });
            tab.classList.add('active');
            bcFilter = tab.dataset.mf;
            renderMembers();
        });
    });

    document.getElementById('selectReadyBtn').addEventListener('click', function(){
        document.querySelectorAll('.m-cb:not(:disabled)').forEach(function(cb){
            cb.checked = true;
            var row = cb.closest('.member-row');
            if (row) row.classList.add('checked');
        });
        countUpdate();
    });

    document.getElementById('deselectBtn').addEventListener('click', function(){
        document.querySelectorAll('.m-cb').forEach(function(cb){
            cb.checked = false;
            var row = cb.closest('.member-row');
            if (row) row.classList.remove('checked');
        });
        countUpdate();
    });
}

// ── Send Broadcast ────────────────────────────────────────────────────────────
function initSendButton() {
    document.getElementById('sendBtn').addEventListener('click', startBroadcast);
}

async function startBroadcast() {
    if (bcSending) return;

    var settings = JSON.parse(localStorage.getItem('librarySettings') || '{}');
    var token    = settings.telegramBotToken;

    if (!token || token.trim() === '') {
        showToast('Telegram Bot Token not configured. Go to Settings.', 'error');
        return;
    }

    var checked = document.querySelectorAll('.m-cb:checked');
    if (checked.length === 0) {
        showToast('Please select at least one member.', 'warning');
        return;
    }

    // Validate content
    var valid = true;
    if (bcMsgType === 'text') {
        if (!document.getElementById('broadcastText').value.trim()) {
            showToast('Please type a message.', 'warning');
            valid = false;
        }
    } else if (bcMsgType === 'photo' && !bcPhotoFile) {
        showToast('Please select a photo to send.', 'warning');
        valid = false;
    } else if (bcMsgType === 'video' && !bcVideoFile) {
        showToast('Please select a video to send.', 'warning');
        valid = false;
    } else if (bcMsgType === 'document' && !bcDocFile) {
        showToast('Please select a document to send.', 'warning');
        valid = false;
    }
    if (!valid) return;

    var ids        = Array.from(checked).map(function(cb){ return String(cb.dataset.id); });
    var recipients = bcMembers.filter(function(m){ return ids.includes(String(m.id)) && hasChatId(m); });

    if (recipients.length === 0) {
        showToast('Selected members have no Telegram Chat ID.', 'error');
        return;
    }

    if (!confirm('Send broadcast to ' + recipients.length + ' member(s)?')) return;

    // ── Begin ──
    bcSending = true;
    var sendBtn = document.getElementById('sendBtn');
    sendBtn.disabled = true;
    sendBtn.classList.add('sending');
    sendBtn.innerHTML = '<div class="spinner"></div><span id="sendBtnText">Sending... 0/' + recipients.length + '</span>';

    var card = document.getElementById('progressCard');
    card.style.display = 'block';
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    var pBar  = document.getElementById('progressBar');
    var pPct  = document.getElementById('progressPct');
    var pLog  = document.getElementById('progressLog');
    var cSent = document.getElementById('cntSent');
    var cFail = document.getElementById('cntFailed');
    var cTot  = document.getElementById('cntTotal');

    pLog.innerHTML = '';
    cSent.textContent  = '0';
    cFail.textContent  = '0';
    cTot.textContent   = recipients.length;
    pBar.style.width   = '0%';
    pPct.textContent   = '0%';

    addLog(pLog, 'info', '📢 Broadcast started to ' + recipients.length + ' recipients...');

    var sent = 0, failed = 0;

    for (var i = 0; i < recipients.length; i++) {
        var m      = recipients[i];
        var chatId = String(m.telegramChatId).trim();

        try {
            var result;
            if (bcMsgType === 'text') {
                result = await tgSendMessage(token, chatId, document.getElementById('broadcastText').value.trim());
            } else if (bcMsgType === 'photo') {
                result = await tgSendPhoto(token, chatId, bcPhotoFile, document.getElementById('photoCaption').value.trim());
            } else if (bcMsgType === 'video') {
                result = await tgSendVideo(token, chatId, bcVideoFile, document.getElementById('videoCaption').value.trim());
            } else if (bcMsgType === 'document') {
                result = await tgSendDocument(token, chatId, bcDocFile, document.getElementById('docCaption').value.trim());
            }

            if (result && result.ok) {
                sent++;
                cSent.textContent = sent;
                addLog(pLog, 'ok', '✅ ' + esc(m.name) + ' — sent');
            } else {
                failed++;
                cFail.textContent = failed;
                var errDesc = (result && result.description) ? result.description : 'Unknown error';
                addLog(pLog, 'err', '❌ ' + esc(m.name) + ' — ' + errDesc);
            }
        } catch (ex) {
            failed++;
            cFail.textContent = failed;
            addLog(pLog, 'err', '❌ ' + esc(m.name) + ' — ' + ex.message);
        }

        var pct = Math.round(((i + 1) / recipients.length) * 100);
        pBar.style.width    = pct + '%';
        pPct.textContent    = pct + '%';
        document.getElementById('sendBtnText').textContent = 'Sending... ' + (i + 1) + '/' + recipients.length;

        if (i < recipients.length - 1) await sleep(400);
    }

    // ── Done ──
    addLog(pLog, 'info', '🏁 Finished — ✅ ' + sent + ' sent  ❌ ' + failed + ' failed');

    if (sent > 0) showToast('Broadcast complete! ' + sent + ' messages sent.', 'success');
    if (failed > 0) showToast(failed + ' message(s) failed to send.', 'error');

    // Save to history
    var preview = getMessagePreview();
    saveBcHistory({
        type   : bcMsgType,
        preview: preview,
        total  : recipients.length,
        sent   : sent,
        failed : failed,
        time   : new Date().toISOString()
    });
    loadHistory();

    bcSending = false;
    sendBtn.classList.remove('sending');
    sendBtn.innerHTML = '<span id="sendBtnIcon">🚀</span><span id="sendBtnText">Send Broadcast</span>';
    updateStats();
}

function getMessagePreview() {
    if (bcMsgType === 'text') {
        var t = document.getElementById('broadcastText').value.trim();
        return t.replace(/<[^>]+>/g, '').slice(0, 60) || 'Text message';
    }
    if (bcMsgType === 'photo')    return '📷 ' + (bcPhotoFile ? bcPhotoFile.name : 'Photo');
    if (bcMsgType === 'video')    return '🎥 ' + (bcVideoFile ? bcVideoFile.name : 'Video');
    if (bcMsgType === 'document') return '📎 ' + (bcDocFile   ? bcDocFile.name   : 'Document');
    return '';
}

// ── History ───────────────────────────────────────────────────────────────────
function saveBcHistory(entry) {
    var hist = JSON.parse(localStorage.getItem(BC_HISTORY_KEY) || '[]');
    hist.unshift(entry);
    if (hist.length > 20) hist = hist.slice(0, 20);
    localStorage.setItem(BC_HISTORY_KEY, JSON.stringify(hist));
}

function loadHistory() {
    var hist = JSON.parse(localStorage.getItem(BC_HISTORY_KEY) || '[]');
    var el   = document.getElementById('historyList');

    if (hist.length === 0) {
        el.innerHTML = '<div class="empty-hist">No broadcasts sent yet</div>';
        return;
    }

    var icons = { text: '💬', photo: '🖼️', video: '🎥', document: '📎' };

    el.innerHTML = hist.map(function(h){
        var d = new Date(h.time);
        var dt = d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) +
                 ' ' + d.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
        var ok = h.failed === 0;
        return '<div class="hist-item">' +
            '<div class="hist-icon">' + (icons[h.type] || '📢') + '</div>' +
            '<div class="hist-body">' +
                '<div class="hist-msg">' + esc(h.preview) + '</div>' +
                '<div class="hist-meta">📅 ' + dt + ' · ✅ ' + h.sent + ' sent · ❌ ' + h.failed + ' failed · 👥 ' + h.total + ' total</div>' +
            '</div>' +
            '<span class="hist-badge ' + (ok ? 'ok' : 'err') + '">' + (ok ? 'Done' : 'Partial') + '</span>' +
        '</div>';
    }).join('');
}

function clearHistory() {
    if (!confirm('Clear all broadcast history?')) return;
    localStorage.removeItem(BC_HISTORY_KEY);
    loadHistory();
    showToast('History cleared.', 'info');
}

// ── Telegram API ──────────────────────────────────────────────────────────────
function tgSendMessage(token, chatId, text) {
    return fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: 'HTML' })
    }).then(function(r){ return r.json(); });
}

function tgSendPhoto(token, chatId, file, caption) {
    var fd = new FormData();
    fd.append('chat_id', chatId);
    fd.append('photo', file);
    if (caption) { fd.append('caption', caption); fd.append('parse_mode', 'HTML'); }
    return fetch('https://api.telegram.org/bot' + token + '/sendPhoto', { method:'POST', body:fd })
        .then(function(r){ return r.json(); });
}

function tgSendVideo(token, chatId, file, caption) {
    var fd = new FormData();
    fd.append('chat_id', chatId);
    fd.append('video', file);
    if (caption) { fd.append('caption', caption); fd.append('parse_mode', 'HTML'); }
    return fetch('https://api.telegram.org/bot' + token + '/sendVideo', { method:'POST', body:fd })
        .then(function(r){ return r.json(); });
}

function tgSendDocument(token, chatId, file, caption) {
    var fd = new FormData();
    fd.append('chat_id', chatId);
    fd.append('document', file);
    if (caption) { fd.append('caption', caption); fd.append('parse_mode', 'HTML'); }
    return fetch('https://api.telegram.org/bot' + token + '/sendDocument', { method:'POST', body:fd })
        .then(function(r){ return r.json(); });
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function showToast(msg, type) {
    var c    = document.getElementById('toastContainer');
    var div  = document.createElement('div');
    var icons = { success:'✅', error:'❌', info:'ℹ️', warning:'⚠️' };
    div.className = 'toast ' + (type || 'info');
    div.innerHTML = '<span>' + (icons[type] || '📢') + '</span><span>' + esc(msg) + '</span>';
    c.appendChild(div);
    setTimeout(function(){
        div.style.animation = 'toastOut 0.3s ease forwards';
        setTimeout(function(){ if (div.parentNode) div.parentNode.removeChild(div); }, 320);
    }, 3500);
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function esc(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g,'&amp;').replace(/</g,'&lt;')
        .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function sleep(ms) {
    return new Promise(function(res){ setTimeout(res, ms); });
}

function addLog(container, type, message) {
    var div = document.createElement('div');
    div.className = 'log-entry ' + type;
    div.textContent = message;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}
