(function () {
  const state = {
    currentChatId: null,
    chats: [],
    username: '',
    displayName: '',
    avatarUrl: '',
    plan: 'basic',
    messageCount: 0,
    messageLimit: 50,
    limitReached: false,
    sidebarCollapsed: false,
    mobileSidebarOpen: false,
  };

  let emptySuggestAnimated = false;
  let userScrolledUp = false;

  const els = {};

  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(text) {
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
  }

  function updateUserScrolledUpState() {
    const thread = els.messagesThread;
    if (!thread) {
      userScrolledUp = false;
      return;
    }
    const distanceFromBottom = thread.scrollHeight - thread.scrollTop - thread.clientHeight;
    userScrolledUp = distanceFromBottom > 100;
  }

  function formatTime(ts) {
    if (!ts) return '';
    try {
      const d = new Date(ts.replace(' ', 'T'));
      return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
    } catch {
      return '';
    }
  }

  function historyGroupLabel(updatedAt) {
    if (!updatedAt) return 'OLDER';
    const d = new Date(updatedAt.replace(' ', 'T'));
    if (Number.isNaN(d.getTime())) return 'OLDER';
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    const weekAgo = new Date(startOfToday);
    weekAgo.setDate(weekAgo.getDate() - 7);
    if (d >= startOfToday) return 'TODAY';
    if (d >= startOfYesterday) return 'YESTERDAY';
    if (d >= weekAgo) return 'LAST 7 DAYS';
    return 'OLDER';
  }

  function renderMarkdown(text) {
    if (!text) return '';
    if (typeof DOMPurify === 'undefined') {
      return escapeHtml(text).replace(/\n/g, '<br/>');
    }
    var raw = '';
    try {
      if (typeof marked !== 'undefined' && typeof marked.parse === 'function') {
        raw = marked.parse(text, { breaks: true });
      } else if (typeof marked === 'function') {
        raw = marked(text);
      } else {
        return escapeHtml(text).replace(/\n/g, '<br/>');
      }
      return DOMPurify.sanitize(raw);
    } catch (_) {
      return escapeHtml(text).replace(/\n/g, '<br/>');
    }
  }

  function animMessage(el, fromRight) {
    if (typeof gsap === 'undefined' || !el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.from(el, {
      x: fromRight ? 28 : -28,
      opacity: 0,
      duration: 0.42,
      ease: 'power2.out',
      delay: fromRight ? 0 : 0.06,
    });
  }

  function updateMembershipBar() {
    const bar = els.membershipBar;
    const limitBlock = $('limit-reached-block');
    const composerRow = $('composer-row');
    if (!bar) return;
    const isPro = state.plan === 'pro' || state.messageLimit == null;
    if (isPro) {
      bar.classList.add('hidden');
      limitBlock?.classList.add('hidden');
      composerRow?.classList.remove('hidden');
      return;
    }
    bar.classList.remove('hidden');
    const used = state.messageCount;
    const limit = state.messageLimit || 50;
    const pct = Math.min(100, Math.round((used / limit) * 100));
    const textEl = $('membership-text');
    const fill = $('membership-fill');
    const warn = $('membership-warn');
    if (textEl) textEl.textContent = used + ' / ' + limit + ' messages used this month';
    if (fill) fill.style.width = pct + '%';
    const remaining = limit - used;
    const atLimit = used >= limit || state.limitReached;
    if (atLimit) {
      limitBlock?.classList.remove('hidden');
      composerRow?.classList.add('hidden');
      if (warn) {
        warn.textContent = '';
        warn.classList.add('hidden');
      }
    } else {
      limitBlock?.classList.add('hidden');
      composerRow?.classList.remove('hidden');
      if (warn) {
        if (remaining <= 5 && remaining > 0) {
          warn.textContent =
            String(remaining) + ' message' + (remaining === 1 ? '' : 's') + ' remaining — Upgrade to Pro';
          warn.classList.remove('hidden');
        } else {
          warn.textContent = '';
          warn.classList.add('hidden');
        }
      }
    }
    const input = els.messageInput;
    const send = els.sendBtn;
    if (atLimit) {
      if (input) {
        input.disabled = true;
        input.placeholder = 'Monthly limit reached';
      }
      if (send) send.disabled = true;
    } else {
      state.limitReached = false;
      if (input) {
        input.disabled = false;
        input.placeholder = 'Message NeuraChat...';
      }
      syncSendDisabled();
    }
  }

  function syncSendDisabled() {
    const send = els.sendBtn;
    const input = els.messageInput;
    if (!send || !input) return;
    const empty = !input.value.trim();
    send.disabled = empty || input.disabled;
  }

  function resizeTextarea() {
    const ta = els.messageInput;
    if (!ta) return;
    ta.style.height = 'auto';
    const max = 120;
    ta.style.height = Math.min(ta.scrollHeight, max) + 'px';
  }

  function setEmptyStateVisible(show) {
    const empty = els.emptyState;
    const thread = els.messagesThread;
    if (empty) empty.classList.toggle('hidden', !show);
    if (thread) thread.classList.toggle('hidden', show);
    if (!show) {
      emptySuggestAnimated = false;
      return;
    }
    if (
      show &&
      typeof gsap !== 'undefined' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      empty &&
      !emptySuggestAnimated
    ) {
      const cards = empty.querySelectorAll('.suggest-card');
      if (cards.length) {
        emptySuggestAnimated = true;
        gsap.fromTo(
          cards,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.38, stagger: 0.07, ease: 'power2.out', delay: 0.05 }
        );
      }
    }
  }

  function refreshTitle() {
    const t = $('chat-title-text');
    if (!t) return;
    if (!state.currentChatId) {
      t.textContent = 'New chat';
      return;
    }
    const chat = state.chats.find(function (c) {
      return c.chat_id === state.currentChatId;
    });
    t.textContent = (chat && chat.title) || 'Chat';
  }

  function renderHistory() {
    const root = els.historyRoot;
    if (!root) return;
    const groups = {};
    state.chats.forEach(function (c) {
      const label = historyGroupLabel(c.updated_at);
      if (!groups[label]) groups[label] = [];
      groups[label].push(c);
    });
    const order = ['TODAY', 'YESTERDAY', 'LAST 7 DAYS', 'OLDER'];
    let html = '';
    order.forEach(function (label) {
      const items = groups[label];
      if (!items || !items.length) return;
      html +=
        '<div class="mb-4 px-1"><p class="text-[10px] font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">' +
        escapeHtml(label) +
        '</p><ul class="space-y-0.5">';
      items.forEach(function (chat) {
        const active = chat.chat_id === state.currentChatId;
        html +=
          '<li class="group flex items-stretch gap-0.5 rounded-xl py-0.5">' +
          '<button type="button" class="chat-history-item flex min-w-0 flex-1 items-center gap-2 rounded-xl py-2.5 pl-2 pr-2 text-left text-sm text-[var(--text-primary)] ' +
          (active ? 'is-active' : 'hover:bg-[var(--bg-hover)]') +
          '" data-chat-id="' +
          escapeHtml(chat.chat_id) +
          '">' +
          '<span class="min-w-0 flex-1 truncate">' +
          escapeHtml(chat.title || 'Untitled') +
          '</span></button>' +
          '<button type="button" class="shrink-0 self-center rounded-lg p-2 text-[var(--text-muted)] opacity-0 transition-opacity hover:bg-[var(--bg-surface-2)] hover:text-red-400 group-hover:opacity-100" data-delete-chat="' +
          escapeHtml(chat.chat_id) +
          '" aria-label="Delete chat">' +
          '<i data-lucide="trash-2" class="h-4 w-4"></i>' +
          '</button></li>';
      });
      html += '</ul></div>';
    });
    root.innerHTML = html || '<p class="px-2 text-xs text-[var(--text-muted)]">No chats yet</p>';
    if (window.lucide) lucide.createIcons();
    root.querySelectorAll('[data-chat-id]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        loadMessages(btn.getAttribute('data-chat-id'));
        closeMobileSidebar();
      });
    });
    root.querySelectorAll('[data-delete-chat]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        deleteChatById(btn.getAttribute('data-delete-chat'));
      });
    });
  }

  async function deleteChatById(chatId) {
    if (!chatId) return;
    try {
      const res = await fetch('/api/chats/' + encodeURIComponent(chatId) + '/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!data.success) {
        if (window.Toast) Toast.show('Could not delete chat.', 'error');
        return;
      }
      if (state.currentChatId === chatId) {
        state.currentChatId = null;
        if (els.messagesThread) els.messagesThread.innerHTML = '';
        refreshTitle();
        emptySuggestAnimated = false;
        setEmptyStateVisible(true);
      }
      await loadChats();
    } catch {
      if (window.Toast) Toast.show('Could not delete chat.', 'error');
    }
  }

  async function loadChats() {
    try {
      const res = await fetch('/api/chats', { credentials: 'same-origin' });
      const data = await res.json();
      if (data.success && data.chats) state.chats = data.chats;
      else state.chats = [];
      renderHistory();
      refreshTitle();
    } catch {
      state.chats = [];
      renderHistory();
    }
  }

  function appendUserBubble(text, ts) {
    const thread = els.messagesThread;
    if (!thread) return;
    const wrap = document.createElement('div');
    wrap.className = 'chat-msg-user-wrap mb-4 flex justify-end';
    wrap.innerHTML =
      '<div class="max-w-[min(85%,42rem)]">' +
      '<div class="chat-msg-user inline-block rounded-2xl bg-[var(--accent)] px-4 py-2.5 text-left text-sm font-medium text-white shadow-sm">' +
      escapeHtml(text).replace(/\n/g, '<br/>') +
      '</div>' +
      '<p class="chat-msg-time mt-1 text-right text-[10px] text-[var(--text-muted)]">' +
      escapeHtml(formatTime(ts) || formatTime(new Date().toISOString())) +
      '</p></div>';
    thread.appendChild(wrap);
    animMessage(wrap, true);
    setEmptyStateVisible(false);
    thread.scrollTop = thread.scrollHeight;
  }

  function appendAiBubble(html, ts, rawForCopy) {
    const thread = els.messagesThread;
    if (!thread) return;
    const wrap = document.createElement('div');
    wrap.className = 'chat-msg-ai-wrap mb-4 flex justify-start';
    const raw = rawForCopy || '';
    wrap.innerHTML =
      '<div class="max-w-[min(90%,48rem)] rounded-2xl border border-[var(--border)] bg-[var(--bg-surface-2)] px-4 py-3 chat-msg-ai">' +
      '<div class="chat-markdown">' +
      html +
      '</div>' +
      '<div class="mt-3 flex items-center justify-between gap-2 border-t border-[var(--border)] pt-2">' +
      '<span class="text-[10px] text-[var(--text-muted)]">' +
      escapeHtml(formatTime(ts) || '') +
      '</span>' +
      '<button type="button" class="rounded-lg p-1.5 text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--accent)]" aria-label="Copy">' +
      '<i data-lucide="copy" class="h-4 w-4"></i></button></div></div>';
    thread.appendChild(wrap);
    animMessage(wrap, false);
    const copyBtn = wrap.querySelector('button[aria-label="Copy"]');
    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        navigator.clipboard.writeText(raw).then(function () {
          copyBtn.innerHTML = '<i data-lucide="check" class="h-4 w-4 text-emerald-400"></i>';
          if (window.lucide) lucide.createIcons();
          setTimeout(function () {
            copyBtn.innerHTML = '<i data-lucide="copy" class="h-4 w-4"></i>';
            if (window.lucide) lucide.createIcons();
          }, 2000);
        });
      });
    }
    if (window.lucide) lucide.createIcons();
    if (!userScrolledUp) {
      wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function showTyping() {
    const thread = els.messagesThread;
    if (!thread) return;
    const row = document.createElement('div');
    row.id = 'typing-indicator-row';
    row.className = 'chat-msg-ai-wrap mb-4 flex justify-start';
    row.innerHTML =
      '<div class="inline-flex items-center gap-1.5 rounded-2xl border border-[var(--border)] bg-[var(--bg-surface-2)] px-5 py-3">' +
      '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span></div>';
    thread.appendChild(row);
    if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.from(row, { opacity: 0, duration: 0.25 });
    }
    if (!userScrolledUp) {
      row.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function removeTyping() {
    $('typing-indicator-row')?.remove();
  }

  async function loadMessages(chatId) {
    state.currentChatId = chatId;
    renderHistory();
    const thread = els.messagesThread;
    if (!thread) return;
    thread.innerHTML = '';
    try {
      const res = await fetch('/api/chats/' + encodeURIComponent(chatId) + '/messages', { credentials: 'same-origin' });
      const data = await res.json();
      if (data.success && data.messages && data.messages.length) {
        data.messages.forEach(function (msg) {
          const role = msg.role;
          if (role === 'user') appendUserBubble(msg.content, msg.timestamp);
          else if (role === 'assistant' || role === 'model') {
            appendAiBubble(renderMarkdown(msg.content), msg.timestamp, msg.content);
          }
        });
        setEmptyStateVisible(false);
      } else {
        emptySuggestAnimated = false;
        setEmptyStateVisible(true);
      }
      thread.scrollTop = thread.scrollHeight;
    } catch {
      if (window.Toast) Toast.show('Could not load messages.', 'error');
    }
  }

  async function fetchProfile() {
    try {
      const res = await fetch('/api/profile', { credentials: 'same-origin' });
      const d = await res.json();
      if (!d.success) return;
      state.username = d.username || '';
      state.plan = d.plan || 'basic';
      state.messageCount = Number(d.message_count) || 0;
      state.messageLimit = d.message_limit == null ? null : d.message_limit;
      const p = d.profile || {};
      state.displayName = p.display_name || state.username;
      state.avatarUrl =
        p.avatar_url ||
        'https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(state.username || 'user');
      const av = $('sidebar-avatar');
      const nameEl = $('sidebar-username');
      const badge = $('sidebar-plan-badge');
      if (av) av.src = state.avatarUrl;
      if (nameEl) nameEl.textContent = state.displayName;
      if (badge) {
        badge.textContent = state.plan === 'pro' ? 'PRO' : 'FREE';
        badge.className =
          'mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ' +
          (state.plan === 'pro'
            ? 'bg-[var(--accent)]/20 text-[var(--accent)]'
            : 'bg-[var(--bg-surface-2)] text-[var(--text-muted)]');
      }
      if (state.messageLimit != null && state.messageLimit > 0) {
        state.limitReached = state.messageCount >= state.messageLimit;
      }
      updateMembershipBar();
    } catch (_) {}
  }

  async function sendMessage(prefill) {
    const input = els.messageInput;
    const text = (prefill != null ? prefill : input && input.value) || '';
    const message = String(text).trim();
    if (!message || !input || input.disabled) return;

    appendUserBubble(message, null);
    input.value = '';
    resizeTextarea();
    syncSendDisabled();

    showTyping();

    try {
      if (!state.currentChatId) {
        const newRes = await fetch('/api/chats/new', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ title: message.slice(0, 48) || 'New chat' }),
        });
        const newData = await newRes.json();
        if (newData.success) {
          state.currentChatId = newData.chat_id;
          await loadChats();
          refreshTitle();
        }
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ message: message, chat_id: state.currentChatId }),
      });
      const data = await res.json();
      removeTyping();

      if (data.limit_reached) {
        state.limitReached = true;
        appendAiBubble(renderMarkdown(data.response), null, data.response);
      } else {
        appendAiBubble(renderMarkdown(data.response), null, data.response);
      }
      await fetchProfile();
      updateMembershipBar();
    } catch {
      removeTyping();
      appendAiBubble(
        renderMarkdown('Something went wrong. Please try again.'),
        null,
        'Something went wrong. Please try again.'
      );
    }

  }

  function newChat() {
    state.currentChatId = null;
    state.limitReached = false;
    emptySuggestAnimated = false;
    if (els.messagesThread) els.messagesThread.innerHTML = '';
    refreshTitle();
    setEmptyStateVisible(true);
    loadChats();
    closeMobileSidebar();
    updateMembershipBar();
  }

  function toggleDesktopCollapse() {
    const sb = els.sidebar;
    if (!sb) return;
    state.sidebarCollapsed = !state.sidebarCollapsed;
    sb.classList.toggle('is-desktop-collapsed', state.sidebarCollapsed);
    const tab = $('sidebar-expand');
    if (tab) tab.classList.toggle('is-visible', state.sidebarCollapsed);
    if (tab && typeof gsap !== 'undefined' && window.innerWidth >= 1024 && state.sidebarCollapsed) {
      gsap.fromTo(tab, { x: -8, opacity: 0 }, { x: 0, opacity: 1, duration: 0.25, ease: 'power2.out' });
    }
    if (window.lucide) lucide.createIcons();
  }

  function openMobileSidebar() {
    if (window.innerWidth >= 1024) return;
    state.mobileSidebarOpen = true;
    els.sidebar.classList.add('is-mobile-open');
    $('sidebar-backdrop')?.classList.add('is-open');
    document.body.classList.add('overflow-hidden');
    if (typeof gsap !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo(els.sidebar, { opacity: 0.9 }, { opacity: 1, duration: 0.28, ease: 'power1.out' });
    }
  }

  function closeMobileSidebar() {
    state.mobileSidebarOpen = false;
    els.sidebar?.classList.remove('is-mobile-open');
    $('sidebar-backdrop')?.classList.remove('is-open');
    document.body.classList.remove('overflow-hidden');
    if (typeof gsap !== 'undefined' && els.sidebar) {
      gsap.set(els.sidebar, { clearProps: 'opacity' });
    }
  }

  function onResize() {
    if (window.innerWidth >= 1024) {
      closeMobileSidebar();
      if (typeof gsap !== 'undefined' && els.sidebar) {
        gsap.killTweensOf(els.sidebar);
        gsap.set(els.sidebar, { clearProps: 'opacity' });
      }
    }
  }

  function beginTitleEdit() {
    if (!state.currentChatId) return;
    const span = $('chat-title-text');
    const inp = $('chat-title-input');
    if (!span || !inp) return;
    span.classList.add('hidden');
    inp.classList.remove('hidden');
    inp.value = span.textContent.trim();
    inp.focus();
    inp.select();
  }

  function endTitleEdit(save) {
    const span = $('chat-title-text');
    const inp = $('chat-title-input');
    if (!span || !inp || inp.classList.contains('hidden')) return;
    inp.classList.add('hidden');
    span.classList.remove('hidden');
    if (!save || !state.currentChatId) return;
    const title = inp.value.trim();
    if (!title) return;
    fetch('/api/chats/' + encodeURIComponent(state.currentChatId) + '/rename', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ title: title }),
    })
      .then(function (r) {
        return r.json();
      })
      .then(function (d) {
        if (d.success) {
          span.textContent = title;
          loadChats();
        } else if (window.Toast) Toast.show('Could not rename chat.', 'error');
      })
      .catch(function () {
        if (window.Toast) Toast.show('Could not rename chat.', 'error');
      });
  }

  function bind() {
    els.sidebar = $('chat-sidebar');
    els.historyRoot = $('chat-history-groups');
    els.messagesThread = $('messages-thread');
    els.emptyState = $('empty-state');
    els.messageInput = $('message-input');
    els.sendBtn = $('btn-send');
    els.membershipBar = $('membership-bar');

    if (els.messagesThread) {
      els.messagesThread.addEventListener('scroll', updateUserScrolledUpState);
      updateUserScrolledUpState();
    }

    $('btn-new-chat')?.addEventListener('click', newChat);
    $('btn-sidebar-toggle')?.addEventListener('click', openMobileSidebar);
    $('sidebar-backdrop')?.addEventListener('click', closeMobileSidebar);
    $('btn-sidebar-collapse')?.addEventListener('click', toggleDesktopCollapse);
    $('sidebar-expand')?.addEventListener('click', function () {
      toggleDesktopCollapse();
    });

    $('chat-title-text')?.addEventListener('dblclick', beginTitleEdit);
    const titleInp = $('chat-title-input');
    titleInp?.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        endTitleEdit(true);
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        endTitleEdit(false);
      }
    });
    titleInp?.addEventListener('blur', function () {
      endTitleEdit(true);
    });

    els.messageInput?.addEventListener('input', function () {
      const n = els.messageInput.value.length;
      const c = $('char-count');
      if (c) c.textContent = n;
      resizeTextarea();
      syncSendDisabled();
    });

    els.messageInput?.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    els.sendBtn?.addEventListener('click', function () {
      sendMessage();
    });

    document.querySelectorAll('.suggest-card').forEach(function (card) {
      card.addEventListener('click', function () {
        const t = card.getAttribute('data-prompt') || card.textContent;
        sendMessage(t);
      });
    });

    var upgradeToast = function () {
      if (window.Toast) Toast.show('Payment integration coming soon.', 'info');
    };
    $('btn-upgrade-chat')?.addEventListener('click', upgradeToast);
    $('btn-upgrade-limit')?.addEventListener('click', upgradeToast);
  }

  function init() {
    bind();
    window.addEventListener('resize', onResize);
    refreshTitle();
    setEmptyStateVisible(true);
    fetchProfile();
    loadChats();
    if (window.lucide) lucide.createIcons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
