# Project Guidelines

## Code Style
- Use CSS variables for consistent theming (defined in `index.html`)
- Prefer modern event listeners (`addEventListener`) over inline handlers
- Follow glassmorphism aesthetic for new UI elements

## Architecture
- Single Page Application with all logic in `todo.js`
- Central `todos` array for state management
- UI re-renders via `renderTodos()` on state changes
- Persistence through browser `localStorage`

## Build and Test
- No build steps required - client-side only
- Run by opening `index.html` in any modern web browser
- No automated tests - manual testing for CRUD operations

## Conventions
- Update state, then call `saveTodos()` and `renderTodos()`
- Date handling uses local time for user experience
- Tasks categorized by due date: overdue, today, upcoming, completed