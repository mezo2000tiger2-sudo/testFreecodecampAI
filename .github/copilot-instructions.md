# GitHub Copilot Instructions

This repository is a small static frontend project for a simple to-do app.

## Repository structure
- `index.html` — main page markup and embedded styling.
- `todo.js` — app logic for task creation, editing, deletion, completion state, and local storage persistence.
- `demo.js` — separate demo utilities, not part of the main to-do app flow.

## What to do
- Make changes only when asked, and keep them minimal and targeted.
- Preserve the static HTML/JavaScript nature of the project.
- Prefer browser-native DOM APIs and cross-browser-friendly JavaScript.
- Keep styling simple, responsive, and accessible.
- Load `todo.js` at the end of `index.html` so DOM elements exist when the script runs.

## How to run
- Open `index.html` in a browser.
- No build tools, package manager, or server setup are required.

## Notes for Copilot
- `index.html` should remain the entry point.
- `todo.js` uses IDs: `taskInput`, `addTaskBtn`, `taskList`.
- `demo.js` can be left unchanged unless the task explicitly involves it.

## Example prompts
- "Fix any JavaScript bugs in `todo.js` and make the to-do list editable." 
- "Add styling improvements to `index.html` and keep the page responsive." 
- "Add a button to clear all completed tasks in the to-do app." 
- "Move the CSS from `index.html` into a new external stylesheet and update the page accordingly."

## When to create more customization
- If the project grows beyond a simple static site, add a dedicated `AGENTS.md` or specialized prompt file for frontend/UI tasks.
- For future work, consider adding a prompt file that describes UI, accessibility, and JavaScript conventions for this repository.