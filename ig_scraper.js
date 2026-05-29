(async function () {
  const $ = (s, root = document) => root.querySelector(s);
  const csrfToken = () =>
    document.cookie.split('; ').find(c => c.startsWith('csrftoken='))?.split('=')[1] || '';

  const baseHeaders = () => ({
    'x-csrftoken': csrfToken(),
    'x-ig-app-id': '936619743392459',
    'x-ig-www-claim': sessionStorage.getItem('www-claim-v2') || '0',
    'x-requested-with': 'XMLHttpRequest',
    accept: '*/*',
  });

  const apiFetch = async (url, opts = {}) => {
    const r = await fetch(url, {
      headers: { ...baseHeaders(), ...(opts.headers || {}) },
      method: opts.method || 'GET',
      body: opts.body,
      credentials: 'include',
    });
    const text = await r.text();
    if (!text || !text.trim()) throw new Error(`empty response (HTTP ${r.status})`);
    const trimmed = text.trim();
    if (trimmed[0] !== '{' && trimmed[0] !== '[') {
      throw new Error(`HTTP ${r.status} - not json: ${trimmed.slice(0, 120)}`);
    }
    try {
      return JSON.parse(trimmed);
    } catch {
      throw new Error(`parse error (${r.status}): ${trimmed.slice(0, 160)}`);
    }
  };

  const webSearch = query =>
    apiFetch(
      `/api/v1/web/search/topsearch/?context=blended&query=${encodeURIComponent(query)}&include_reel=false`
    );

  document.getElementById('__ig_dm_tool__')?.remove();
  document.getElementById('__ig_dm_style__')?.remove();

  const style = document.createElement('style');
  style.id = '__ig_dm_style__';
  style.textContent = `
    #__ig_dm_tool__ {
      --bg: #111111;
      --surface: #1a1a1a;
      --ink: #e5e5e5;
      --muted: #888888;
      --line: #2a2a2a;
      --accent: #3b82f6;
      --accent-deep: #60a5fa;
      --accent-soft: rgba(59,130,246,0.15);
      --success: #22c55e;
      --success-soft: rgba(34,197,94,0.12);
      --danger: #ef4444;
      position: fixed;
      top: 12px;
      right: 12px;
      left: auto;
      z-index: 99999;
      width: min(360px, calc(100vw - 24px));
      color: var(--ink);
      font-family: 'NK57 Monospace', 'SFMono-Regular', 'Fira Code', 'Cascadia Code', 'Consolas', monospace;
      font-size: 13px;
      line-height: 1.45;
    }
    #__ig_dm_tool__ * {
      box-sizing: border-box;
    }
    #__ig_dm_tool__ .shell {
      background: var(--bg);
      border: 1px solid var(--line);
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      max-height: calc(100vh - 24px);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    #__ig_dm_tool__ .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 10px 12px;
      border-bottom: 1px solid var(--line);
      cursor: move;
      flex-shrink: 0;
    }
    #__ig_dm_tool__ .topbar h2 {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
    }
    #__ig_dm_tool__ .badge:empty {
      display: none;
    }
    #__ig_dm_tool__ .badge {
      display: inline-block;
      margin-left: 6px;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 10px;
      font-weight: 600;
      background: var(--success-soft);
      color: var(--success);
      border: 1px solid var(--success);
    }
    #__ig_dm_tool__ .badge[data-tone="working"] {
      background: var(--accent-soft);
      color: var(--accent-deep);
      border-color: var(--accent);
    }
    #__ig_dm_tool__ .badge[data-tone="err"] {
      background: rgba(239,68,68,0.1);
      color: var(--danger);
      border-color: var(--danger);
    }
    #__ig_dm_tool__ .icon-btn {
      width: 28px;
      height: 28px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: transparent;
      color: var(--muted);
      font-size: 16px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }
    #__ig_dm_tool__ .icon-btn:hover {
      background: var(--surface);
      color: var(--ink);
    }
    #__ig_dm_tool__ .content {
      padding: 12px;
      overflow-y: auto;
      flex: 1 1 auto;
      min-height: 0;
    }
    #__ig_dm_tool__ .panel {
      padding: 12px;
      border-radius: 10px;
      background: var(--surface);
      border: 1px solid var(--line);
      margin-bottom: 10px;
    }
    #__ig_dm_tool__ .panel:last-child {
      margin-bottom: 0;
    }
    #__ig_dm_tool__ .section-head {
      margin-bottom: 10px;
    }
    #__ig_dm_tool__ .section-kicker {
      color: var(--muted);
      font-size: 11px;
      margin-bottom: 2px;
    }
    #__ig_dm_tool__ .panel h3 {
      margin: 0;
      font-size: 13px;
      font-weight: 600;
    }
    #__ig_dm_tool__ .search-row {
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 8px;
      align-items: end;
    }
    #__ig_dm_tool__ .field {
      display: grid;
      gap: 4px;
    }
    #__ig_dm_tool__ .field span {
      font-size: 11px;
      color: var(--muted);
    }
    #__ig_dm_tool__ input[type="text"] {
      width: 100%;
      padding: 8px 10px;
      border-radius: 8px;
      border: 1px solid var(--line);
      background: var(--bg);
      font-size: 13px;
      color: var(--ink);
      outline: none;
    }
    #__ig_dm_tool__ input[type="text"]:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-soft);
    }
    #__ig_dm_tool__ .subtle {
      margin: 8px 0 0;
      color: var(--muted);
      font-size: 11px;
      line-height: 1.45;
    }
    #__ig_dm_tool__ .btn {
      appearance: none;
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      background: var(--bg);
      color: var(--ink);
    }
    #__ig_dm_tool__ .btn:hover:not(:disabled) {
      background: var(--surface);
    }
    #__ig_dm_tool__ .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    #__ig_dm_tool__ .btn-primary {
      color: #fff;
      background: var(--accent);
      border-color: var(--accent);
    }
    #__ig_dm_tool__ .btn-primary:hover:not(:disabled) {
      background: var(--accent-deep);
    }
    #__ig_dm_tool__ .btn-success {
      color: #fff;
      background: var(--success);
      border-color: var(--success);
    }
    #__ig_dm_tool__ .btn-secondary {
      background: var(--surface);
    }
    #__ig_dm_tool__ .btn-wide {
      width: 100%;
      margin-top: 10px;
    }
    #__ig_dm_tool__ .thread-list {
      display: none;
      margin-top: 10px;
      gap: 8px;
    }
    #__ig_dm_tool__ .thread-list.show {
      display: grid;
    }
    #__ig_dm_tool__ .thread-item {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 10px;
      align-items: center;
      width: 100%;
      padding: 8px;
      border-radius: 8px;
      border: 1px solid var(--line);
      background: var(--bg);
      text-align: left;
      cursor: pointer;
    }
    #__ig_dm_tool__ .thread-item:hover {
      border-color: var(--accent);
      background: #222222;
    }
    #__ig_dm_tool__ .thread-item.is-selected {
      border-color: var(--accent);
      background: var(--accent-soft);
    }
    #__ig_dm_tool__ .thread-avatar,
    #__ig_dm_tool__ .selected-avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: var(--accent);
      color: #fff;
      font-size: 12px;
      font-weight: 700;
    }
    #__ig_dm_tool__ .thread-name,
    #__ig_dm_tool__ .selected-name {
      font-size: 13px;
      font-weight: 600;
    }
    #__ig_dm_tool__ .thread-handle,
    #__ig_dm_tool__ .selected-handle {
      color: var(--muted);
      font-size: 11px;
    }
    #__ig_dm_tool__ .thread-source {
      padding: 2px 8px;
      border-radius: 999px;
      background: var(--bg);
      border: 1px solid var(--line);
      color: var(--muted);
      font-size: 10px;
      font-weight: 600;
    }
    #__ig_dm_tool__ .setup-panel {
      display: none;
    }
    #__ig_dm_tool__ .setup-panel.show {
      display: block;
    }
    #__ig_dm_tool__ .selected-user {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px;
      border-radius: 8px;
      background: var(--bg);
      border: 1px solid var(--line);
      margin-bottom: 10px;
    }
    #__ig_dm_tool__ .mode-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-top: 0;
    }
    #__ig_dm_tool__ .mode-card {
      display: grid;
      gap: 2px;
      padding: 10px;
      border-radius: 8px;
      border: 1px solid var(--line);
      background: var(--bg);
      color: var(--ink);
      text-align: left;
      cursor: pointer;
    }
    #__ig_dm_tool__ .mode-card:hover {
      border-color: var(--accent);
    }
    #__ig_dm_tool__ .mode-card.is-active {
      border-color: var(--accent);
      background: var(--accent-soft);
    }
    #__ig_dm_tool__ .mode-title {
      font-size: 12px;
      font-weight: 600;
    }
    #__ig_dm_tool__ .mode-copy {
      color: var(--muted);
      font-size: 11px;
      line-height: 1.35;
    }
    #__ig_dm_tool__ .range-wrap {
      margin-top: 10px;
    }
    #__ig_dm_tool__ .range-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;
      font-size: 12px;
    }
    #__ig_dm_tool__ .range-head strong {
      color: var(--accent-deep);
    }
    #__ig_dm_tool__ input[type="range"] {
      width: 100%;
      accent-color: var(--accent);
    }
    #__ig_dm_tool__ .preset-row {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-top: 8px;
    }
    #__ig_dm_tool__ .preset-btn {
      appearance: none;
      border: 1px solid var(--line);
      background: var(--bg);
      color: var(--muted);
      border-radius: 999px;
      padding: 4px 10px;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
    }
    #__ig_dm_tool__ .preset-btn:hover {
      border-color: var(--accent);
    }
    #__ig_dm_tool__ .preset-btn.is-active {
      color: var(--accent-deep);
      background: var(--accent-soft);
      border-color: var(--accent);
    }
    #__ig_dm_tool__ .stats {
      display: none;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-bottom: 10px;
    }
    #__ig_dm_tool__ .stats.show {
      display: grid;
    }
    #__ig_dm_tool__ .stat-card {
      padding: 10px;
      border-radius: 8px;
      background: var(--bg);
      border: 1px solid var(--line);
      text-align: center;
    }
    #__ig_dm_tool__ .stat-num {
      font-size: 16px;
      font-weight: 700;
      color: var(--accent-deep);
    }
    #__ig_dm_tool__ .stat-lbl {
      margin-top: 2px;
      font-size: 10px;
      color: var(--muted);
    }
    #__ig_dm_tool__ .log {
      display: grid;
      gap: 6px;
      min-height: 80px;
      max-height: 180px;
      overflow-y: auto;
    }
    #__ig_dm_tool__ .log-entry {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 8px;
      padding: 6px 8px;
      border-radius: 6px;
      background: var(--bg);
      border: 1px solid var(--line);
      font-size: 11px;
      line-height: 1.4;
    }
    #__ig_dm_tool__ .log-entry.ok {
      border-color: var(--success);
      background: var(--success-soft);
    }
    #__ig_dm_tool__ .log-entry.err {
      border-color: var(--danger);
      background: rgba(239,68,68,0.1);
    }
    #__ig_dm_tool__ .log-entry.inf {
      border-color: var(--accent);
      background: var(--accent-soft);
    }
    #__ig_dm_tool__ .log-time {
      color: var(--muted);
      font-weight: 600;
      white-space: nowrap;
    }
    #__ig_dm_tool__ .footer-actions {
      display: none;
      gap: 8px;
      margin-top: 10px;
    }
    #__ig_dm_tool__ .footer-actions.show {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
    @media (max-width: 640px) {
      #__ig_dm_tool__ {
        width: calc(100vw - 24px);
      }
      #__ig_dm_tool__ .mode-grid,
      #__ig_dm_tool__ .stats.show,
      #__ig_dm_tool__ .footer-actions.show {
        grid-template-columns: 1fr;
      }
      #__ig_dm_tool__ .search-row {
        grid-template-columns: 1fr;
      }
    }
  `;
  document.head.appendChild(style);

  const el = document.createElement('section');
  el.id = '__ig_dm_tool__';
  el.innerHTML = `
    <div class="shell">
      <div class="topbar">
        <h2>instagram dm scraper <span class="badge" id="__ig_status_badge__" data-tone="ok"></span></h2>
        <button class="icon-btn" id="__ig_close__" aria-label="close">×</button>
      </div>
      <div class="content">
        <section class="panel">
          <div class="section-head">
            <div class="section-kicker">search</div>
            <h3>pick a chat</h3>
          </div>
          <div class="search-row">
            <label class="field">
              <span>username</span>
              <input type="text" id="__ig_search__" placeholder="e.g. user123" />
            </label>
            <button class="btn btn-primary" id="__ig_find__">find</button>
          </div>
          <p class="subtle">searches your inbox and instagram's user index. inbox matches preferred if available.</p>
          <div class="thread-list" id="__ig_threads__"></div>
        </section>

        <section class="panel setup-panel" id="__ig_setup__">
          <div class="section-head">
            <div class="section-kicker">export settings</div>
            <h3>download plan</h3>
          </div>
          <div class="selected-user">
            <div class="selected-avatar" id="__ig_selected_av__">?</div>
            <div class="selected-copy">
              <div class="selected-name" id="__ig_selected_name__">no user selected</div>
              <div class="selected-handle" id="__ig_selected_handle__">choose someone from the results</div>
            </div>
          </div>
          <div class="mode-grid">
            <button class="mode-card is-active" data-mode="latest" type="button">
              <span class="mode-title">recent messages</span>
              <span class="mode-copy">grabs the last n messages and sorts oldest first.</span>
            </button>
            <button class="mode-card" data-mode="all" type="button">
              <span class="mode-title">full history</span>
              <span class="mode-copy">fetches every message in the thread.</span>
            </button>
          </div>
          <div class="range-wrap" id="__ig_range_wrap__">
            <div class="range-head">
              <span>message limit</span>
              <strong id="__ig_range_val__">200</strong>
            </div>
            <input type="range" id="__ig_range__" min="20" max="5000" step="20" value="200" />
            <div class="preset-row">
              <button class="preset-btn" type="button" data-value="100">100</button>
              <button class="preset-btn" type="button" data-value="250">250</button>
              <button class="preset-btn" type="button" data-value="500">500</button>
              <button class="preset-btn" type="button" data-value="1000">1000</button>
            </div>
          </div>
          <button class="btn btn-primary btn-wide" id="__ig_go__">load recent messages</button>
        </section>

        <section class="stats" id="__ig_stat__">
          <div class="stat-card"><div class="stat-num" id="__ig_n_msg__">0</div><div class="stat-lbl">messages</div></div>
          <div class="stat-card"><div class="stat-num" id="__ig_n_med__">0</div><div class="stat-lbl">media</div></div>
          <div class="stat-card"><div class="stat-num" id="__ig_n_pg__">0</div><div class="stat-lbl">pages</div></div>
        </section>

        <section class="panel">
          <div class="section-head">
            <div class="section-kicker">status</div>
            <h3>what's happening</h3>
          </div>
          <div class="log" id="__ig_log__"></div>
        </section>

        <div class="footer-actions" id="__ig_footer__">
          <button class="btn btn-success" id="__ig_dl__">download json</button>
          <button class="btn btn-secondary" id="__ig_reset__">reset</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(el);

  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let dragging = false;

  el.querySelector('.topbar').addEventListener('mousedown', e => {
    if (e.target.closest('button')) return;
    const rect = el.getBoundingClientRect();
    dragging = true;
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
    el.style.left = rect.left + 'px';
    el.style.top = rect.top + 'px';
    el.style.right = 'auto';
    el.style.transform = 'none';
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    el.style.left = e.clientX - dragOffsetX + 'px';
    el.style.top = e.clientY - dragOffsetY + 'px';
  });

  document.addEventListener('mouseup', () => {
    dragging = false;
  });

  const searchInput = $('#__ig_search__');
  const threadList = $('#__ig_threads__');
  const logBox = $('#__ig_log__');
  const statBox = $('#__ig_stat__');
  const setupPanel = $('#__ig_setup__');
  const rangeWrap = $('#__ig_range_wrap__');
  const rangeInput = $('#__ig_range__');
  const rangeVal = $('#__ig_range_val__');
  const dlBtn = $('#__ig_dl__');
  const resetBtn = $('#__ig_reset__');
  const findBtn = $('#__ig_find__');
  const goBtn = $('#__ig_go__');
  const footerActions = $('#__ig_footer__');
  const statusBadge = $('#__ig_status_badge__');
  const nMsg = $('#__ig_n_msg__');
  const nMed = $('#__ig_n_med__');
  const nPg = $('#__ig_n_pg__');
  const selectedAvatar = $('#__ig_selected_av__');
  const selectedName = $('#__ig_selected_name__');
  const selectedHandle = $('#__ig_selected_handle__');
  const modeButtons = [...el.querySelectorAll('.mode-card')];
  const presetButtons = [...el.querySelectorAll('.preset-btn')];

  let collected = [];
  let selThreadId = null;
  let selUser = null;
  let myUserId = null;
  let downloadMode = 'latest';
  let exportMeta = null;

  try {
    myUserId =
      document.cookie.split('; ').find(c => c.startsWith('ds_user_id='))?.split('=')[1] || null;
  } catch (_) {}

  const goButtonLabel = () =>
    downloadMode === 'all' ? 'fetch full history' : 'fetch recent messages';

  const setStatus = (label, tone = 'ok') => {
    statusBadge.textContent = label;
    statusBadge.dataset.tone = tone;
  };

  const log = (msg, type = 'inf') => {
    const entry = document.createElement('div');
    const time = document.createElement('span');
    const text = document.createElement('span');

    entry.className = `log-entry ${type}`;
    time.className = 'log-time';
    time.textContent = new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
    text.textContent = msg;

    entry.append(time, text);
    logBox.appendChild(entry);
    logBox.scrollTop = logBox.scrollHeight;
  };

  const resetStats = () => {
    statBox.classList.remove('show');
    nMsg.textContent = '0';
    nMed.textContent = '0';
    nPg.textContent = '0';
  };

  const setExportReady = ready => {
    footerActions.classList.toggle('show', ready);
    dlBtn.disabled = !ready;
  };

  const updateRangeValue = () => {
    rangeVal.textContent = rangeInput.value;
    presetButtons.forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.value === rangeInput.value);
    });
  };

  const updateSelectedUser = () => {
    if (!selUser) {
      selectedAvatar.textContent = '?';
      selectedName.textContent = 'no user selected';
      selectedHandle.textContent = 'choose someone from the results';
      return;
    }

    selectedAvatar.textContent = (selUser.username || '?').slice(0, 1).toUpperCase();
    selectedName.textContent = selUser.full_name || selUser.username;
    selectedHandle.textContent = `@${selUser.username}${selThreadId ? ' · thread ready' : ''}`;
  };

  const updateModeUI = () => {
    modeButtons.forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.mode === downloadMode);
    });
    rangeWrap.style.display = downloadMode === 'latest' ? 'block' : 'none';
    goBtn.textContent = goButtonLabel();
  };

  const invalidateExport = note => {
    if (!exportMeta && !collected.length) return;
    collected = [];
    exportMeta = null;
    setExportReady(false);
    resetStats();
    if (note) log(note, 'inf');
  };

  const clearSelection = () => {
    collected = [];
    exportMeta = null;
    selThreadId = null;
    selUser = null;
    goBtn.disabled = false;
    goBtn.textContent = goButtonLabel();
    [...threadList.querySelectorAll('.is-selected')].forEach(node => node.classList.remove('is-selected'));
    updateSelectedUser();
    setExportReady(false);
    resetStats();
    setupPanel.classList.remove('show');
  };

  const setSearchBusy = isBusy => {
    findBtn.disabled = isBusy;
    findBtn.textContent = isBusy ? 'searching...' : 'find';
  };

  updateRangeValue();
  updateSelectedUser();
  updateModeUI();
  setExportReady(false);

  findBtn.addEventListener('click', findThread);
  searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') findThread();
  });
  rangeInput.addEventListener('input', updateRangeValue);
  rangeInput.addEventListener('change', () => {
    invalidateExport('message limit changed. reload to update json.');
  });
  $('#__ig_close__').addEventListener('click', () => {
    style.remove();
    el.remove();
  });

  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.mode === downloadMode) return;
      downloadMode = btn.dataset.mode;
      updateModeUI();
      invalidateExport('download mode changed. reload to update json.');
    });
  });

  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      rangeInput.value = btn.dataset.value;
      updateRangeValue();
      invalidateExport('preset changed. reload to update json.');
    });
  });

  async function findThread() {
    const q = searchInput.value.trim().replace(/^@/, '');
    if (!q) {
      log('enter a username first.', 'err');
      setStatus('waiting for input', 'err');
      searchInput.focus();
      return;
    }

    clearSelection();
    threadList.innerHTML = '';
    threadList.classList.remove('show');
    logBox.innerHTML = '';
    setExportReady(false);
    setSearchBusy(true);
    setStatus('looking...', 'working');
    log(`searching for "${q}"...`, 'inf');

    let users = [];
    try {
      const data = await webSearch(q);
      users = (data?.users || []).map(u => u.user).filter(Boolean);
    } catch (e) {
      log(`search error: ${e.message}`, 'err');
    }

    let inboxMatches = [];
    try {
      inboxMatches = await searchInbox(q);
    } catch (e) {
      log(`inbox error: ${e.message}`, 'err');
    }

    const seen = new Set();
    const combined = [];

    inboxMatches.forEach(match => {
      const key = match.user.pk || match.user.username;
      if (seen.has(key)) return;
      seen.add(key);
      combined.push(match);
    });

    users.slice(0, 8).forEach(user => {
      const key = user.pk || user.username;
      if (seen.has(key)) return;
      seen.add(key);
      combined.push({ user, thread: null, fromInbox: false });
    });

    if (!combined.length) {
      log('no results found.', 'err');
      setStatus('no results', 'err');
      setSearchBusy(false);
      return;
    }

    showResults(combined);
    log(`found ${combined.length} results. pick a thread.`, 'ok');
    setStatus('pick a thread', 'ok');
    setSearchBusy(false);
  }

  async function searchInbox(q) {
    const data = await apiFetch('/api/v1/direct_v2/inbox/?persistentBadging=true&limit=20');
    const threads = data?.inbox?.threads || [];
    const lower = q.toLowerCase();
    const results = [];

    threads.forEach(thread => {
      const user = thread.users?.find(u => {
        const username = u.username?.toLowerCase() || '';
        const fullName = u.full_name?.toLowerCase() || '';
        return username.includes(lower) || fullName.includes(lower);
      });
      if (user) results.push({ user, thread, fromInbox: true });
    });

    return results;
  }

  function showResults(items) {
    threadList.innerHTML = '';
    threadList.classList.add('show');

    items.forEach(({ user, thread, fromInbox }) => {
      const item = document.createElement('button');
      const avatar = document.createElement('div');
      const copy = document.createElement('div');
      const name = document.createElement('div');
      const handle = document.createElement('div');
      const source = document.createElement('div');

      item.type = 'button';
      item.className = 'thread-item';
      avatar.className = 'thread-avatar';
      copy.className = 'thread-copy';
      name.className = 'thread-name';
      handle.className = 'thread-handle';
      source.className = 'thread-source';

      avatar.textContent = (user.username || '?').slice(0, 1).toUpperCase();
      name.textContent = user.full_name || user.username;
      handle.textContent = `@${user.username}`;
      source.textContent = fromInbox ? 'inbox' : 'search';

      copy.append(name, handle);
      item.append(avatar, copy, source);

      item.addEventListener('click', async () => {
        [...threadList.children].forEach(node => node.classList.remove('is-selected'));
        item.classList.add('is-selected');
        invalidateExport();
        selUser = user;
        selThreadId = null;
        updateSelectedUser();
        setStatus('getting thread ready', 'working');

        if (thread?.thread_id) {
          selThreadId = thread.thread_id;
          onSelect();
          return;
        }

        await resolveThreadByUser(user);
      });

      threadList.appendChild(item);
    });
  }

  async function resolveThreadByUser(user) {
    log(`looking up thread for @${user.username}...`, 'inf');

    try {
      const data = await apiFetch(
        `/api/v1/direct_v2/threads/get_by_participants/?recipient_users=%5B${user.pk}%5D`
      );
      const tid = data?.thread?.thread_id;
      if (tid) {
        selThreadId = tid;
        log('thread found.', 'ok');
        onSelect();
        return;
      }
      log('no active thread visible, scanning inbox again...', 'inf');
    } catch (e) {
      log(`thread lookup error: ${e.message}`, 'err');
    }

    try {
      const data = await apiFetch('/api/v1/direct_v2/inbox/?persistentBadging=true&limit=50');
      const threads = data?.inbox?.threads || [];
      const match = threads.find(thread =>
        thread.users?.some(
          u => String(u.pk) === String(user.pk) || String(u.username) === String(user.username)
        )
      );

      if (match?.thread_id) {
        selThreadId = match.thread_id;
        log('found thread in inbox.', 'ok');
        onSelect();
        return;
      }

      log('no conversation found with this user. start a dm first.', 'err');
      setStatus('thread not found', 'err');
    } catch (e) {
      log(`inbox error: ${e.message}`, 'err');
      setStatus('thread not found', 'err');
    }
  }

  function onSelect() {
    setupPanel.classList.add('show');
    updateSelectedUser();
    updateModeUI();
    setStatus('ready', 'ok');
    log(`selected @${selUser.username}. choose a mode and hit go.`, 'ok');
  }

  async function downloadMessages() {
    if (!selThreadId || !selUser) {
      log('pick a thread first.', 'err');
      setStatus('pick a thread', 'err');
      return;
    }

    const limit = downloadMode === 'latest' ? parseInt(rangeInput.value, 10) : Infinity;
    collected = [];
    exportMeta = null;
    resetStats();
    setExportReady(false);
    statBox.classList.add('show');
    goBtn.disabled = true;
    goBtn.textContent = downloadMode === 'all' ? 'fetching history...' : 'fetching recent messages...';
    setStatus('downloading', 'working');

    let cursor = null;
    let pageNum = 0;
    let mediaCount = 0;

    try {
      while (collected.length < limit) {
        const url =
          `/api/v1/direct_v2/threads/${selThreadId}/?limit=20` +
          (cursor ? `&cursor=${encodeURIComponent(cursor)}` : '');
        const data = await apiFetch(url);
        const items = data?.thread?.items || [];

        if (!items.length) {
          log(pageNum ? 'no older messages.' : 'no messages found.', 'ok');
          break;
        }

        const remaining = Number.isFinite(limit) ? Math.max(limit - collected.length, 0) : items.length;
        const pageItems = Number.isFinite(limit) ? items.slice(0, remaining) : items;

        pageItems.forEach(item => {
          collected.push(parseItem(item));
          if (item.item_type !== 'text') mediaCount++;
        });

        pageNum++;
        nMsg.textContent = String(collected.length);
        nMed.textContent = String(mediaCount);
        nPg.textContent = String(pageNum);
        log(`page ${pageNum}: grabbed ${pageItems.length} messages (total ${collected.length}).`, 'ok');

        const next = data?.thread?.oldest_cursor;
        const hasOlder = data?.thread?.has_older !== false;
        if (pageItems.length < items.length) break;
        if (!next || next === cursor || !hasOlder) break;
        cursor = next;
        await new Promise(r => setTimeout(r, 400));
      }

      exportMeta = {
        mode: downloadMode,
        requested_limit: Number.isFinite(limit) ? parseInt(rangeInput.value, 10) : null,
        downloaded_messages: collected.length,
      };

      setExportReady(true);
      goBtn.textContent = downloadMode === 'all' ? 'refresh history' : 'refresh recent';
      setStatus('ready', 'ok');
      log(
        downloadMode === 'all'
          ? `done. ${collected.length} messages ready.`
          : `done. last ${collected.length} messages ready.`,
        'ok'
      );
    } catch (e) {
      goBtn.textContent = goButtonLabel();
      log('download error: ' + e.message, 'err');
      setStatus('error', 'err');
    } finally {
      goBtn.disabled = false;
    }
  }

  function fmtTime(ts) {
    if (!ts) return null;
    const d = new Date(ts / 1000);
    return d.toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
  }

  function pickMediaUrl(media) {
    if (!media) return null;
    if (media.video_versions?.length) return media.video_versions[0].url;
    if (media.image_versions2?.candidates?.length) return media.image_versions2.candidates[0].url;
    return null;
  }

  function mediaKind(media) {
    if (!media) return 'unknown';
    if (media.video_versions?.length) return 'video';
    if (media.image_versions2) return 'image';
    return 'unknown';
  }

  function parseItem(item) {
    const isMe = myUserId && String(item.user_id) === String(myUserId);
    const out = {
      id: item.item_id,
      sent_at: fmtTime(item.timestamp),
      from: isMe ? 'me' : `@${selUser.username}`,
      kind: item.item_type,
      content: null,
    };

    switch (item.item_type) {
      case 'text':
        out.content = item.text || '';
        break;
      case 'like':
        out.content = '[like]';
        break;
      case 'media': {
        const url = pickMediaUrl(item.media);
        out.content = `[${mediaKind(item.media)}]`;
        if (url) out.media = { type: mediaKind(item.media), url };
        break;
      }
      case 'animated_media':
        out.content = '[gif]';
        out.media = { type: 'gif', url: item.animated_media?.images?.fixed_height?.url || null };
        break;
      case 'voice_media':
        out.content = '[voice message]';
        out.media = {
          type: 'audio',
          url: item.voice_media?.media?.audio?.audio_src || null,
          duration_sec: item.voice_media?.media?.audio?.duration
            ? Math.round(item.voice_media.media.audio.duration / 1000)
            : null,
        };
        break;
      case 'reel_share': {
        const share = item.reel_share || {};
        const url = pickMediaUrl(share.media);
        out.content = share.text ? `[reply to story] ${share.text}` : '[shared a story]';
        out.shared = {
          type: 'story',
          from: share.media?.user?.username ? `@${share.media.user.username}` : null,
          media_url: url,
          message: share.text || null,
        };
        break;
      }
      case 'story_share': {
        const share = item.story_share || {};
        const url = pickMediaUrl(share.media);
        out.content = share.text ? `[story reply] ${share.text}` : '[shared a story]';
        out.shared = { type: 'story', media_url: url, message: share.text || null };
        break;
      }
      case 'media_share':
      case 'clip':
      case 'felix_share':
      case 'xma_media_share': {
        const media = item.media_share || item.clip?.clip || item.felix_share?.video || null;
        out.content = '[shared a post]';
        out.shared = {
          type: 'post',
          from: media?.user?.username ? `@${media.user.username}` : null,
          caption: media?.caption?.text || null,
          permalink: media?.code ? `https://www.instagram.com/p/${media.code}/` : null,
          media_url: pickMediaUrl(media),
        };
        break;
      }
      case 'link':
        out.content = item.link?.text || item.link?.link_context?.link_url || '[link]';
        out.link = {
          url: item.link?.link_context?.link_url || null,
          title: item.link?.link_context?.link_title || null,
          summary: item.link?.link_context?.link_summary || null,
        };
        break;
      case 'placeholder':
        out.content = item.placeholder?.message || '[unsupported message]';
        break;
      case 'action_log':
        out.content = `[system] ${item.action_log?.description || ''}`;
        break;
      default:
        out.content = `[${item.item_type}]`;
    }

    if (item.replied_to_message) {
      const reply = item.replied_to_message;
      const replyIsMe = myUserId && String(reply.user_id) === String(myUserId);
      out.reply_to = {
        from: replyIsMe ? 'me' : `@${selUser.username}`,
        text: reply.text || `[${reply.item_type}]`,
      };
    }

    if (Array.isArray(item.reactions?.emojis) && item.reactions.emojis.length) {
      out.reactions = item.reactions.emojis.map(reaction => {
        const reactorIsMe = myUserId && String(reaction.sender_id) === String(myUserId);
        return {
          from: reactorIsMe ? 'me' : `@${selUser.username}`,
          emoji: reaction.emoji,
        };
      });
    }

    if (item.is_unsent) {
      out.content = '[unsent]';
      out.unsent = true;
    }

    return out;
  }

  function buildExport() {
    const ordered = [...collected].sort((a, b) => {
      const ta = Date.parse(a.sent_at) || 0;
      const tb = Date.parse(b.sent_at) || 0;
      return ta - tb;
    });

    const counts = ordered.reduce((acc, message) => {
      acc[message.kind] = (acc[message.kind] || 0) + 1;
      return acc;
    }, {});

    const myHandle = 'me';
    const peerHandle = `@${selUser.username}`;

    return {
      schema: 'instagram-dm-export/v1',
      description: 'instagram direct message export in chronological order (oldest to newest). messages are normalized for easy reading and further analysis.',
      exported_at: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
      export_options: {
        mode: exportMeta?.mode || downloadMode,
        requested_limit: exportMeta?.requested_limit ?? null,
        downloaded_messages: exportMeta?.downloaded_messages || ordered.length,
      },
      participants: {
        me: { handle: myHandle, user_id: myUserId },
        peer: {
          handle: peerHandle,
          username: selUser.username,
          full_name: selUser.full_name || null,
          user_id: String(selUser.pk || ''),
        },
      },
      thread: {
        id: selThreadId,
        url: `https://www.instagram.com/direct/t/${selThreadId}/`,
      },
      stats: {
        total_messages: ordered.length,
        first_message_at: ordered[0]?.sent_at || null,
        last_message_at: ordered[ordered.length - 1]?.sent_at || null,
        by_kind: counts,
        from_me: ordered.filter(message => message.from === 'me').length,
        from_peer: ordered.filter(message => message.from === peerHandle).length,
      },
      messages: ordered,
    };
  }

  goBtn.addEventListener('click', downloadMessages);

  dlBtn.addEventListener('click', () => {
    if (!collected.length || !selUser) {
      log('fetch some messages first.', 'err');
      setStatus('nothing to export yet', 'err');
      return;
    }

    const out = buildExport();
    const scope =
      exportMeta?.mode === 'all'
        ? 'all'
        : `latest_${exportMeta?.requested_limit || collected.length}`;
    const blobUrl = URL.createObjectURL(
      new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' })
    );
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `ig_dm_${selUser.username}_${scope}_${Date.now()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    log('json file downloaded.', 'ok');
    setStatus('ready', 'ok');
  });

  resetBtn.addEventListener('click', () => {
    clearSelection();
    threadList.innerHTML = '';
    threadList.classList.remove('show');
    logBox.innerHTML = '';
    searchInput.value = '';
    downloadMode = 'latest';
    rangeInput.value = '200';
    updateRangeValue();
    updateModeUI();
    setStatus('ready', 'ok');
    log('ready. type a new username to start.', 'ok');
  });

  log('ready. type a username and pick a chat.', 'ok');
})();
