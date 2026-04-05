# Project Overview
A modern, visually appealing To-Do application built with vanilla web technologies. It features a "glassmorphism" aesthetic and supports full CRUD (Create, Read, Update, Delete) operations with persistent storage using the browser's `localStorage`.

## Main Technologies
- **HTML5:** Semantic structure for the task manager.
- **CSS3:** Modern styling with CSS variables, Flexbox, and backdrop-filter (glassmorphism).
- **JavaScript (Vanilla):** DOM manipulation, event handling, and state management without external frameworks.

## Architecture
- **Single Page Application (SPA):** All interactions occur within `index.html`.
- **Persistence:** Task data is serialized and stored in `localStorage` as a JSON string under the key `todos`.
- **State-Driven UI:** The UI is re-rendered via `renderTodos()` whenever the `todos` array is updated.
- **Task Categorization:** Tasks are automatically grouped into "Overdue", "Today", "Upcoming", and "Completed" based on their due dates.

## Key Files
- `index.html`: Contains the core structure and modern embedded CSS styles.
- `todo.js`: Implements the application logic, including task creation, inline editing, deletion, and local storage synchronization.
- `demo.js`: A utility file containing a circle area calculator and basic fetch logic (independent of the main app).
- `package.json`: Project metadata and testing configuration (Jest).

## Building and Running
Since this is a client-side only project, there are no mandatory build steps.
- **To Run:** Open `index.html` in any modern web browser.
- **Testing:** Run `npm test` to execute Jest tests (requires `npm install`).
- **Manual Testing:** Verify task creation, completion toggling, inline editing, and deletion.

## Development Conventions
- **Styling:** Prefer CSS variables for consistent theming and maintain the glassmorphism aesthetic.
- **Interactivity:** Use modern event listeners (e.g., `addEventListener`) and browser-native DOM APIs.
- **State Management:** Maintain a central `todos` array and call `renderTodos()` and `saveTodos()` on every change.
- **UI Consistency:** Ensure all new interactive elements follow the design patterns defined in `index.html`.
- **Logic:** Keep `todo.js` as the primary logic file and ensure it is loaded at the end of `index.html`.
