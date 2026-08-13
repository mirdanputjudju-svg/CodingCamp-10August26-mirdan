/* =============================================
   LIFE DASHBOARD — app.js
   Vanilla JavaScript | No frameworks
   ============================================= */

'use strict';

// ─── LocalStorage Keys ───────────────────────────────────────────────────────
const LS_TODOS = 'dashboard_todos';
const LS_LINKS = 'dashboard_links';

// ─── DOM References ───────────────────────────────────────────────────────────
const $ = (id) => document.getElementById(id);

// Greeting
const elDate     = $('current-date');
const elGreeting = $('greeting-text');
const elTime     = $('current-time');

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

// Edit Task Modal
const elEditModal  = $('edit-modal');
const elEditInput  = $('edit-input');
const elEditSave   = $('edit-save');
const elEditCancel = $('edit-cancel');

// Links
const elLinkName      = $('link-name-input');
const elLinkUrl       = $('link-url-input');
const elLinkAdd       = $('link-add');
const elLinksGrid     = $('links-grid');
const elLinksEmpty    = $('links-empty');

// Edit Link Modal
const elEditLinkModal  = $('edit-link-modal');
const elEditLinkName   = $('edit-link-name');
const elEditLinkUrl    = $('edit-link-url');
const elEditLinkSave   = $('edit-link-save');
const elEditLinkCancel = $('edit-link-cancel');


/* =============================================================================
   1. GREETING & CLOCK
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
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Formats a Date to a HH:MM:SS 12-hour string.
 */
function formatTime(date) {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

/**
 * Updates the greeting, date, and live clock every second.
 */
function updateClock() {
  const now  = new Date();
  const hour = now.getHours();

  elGreeting.textContent = getGreeting(hour) + ' 👋';
  elDate.textContent     = formatDate(now);
  elTime.textContent     = formatTime(now);
}

// Kick off the clock immediately, then tick every second
updateClock();
setInterval(updateClock, 1000);


/* =============================================================================
   2. FOCUS TIMER
   ============================================================================= */

const TIMER_DURATION = 25 * 60; // 25 minutes in seconds

let timerSeconds   = TIMER_DURATION;
let timerInterval  = null;
let timerRunning   = false;

/**
 * Converts total seconds into MM:SS display string.
 */
function formatTimerDisplay(secs) {
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${m}:${s}`;
}

/**
 * Renders the current timer state to the DOM.
 */
function renderTimer() {
  elTimerDisplay.textContent = formatTimerDisplay(timerSeconds);
  elTimerDisplay.classList.toggle('running', timerRunning);
}

/**
 * Starts or resumes the countdown.
 */
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
      timerRunning = false;
      elTimerLabel.textContent = '🎉 Session complete! Take a break.';
      elTimerDisplay.classList.remove('running');
    }
  }, 1000);
}

/**
 * Pauses the countdown.
 */
function stopTimer() {
  if (!timerRunning) return;
  clearInterval(timerInterval);
  timerRunning = false;
  elTimerLabel.textContent = 'Paused. Resume when ready.';
  renderTimer();
}

/**
 * Resets timer back to 25 minutes.
 */
function resetTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  timerSeconds = TIMER_DURATION;
  elTimerLabel.textContent = 'Ready to focus?';
  renderTimer();
}

elTimerStart.addEventListener('click', startTimer);
elTimerStop.addEventListener('click', stopTimer);
elTimerReset.addEventListener('click', resetTimer);

// Initial render
renderTimer();


/* =============================================================================
   3. TO-DO LIST
   ============================================================================= */

/**
 * Loads tasks array from LocalStorage. Returns [] if none saved.
 */
function loadTodos() {
  try {
    return JSON.parse(localStorage.getItem(LS_TODOS)) || [];
  } catch {
    return [];
  }
}

/**
 * Persists tasks array to LocalStorage.
 */
function saveTodos(todos) {
  localStorage.setItem(LS_TODOS, JSON.stringify(todos));
}

/**
 * Generates a simple unique ID using timestamp + random.
 */
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

/**
 * Renders the full todo list from the current state.
 */
function renderTodos() {
  const todos = loadTodos();

  elTodoList.innerHTML = '';
  elTodoEmpty.style.display = todos.length === 0 ? 'block' : 'none';

  todos.forEach((task) => {
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

    // Toggle done
    li.querySelector('.todo-check').addEventListener('change', (e) => {
      toggleTodoDone(task.id, e.target.checked);
    });

    // Edit
    li.querySelector('.btn-icon:not(.btn-danger)').addEventListener('click', () => {
      openEditModal(task.id, task.text);
    });

    // Delete
    li.querySelector('.btn-danger').addEventListener('click', () => {
      deleteTodo(task.id);
    });

    elTodoList.appendChild(li);
  });
}

/**
 * Adds a new task from the input field.
 */
function addTodo() {
  const text = elTodoInput.value.trim();
  if (!text) return;

  const todos = loadTodos();
  todos.push({ id: uid(), text, done: false });
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
  editingTodoId = id;
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

// Save on Enter in edit input
elEditInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') saveEditedTodo();
  if (e.key === 'Escape') closeEditModal();
});

// Close modal on overlay click
elEditModal.addEventListener('click', (e) => {
  if (e.target === elEditModal) closeEditModal();
});

// Add on Enter in todo input
elTodoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo();
});

elTodoAdd.addEventListener('click', addTodo);

// Initial render
renderTodos();


/* =============================================================================
   4. QUICK LINKS
   ============================================================================= */

/**
 * Loads links array from LocalStorage.
 */
function loadLinks() {
  try {
    return JSON.parse(localStorage.getItem(LS_LINKS)) || [];
  } catch {
    return [];
  }
}

/**
 * Persists links array to LocalStorage.
 */
function saveLinks(links) {
  localStorage.setItem(LS_LINKS, JSON.stringify(links));
}

/**
 * Normalizes a URL — ensures it starts with http(s)://.
 */
function normalizeUrl(url) {
  if (!url) return '';
  if (!/^https?:\/\//i.test(url)) return 'https://' + url;
  return url;
}

/**
 * Returns a Google favicon URL for a given site URL.
 */
function faviconUrl(url) {
  try {
    const domain = new URL(normalizeUrl(url)).hostname;
    return `https://www.google.com/s2/favicons?sz=32&domain=${domain}`;
  } catch {
    return '';
  }
}

/**
 * Renders the quick links grid.
 */
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

/**
 * Adds a new quick link.
 */
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

/**
 * Removes a link by ID.
 */
function deleteLink(id) {
  const links = loadLinks().filter((l) => l.id !== id);
  saveLinks(links);
  renderLinks();
}

/**
 * Briefly flashes an input border red to indicate it is required.
 */
function highlightEmpty(el) {
  if (!el) return;
  el.style.borderColor = 'var(--danger)';
  el.focus();
  setTimeout(() => (el.style.borderColor = ''), 1200);
}

// ── Edit Modal (Links) ───────────────────────────────────────────────────────
let editingLinkId = null;

function openEditLinkModal(id, name, url) {
  editingLinkId = id;
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
  if (e.key === 'Enter') saveEditedLink();
  if (e.key === 'Escape') closeEditLinkModal();
});

elEditLinkModal.addEventListener('click', (e) => {
  if (e.target === elEditLinkModal) closeEditLinkModal();
});

elLinkAdd.addEventListener('click', addLink);

elLinkUrl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addLink();
});

// Initial render
renderLinks();


/* =============================================================================
   5. UTILITIES
   ============================================================================= */

/**
 * Escapes HTML special characters to prevent XSS when rendering user text.
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Escapes characters that could break out of an HTML attribute value.
 */
function escapeAttr(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
