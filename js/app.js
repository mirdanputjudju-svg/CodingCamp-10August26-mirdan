/* =============================================
   LIFE DASHBOARD — app.js
   Vanilla JavaScript | No frameworks
   ============================================= */

'use strict';

// ─── LocalStorage Keys ───────────────────────────────────────────────────────
const LS_TODOS     = 'dashboard_todos';
const LS_LINKS     = 'dashboard_links';
const LS_THEME     = 'dashboard_theme';
const LS_USER_NAME = 'dashboard_user_name';
const LS_SORT      = 'dashboard_sort';

// ─── DOM References ───────────────────────────────────────────────────────────
const $ = (id) => document.getElementById(id);

// Greeting
const elDate     = $('current-date');
const elGreeting = $('greeting-text');
const elTime     = $('current-time');

// Header controls
const elThemeToggle = $('theme-toggle');
const elSetNameBtn  = $('set-name-btn');

// Timer
const elTimerDisplay = $('timer-display');
const elTimerStart   = $('timer-start');
const elTimerStop    = $('timer-stop');
const elTimerReset   = $('timer-reset');
const elTimerLabel   = $('timer-label');

// Todo
const elTodoInput  = $('todo-input');
const elTodoAdd    = $('todo-add');
const elTodoList   = $('todo-list');
const elTodoEmpty  = $('todo-empty');
const elSortSelect = $('sort-select');

// Edit Task Modal
const elEditModal  = $('edit-modal');
const elEditInput  = $('edit-input');
const elEditSave   = $('edit-save');
const elEditCancel = $('edit-cancel');

// Links
const elLinkName   = $('link-name-input');
const elLinkUrl    = $('link-url-input');
const elLinkAdd    = $('link-add');
const elLinksGrid  = $('links-grid');
const elLinksEmpty = $('links-empty');

// Edit Link Modal
const elEditLinkModal  = $('edit-link-modal');
const elEditLinkName   = $('edit-link-name');
const elEditLinkUrl    = $('edit-link-url');
const elEditLinkSave   = $('edit-link-save');
const elEditLinkCancel = $('edit-link-cancel');

// Set Name Modal
const elNameModal  = $('name-modal');
const elNameInput  = $('name-input');
const elNameSave   = $('name-save');
const elNameCancel = $('name-cancel');


/* =============================================================================
   CHALLENGE 1 — LIGHT / DARK MODE
   ============================================================================= */

/**
 * Loads the saved theme from LocalStorage. Defaults to 'dark'.
 */
function loadTheme() {
  return localStorage.getItem(LS_THEME) || 'dark';
}

/**
 * Persists the current theme choice to LocalStorage.
 */
function saveTheme(theme) {
  localStorage.setItem(LS_THEME, theme);
}

/**
 * Applies the given theme to the document and updates the toggle button label.
 * Also removes the pre-paint light-init class added by the inline head script.
 * @param {string} theme — 'dark' | 'light'
 */
function applyTheme(theme) {
  // Remove the pre-paint helper class (added by inline <head> script)
  document.documentElement.classList.remove('light-init');

  if (theme === 'light') {
    document.body.classList.add('light');
    elThemeToggle.textContent = '☀️ Light';
    elThemeToggle.classList.add('is-light');
  } else {
    document.body.classList.remove('light');
    elThemeToggle.textContent = '🌙 Dark';
    elThemeToggle.classList.remove('is-light');
  }
}

/**
 * Toggles between dark and light themes and saves the preference.
 */
function toggleTheme() {
  const current = loadTheme();
  const next    = current === 'dark' ? 'light' : 'dark';
  saveTheme(next);
  applyTheme(next);
}

elThemeToggle.addEventListener('click', toggleTheme);

// Apply saved theme immediately on load
applyTheme(loadTheme());


/* =============================================================================
   CHALLENGE 2 — CUSTOM NAME IN GREETING
   ============================================================================= */

/**
 * Loads the saved user name from LocalStorage. Returns '' if not set.
 */
function loadUserName() {
  return localStorage.getItem(LS_USER_NAME) || '';
}

/**
 * Persists the user name to LocalStorage.
 */
function saveUserName(name) {
  if (name) {
    localStorage.setItem(LS_USER_NAME, name);
  } else {
    localStorage.removeItem(LS_USER_NAME);
  }
}

// ── Name Modal ───────────────────────────────────────────────────────────────

function openNameModal() {
  elNameInput.value = loadUserName();
  elNameModal.removeAttribute('hidden');
  elNameInput.focus();
}

function closeNameModal() {
  elNameModal.setAttribute('hidden', '');
}

function saveAndCloseName() {
  const name = elNameInput.value.trim();
  saveUserName(name);
  closeNameModal();
  // Re-render greeting with updated name (clock already ticks but we update now)
  updateClock();
}

elSetNameBtn.addEventListener('click', openNameModal);
elNameSave.addEventListener('click', saveAndCloseName);
elNameCancel.addEventListener('click', closeNameModal);

elNameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter')  saveAndCloseName();
  if (e.key === 'Escape') closeNameModal();
});

elNameModal.addEventListener('click', (e) => {
  if (e.target === elNameModal) closeNameModal();
});


/* =============================================================================
   1. GREETING & CLOCK  (existing — enhanced with custom name)
   ============================================================================= */

/**
 * Returns a greeting string based on the current hour.
 */
function getGreeting(hour) {
  if (hour >= 5  && hour < 12) return 'Good morning';
  if (hour >= 12 && hour < 17) return 'Good afternoon';
  if (hour >= 17 && hour < 21) return 'Good evening';
  return 'Good night';
}

/**
 * Formats a Date object to a readable date string.
 * e.g. "Thursday, August 13, 2026"
 */
function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  });
}

/**
 * Formats a Date to a HH:MM:SS 12-hour string.
 */
function formatTime(date) {
  return date.toLocaleTimeString('en-US', {
    hour:   '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

/**
 * Updates the greeting, date, and live clock every second.
 * Includes custom name if one is saved (Challenge 2).
 */
function updateClock() {
  const now  = new Date();
  const hour = now.getHours();
  const name = loadUserName();

  const greet = getGreeting(hour);
  elGreeting.textContent = name ? `${greet}, ${name} 👋` : `${greet} 👋`;
  elDate.textContent     = formatDate(now);
  elTime.textContent     = formatTime(now);
}

// Kick off the clock immediately, then tick every second
updateClock();
setInterval(updateClock, 1000);


/* =============================================================================
   2. FOCUS TIMER  (existing — unchanged)
   ============================================================================= */

const TIMER_DURATION = 25 * 60; // seconds

let timerSeconds  = TIMER_DURATION;
let timerInterval = null;
let timerRunning  = false;

function formatTimerDisplay(secs) {
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function renderTimer() {
  elTimerDisplay.textContent = formatTimerDisplay(timerSeconds);
  elTimerDisplay.classList.toggle('running', timerRunning);
}

function startTimer() {
  if (timerRunning || timerSeconds <= 0) return;
  timerRunning = true;
  elTimerLabel.textContent = 'Stay focused!';
  renderTimer();
  timerInterval = setInterval(() => {
    timerSeconds--;
    renderTimer();
    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      timerRunning  = false;
      elTimerLabel.textContent = '🎉 Session complete! Take a break.';
      elTimerDisplay.classList.remove('running');
    }
  }, 1000);
}

function stopTimer() {
  if (!timerRunning) return;
  clearInterval(timerInterval);
  timerInterval = null;
  timerRunning  = false;
  elTimerLabel.textContent = 'Paused. Resume when ready.';
  renderTimer();
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerRunning  = false;
  timerSeconds  = TIMER_DURATION;
  elTimerLabel.textContent = 'Ready to focus?';
  renderTimer();
}

elTimerStart.addEventListener('click', startTimer);
elTimerStop.addEventListener('click', stopTimer);
elTimerReset.addEventListener('click', resetTimer);
renderTimer();


/* =============================================================================
   3. TO-DO LIST  (existing — enhanced with sort)
   ============================================================================= */

/**
 * Loads tasks array from LocalStorage. Returns [] if none saved.
 * Normalizes legacy tasks that were saved before createdAt was introduced:
 * assigns a stable fallback based on array index so Newest/Oldest sort
 * still works predictably without corrupting the stored data.
 */
function loadTodos() {
  let todos;
  try {
    todos = JSON.parse(localStorage.getItem(LS_TODOS)) || [];
  } catch {
    return [];
  }

  // Normalize: give legacy tasks a synthetic createdAt so sorting is stable.
  // We use index * -1 so earlier items in the saved array sort as "older".
  let needsResave = false;
  todos.forEach((task, index) => {
    if (task.createdAt === undefined || task.createdAt === null) {
      // Use a small negative offset from now so all legacy tasks appear
      // before any newly-added task, preserving relative insertion order.
      task.createdAt = index + 1; // 1-based index as a stable relative value
      needsResave = true;
    }
  });

  if (needsResave) {
    saveTodos(todos);
  }

  return todos;
}

/**
 * Persists tasks array to LocalStorage.
 */
function saveTodos(todos) {
  localStorage.setItem(LS_TODOS, JSON.stringify(todos));
}

/**
 * Generates a simple unique ID.
 */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/* ── Challenge 3: Sort ─────────────────────────────────────────────────────── */

/**
 * Loads the saved sort preference. Defaults to 'newest'.
 */
function loadSortPreference() {
  return localStorage.getItem(LS_SORT) || 'newest';
}

/**
 * Persists the sort preference.
 */
function saveSortPreference(value) {
  localStorage.setItem(LS_SORT, value);
}

/**
 * Returns a sorted COPY of the todos array.
 * Does NOT mutate the original array or touch LocalStorage data.
 * @param {Array}  todos
 * @param {string} criterion — 'newest' | 'oldest' | 'completed' | 'pending'
 */
function sortTodos(todos, criterion) {
  const copy = [...todos];
  switch (criterion) {
    case 'oldest':
      // Ascending by createdAt (oldest first)
      copy.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      break;
    case 'completed':
      // Done tasks first, then pending
      copy.sort((a, b) => (b.done === a.done ? 0 : b.done ? 1 : -1));
      break;
    case 'pending':
      // Pending tasks first, then done
      copy.sort((a, b) => (a.done === b.done ? 0 : a.done ? 1 : -1));
      break;
    case 'newest':
    default:
      // Descending by createdAt (newest first)
      copy.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      break;
  }
  return copy;
}

/**
 * Renders the full todo list using the active sort preference.
 */
function renderTodos() {
  const todos    = loadTodos();
  const criterion = loadSortPreference();
  const sorted   = sortTodos(todos, criterion);

  elTodoList.innerHTML = '';
  elTodoEmpty.style.display = todos.length === 0 ? 'block' : 'none';

  sorted.forEach((task) => {
    const li = document.createElement('li');
    li.className = `todo-item${task.done ? ' done' : ''}`;
    li.dataset.id = task.id;

    li.innerHTML = `
      <input
        type="checkbox"
        class="todo-check"
        aria-label="Mark task done"
        ${task.done ? 'checked' : ''}
      />
      <span class="todo-text">${escapeHtml(task.text)}</span>
      <div class="todo-actions">
        <button class="btn-icon" title="Edit task" aria-label="Edit task">✏️</button>
        <button class="btn-icon btn-danger" title="Delete task" aria-label="Delete task">🗑️</button>
      </div>
    `;

    li.querySelector('.todo-check').addEventListener('change', (e) => {
      toggleTodoDone(task.id, e.target.checked);
    });

    li.querySelector('.btn-icon:not(.btn-danger)').addEventListener('click', () => {
      openEditModal(task.id, task.text);
    });

    li.querySelector('.btn-danger').addEventListener('click', () => {
      deleteTodo(task.id);
    });

    elTodoList.appendChild(li);
  });
}

/**
 * Adds a new task. Stores createdAt timestamp for sort support.
 */
function addTodo() {
  const text = elTodoInput.value.trim();
  if (!text) return;

  const todos = loadTodos();
  todos.push({ id: uid(), text, done: false, createdAt: Date.now() });
  saveTodos(todos);
  elTodoInput.value = '';
  renderTodos();
}

/**
 * Toggles the done state of a task by ID.
 */
function toggleTodoDone(id, done) {
  const todos = loadTodos();
  const task  = todos.find((t) => t.id === id);
  if (task) task.done = done;
  saveTodos(todos);
  renderTodos();
}

/**
 * Removes a task by ID.
 */
function deleteTodo(id) {
  const todos = loadTodos().filter((t) => t.id !== id);
  saveTodos(todos);
  renderTodos();
}

// ── Edit Modal (Tasks) ───────────────────────────────────────────────────────
let editingTodoId = null;

function openEditModal(id, currentText) {
  editingTodoId     = id;
  elEditInput.value = currentText;
  elEditModal.removeAttribute('hidden');
  elEditInput.focus();
}

function closeEditModal() {
  editingTodoId = null;
  elEditModal.setAttribute('hidden', '');
}

function saveEditedTodo() {
  const text = elEditInput.value.trim();
  if (!text || !editingTodoId) return;

  const todos = loadTodos();
  const task  = todos.find((t) => t.id === editingTodoId);
  if (task) task.text = text;
  saveTodos(todos);
  renderTodos();
  closeEditModal();
}

elEditSave.addEventListener('click', saveEditedTodo);
elEditCancel.addEventListener('click', closeEditModal);

elEditInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter')  saveEditedTodo();
  if (e.key === 'Escape') closeEditModal();
});

elEditModal.addEventListener('click', (e) => {
  if (e.target === elEditModal) closeEditModal();
});

elTodoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo();
});

elTodoAdd.addEventListener('click', addTodo);

// ── Sort dropdown event ──────────────────────────────────────────────────────
elSortSelect.addEventListener('change', () => {
  saveSortPreference(elSortSelect.value);
  renderTodos();
});

// Restore saved sort preference into the dropdown on load
elSortSelect.value = loadSortPreference();

// Initial render
renderTodos();


/* =============================================================================
   4. QUICK LINKS  (existing — unchanged)
   ============================================================================= */

function loadLinks() {
  try {
    return JSON.parse(localStorage.getItem(LS_LINKS)) || [];
  } catch {
    return [];
  }
}

function saveLinks(links) {
  localStorage.setItem(LS_LINKS, JSON.stringify(links));
}

/**
 * Normalizes a URL — ensures it starts with http(s)://.
 * Blocks dangerous protocols (javascript:, data:, vbscript:, etc.)
 * to prevent XSS via crafted link URLs.
 */
function normalizeUrl(url) {
  if (!url) return '';
  const trimmed = url.trim();
  // If it has a non-http(s) protocol, strip it and force https
  if (/^[a-z][a-z0-9+\-.]*:/i.test(trimmed) && !/^https?:/i.test(trimmed)) {
    return 'https://' + trimmed.replace(/^[^:]+:\/?\/?/, '');
  }
  if (!/^https?:\/\//i.test(trimmed)) return 'https://' + trimmed;
  return trimmed;
}

function faviconUrl(url) {
  try {
    const domain = new URL(normalizeUrl(url)).hostname;
    return `https://www.google.com/s2/favicons?sz=32&domain=${domain}`;
  } catch {
    return '';
  }
}

function renderLinks() {
  const links = loadLinks();

  elLinksGrid.innerHTML = '';
  elLinksEmpty.style.display = links.length === 0 ? 'block' : 'none';

  links.forEach((link) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'link-item';
    wrapper.dataset.id = link.id;

    const href = normalizeUrl(link.url);
    const fav  = faviconUrl(link.url);

    wrapper.innerHTML = `
      <a
        href="${escapeAttr(href)}"
        target="_blank"
        rel="noopener noreferrer"
        class="link-btn"
        title="${escapeAttr(link.url)}"
      >
        ${fav ? `<img class="link-favicon" src="${escapeAttr(fav)}" alt="" onerror="this.style.display='none'" />` : ''}
        ${escapeHtml(link.name)}
      </a>
      <button class="link-edit-btn" title="Edit link" aria-label="Edit link">✏️</button>
      <button class="link-delete-btn" title="Delete link" aria-label="Delete link">✕</button>
    `;

    wrapper.querySelector('.link-edit-btn').addEventListener('click', () => {
      openEditLinkModal(link.id, link.name, link.url);
    });

    wrapper.querySelector('.link-delete-btn').addEventListener('click', () => {
      deleteLink(link.id);
    });

    elLinksGrid.appendChild(wrapper);
  });
}

function addLink() {
  const name = elLinkName.value.trim();
  const url  = elLinkUrl.value.trim();

  if (!name || !url) {
    highlightEmpty(name ? null : elLinkName);
    highlightEmpty(url  ? null : elLinkUrl);
    return;
  }

  const links = loadLinks();
  links.push({ id: uid(), name, url });
  saveLinks(links);

  elLinkName.value = '';
  elLinkUrl.value  = '';
  renderLinks();
}

function deleteLink(id) {
  const links = loadLinks().filter((l) => l.id !== id);
  saveLinks(links);
  renderLinks();
}

function highlightEmpty(el) {
  if (!el) return;
  el.style.borderColor = 'var(--danger)';
  el.focus();
  setTimeout(() => (el.style.borderColor = ''), 1200);
}

// ── Edit Modal (Links) ───────────────────────────────────────────────────────
let editingLinkId = null;

function openEditLinkModal(id, name, url) {
  editingLinkId        = id;
  elEditLinkName.value = name;
  elEditLinkUrl.value  = url;
  elEditLinkModal.removeAttribute('hidden');
  elEditLinkName.focus();
}

function closeEditLinkModal() {
  editingLinkId = null;
  elEditLinkModal.setAttribute('hidden', '');
}

function saveEditedLink() {
  const name = elEditLinkName.value.trim();
  const url  = elEditLinkUrl.value.trim();
  if (!name || !url || !editingLinkId) return;

  const links = loadLinks();
  const link  = links.find((l) => l.id === editingLinkId);
  if (link) { link.name = name; link.url = url; }
  saveLinks(links);
  renderLinks();
  closeEditLinkModal();
}

elEditLinkSave.addEventListener('click', saveEditedLink);
elEditLinkCancel.addEventListener('click', closeEditLinkModal);

elEditLinkUrl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter')  saveEditedLink();
  if (e.key === 'Escape') closeEditLinkModal();
});

elEditLinkModal.addEventListener('click', (e) => {
  if (e.target === elEditLinkModal) closeEditLinkModal();
});

elLinkAdd.addEventListener('click', addLink);

elLinkUrl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addLink();
});

renderLinks();


/* =============================================================================
   5. UTILITIES  (existing — unchanged)
   ============================================================================= */

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
