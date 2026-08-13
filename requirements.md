# Requirements — Todo List Life Dashboard

## Project Overview
A client-side Life Dashboard web application built with plain HTML, CSS, and Vanilla JavaScript. No frameworks, no backend. All data is persisted in the browser's LocalStorage.

---

## Technical Constraints

### TC-1: Technology Stack
- HTML for structure
- CSS for styling
- Vanilla JavaScript (no React, Vue, or any other framework)
- No backend server required

### TC-2: Data Storage
- Browser LocalStorage API
- All data stored client-side only

| Key | Purpose |
|-----|---------|
| `dashboard_todos` | Saved task list |
| `dashboard_links` | Saved quick links |
| `dashboard_theme` | Saved theme preference (dark / light) |
| `dashboard_user_name` | Saved user name for greeting |
| `dashboard_sort` | Saved sort preference for tasks |

### TC-3: Browser Compatibility
- Chrome, Firefox, Edge, Safari (modern versions)
- Can be used as a standalone web app or browser extension

---

## Non-Functional Requirements

### NFR-1: Simplicity
- Clean, minimal interface
- Easy to understand and use without setup
- No test framework required

### NFR-2: Performance
- Fast load time (no external dependencies)
- Responsive UI — no noticeable lag when updating data

### NFR-3: Visual Design
- User-friendly aesthetic
- Clear visual hierarchy
- Readable typography
- Responsive for both mobile and desktop

---

## Folder Rules
- Only **1 CSS file** inside `css/` → `css/styles.css`
- Only **1 JavaScript file** inside `js/` → `js/app.js`
- Code must be clean and readable

---

## MVP Features

### 1. Greeting
- Show current date (e.g. "Thursday, August 13, 2026")
- Show live clock updated every second
- Show greeting based on time of day:
  - 05:00–11:59 → Good morning
  - 12:00–16:59 → Good afternoon
  - 17:00–20:59 → Good evening
  - 21:00–04:59 → Good night

### 2. Focus Timer
- 25-minute countdown timer
- **Start** — begins or resumes the countdown
- **Stop** — pauses the countdown
- **Reset** — resets to 25:00

### 3. To-Do List
- Add tasks via text input (Enter key or Add button)
- Edit tasks via inline modal
- Mark tasks as done (checkbox)
- Delete tasks
- All tasks saved in LocalStorage (`dashboard_todos`)

### 4. Quick Links
- Add links with a name and URL
- Click a link button to open the URL in a new tab
- Edit and delete saved links
- All links saved in LocalStorage (`dashboard_links`)

---

## Challenge Features (RevoU Brief)

### Challenge 1 — Light / Dark Mode
- Toggle button in the header to switch between Dark and Light theme
- Default theme: Dark
- Theme changes instantly without page reload
- Theme preference saved in LocalStorage (`dashboard_theme`)
- Theme is restored on page refresh
- All UI elements remain readable in both themes (text, cards, inputs, buttons, modals)
- Implemented using CSS variables — no separate CSS file

### Challenge 2 — Custom Name in Greeting
- User can enter their name via a "Set Name" button in the header
- Name saved in LocalStorage (`dashboard_user_name`)
- Greeting displays name when available:
  - With name: `Good morning, Mirdan 👋`
  - Without name: `Good morning 👋`
- Name persists after page refresh
- Name can be updated at any time
- Uses an HTML modal — no browser `prompt()`

### Challenge 3 — Sort Tasks
- Dropdown in the To-Do List section to sort tasks by:
  - **Newest** — most recently added first
  - **Oldest** — oldest tasks first
  - **Completed** — done tasks first
  - **Pending** — incomplete tasks first
- Sorting only changes display order — no data is deleted or modified
- LocalStorage data structure is preserved
- Sort preference saved in LocalStorage (`dashboard_sort`)
- Sorting applies immediately and persists after refresh
- Sorting continues to work correctly after add, edit, complete, and delete actions

---

## File Structure

```
project-root/
├── index.html
├── requirements.md
├── css/
│   └── styles.css
├── js/
│   └── app.js
└── .vscode/
    └── settings.json
```

---

## LocalStorage Data Structures

### Tasks (`dashboard_todos`)
```json
[
  {
    "id": "abc123",
    "text": "Finish the project",
    "done": false,
    "createdAt": 1723500000000
  }
]
```

### Links (`dashboard_links`)
```json
[
  {
    "id": "xyz456",
    "name": "GitHub",
    "url": "https://github.com"
  }
]
```

### Theme (`dashboard_theme`)
```
"dark" | "light"
```

### User Name (`dashboard_user_name`)
```
"Mirdan"
```

### Sort Preference (`dashboard_sort`)
```
"newest" | "oldest" | "completed" | "pending"
```
