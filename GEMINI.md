# Project Overview
A modern, visually appealing To-Do application built with vanilla web technologies. It features a "glassmorphism" aesthetic and supports full CRUD (Create, Read, Update, Delete) operations with persistent storage using the browser's `localStorage`.

## Main Technologies
- **HTML5:** Semantic structure.
- **CSS3:** Modern styling with CSS variables, Flexbox, and backdrop-filter (glassmorphism).
- **JavaScript (Vanilla):** DOM manipulation, event handling, and state management.

## Architecture
- **Single Page Application (SPA):** All interactions occur within `index.html`.
- **Persistence:** Task data is serialized and stored in `localStorage` as a JSON string.
- **State-Driven UI:** The UI is re-rendered whenever the `todos` array is updated.

## Key Files
- `index.html`: Contains the core structure and modern CSS styles.
- `todo.js`: Implements the application logic, including inline editing and local storage sync.
- `demo.js`: A utility file containing a circle area calculator and basic fetch logic.

## Building and Running
Since this is a client-side only project, there are no build steps.
- **To Run:** Open `index.html` in any modern web browser.
- **Testing:** Currently, there are no automated tests. Manual testing should verify task creation, completion toggling, inline editing, and deletion.

## Development Conventions
- **Styling:** Prefer CSS variables for consistent theming.
- **Interactivity:** Use modern event listeners (e.g., `addEventListener`).
- **State Management:** Maintain a central `todos` array and call `renderTodos()` and `saveTodos()` on every change.
- **UI Consistency:** Ensure all new interactive elements follow the glassmorphism theme defined in `index.html`.
