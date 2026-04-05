// DOM Elements
const todoInput = document.getElementById('taskInput');
const taskDateInput = document.getElementById('taskDate');
const dateDisplay = document.getElementById('selectedDateDisplay');
const addButton = document.getElementById('addTaskBtn');
const toggleCompletedBtn = document.getElementById('toggleCompletedBtn');

console.log('DOM elements:', { todoInput, taskDateInput, dateDisplay, addButton, toggleCompletedBtn });

const overdueList = document.getElementById('overdueList');
const activeList = document.getElementById('activeList');
const upcomingList = document.getElementById('upcomingList');
const completedList = document.getElementById('completedList');

const overdueSection = document.getElementById('overdueSection');
const activeSection = document.getElementById('activeSection');
const upcomingSection = document.getElementById('upcomingSection');
const completedSection = document.getElementById('completedSection');

// App State
let todos = [];
let editingId = null;
let showCompleted = false;

// Initialization
window.onload = function() {
    const now = new Date();
    // Use local date for default input value (YYYY-MM-DD)
    const localToday = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    taskDateInput.value = localToday;
    taskDateInput.min = localToday; // Prevent choosing older dates
    updateDateDisplay();

    taskDateInput.addEventListener('change', updateDateDisplay);

    const dateButton = document.querySelector('.date-button');
    if (dateButton) {
        dateButton.addEventListener('click', function() {
            if (typeof taskDateInput.showPicker === 'function') {
                taskDateInput.showPicker();
            } else {
                taskDateInput.focus();
            }
        });
    }

    addButton.addEventListener('click', function() {
        console.log('Add button clicked');
        const todoText = todoInput.value.trim();
        const dueDate = taskDateInput.value;
        console.log('Todo text:', todoText, 'Due date:', dueDate);
        if (!todoText) return alert("Please enter a task name");

        const newTodo = {
            id: Date.now(),
            text: todoText,
            completed: false,
            dueDate: dueDate,
            createdAt: new Date().toISOString()
        };

        todos.push(newTodo);
        saveTodos();
        renderTodos();
        todoInput.value = '';
    });

    toggleCompletedBtn.addEventListener('click', function() {
        showCompleted = !showCompleted;
        const span = toggleCompletedBtn.querySelector('span');
        const svg = toggleCompletedBtn.querySelector('svg');

        if (showCompleted) {
            span.textContent = 'Hide Completed';
            svg.style.transform = 'rotate(180deg)';
        } else {
            span.textContent = 'Show Completed';
            svg.style.transform = 'rotate(0deg)';
        }
        renderTodos();
    });

    loadTodos();
};

// Date handling
function updateDateDisplay() {
    const selectedDate = taskDateInput.value;
    if (selectedDate) {
        dateDisplay.style.display = 'inline-block';
        const date = new Date(selectedDate + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date.getTime() === today.getTime()) {
            dateDisplay.textContent = 'Today';
        } else {
            dateDisplay.textContent = date.toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric'
            });
        }
    } else {
        dateDisplay.textContent = '';
        dateDisplay.style.display = 'none';
    }
}

// Storage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
    const stored = localStorage.getItem('todos');
    let loaded = false;

    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                todos = parsed.map(item => ({
                    ...item,
                    dueDate: item && item.dueDate ? item.dueDate : new Date().toISOString().slice(0, 10)
                }));
                loaded = true;
            }
        } catch (err) {
            console.warn('Could not parse localStorage.todos', err);
        }
    }

    if (!loaded) {
        const legacy = localStorage.getItem('content');
        if (legacy) {
            try {
                let parsed = JSON.parse(legacy);

                if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && Array.isArray(parsed.content)) {
                    parsed = parsed.content;
                }

                if (Array.isArray(parsed)) {
                    const items = parsed.flatMap(item => Array.isArray(item) ? item : item);
                    todos = items.map(item => ({
                        id: item && item.id ? item.id : Date.now() + Math.random(),
                        text: item && (item.text || item.name) ? (item.text || item.name) : '',
                        completed: !!(item && item.completed),
                        dueDate: item && (item.dueDate || item.date) ? (item.dueDate || item.date) : new Date().toISOString().slice(0, 10),
                        createdAt: item && item.createdAt ? item.createdAt : new Date().toISOString()
                    })).filter(item => item.text);
                    loaded = todos.length > 0;
                    if (loaded) saveTodos();
                }
            } catch (err) {
                console.warn('Could not parse legacy localStorage.content', err);
            }
        }
    }

    renderTodos();
}

// Task categorization
function getTaskCategory(todo) {
    if (todo.completed) return 'completed';

    const [year, month, day] = (todo.dueDate || '').split('-').map(Number);
    const dueDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (Number.isNaN(dueDate.getTime())) return 'upcoming';
    if (dueDate.getTime() < today.getTime()) return 'overdue';
    if (dueDate.getTime() === today.getTime()) return 'active';
    return 'upcoming';
}

function formatDateDisplay(dateString) {
    const [year, month, day] = (dateString || '').split('-').map(Number);
    const date = new Date(year, month - 1, day);

    if (!year || !month || !day || Number.isNaN(date.getTime())) {
        return 'No date';
    }

    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

// Rendering
// This function loops through all saved todos, groups them by category, and appends each task element to the correct list.
function renderTodos() {
    // Clear all lists to prevent duplication
    overdueList.innerHTML = '';
    activeList.innerHTML = '';
    upcomingList.innerHTML = '';
    completedList.innerHTML = '';

    // Group todos by category
    const categorized = {
        overdue: [],
        active: [],
        upcoming: [],
        completed: []
    };

    todos.forEach(todo => {
        const category = getTaskCategory(todo);
        if (categorized[category]) {
            categorized[category].push(todo);
        }
    });

    // Explicitly render each category to ensure clarity
    const categories = ['overdue', 'active', 'upcoming', 'completed'];
    
    categories.forEach(category => {
        const list = categorized[category];
        const listElement = getListElement(category);
        
        if (listElement) {
            // For completed tasks, we might only want to show the most recent ones (e.g., top 5)
            const itemsToRender = category === 'completed' ? list.slice(0, 5) : list;

            itemsToRender.forEach(todo => {
                const element = createTaskElement(todo);
                listElement.appendChild(element);
            });
        }
    });

    // Show/hide sections based on whether they contain items
    // Today and Upcoming are now correctly managed and will be visible if they have tasks
    overdueSection.style.display = categorized.overdue.length > 0 ? 'block' : 'none';
    activeSection.style.display = categorized.active.length > 0 ? 'block' : 'none';
    upcomingSection.style.display = categorized.upcoming.length > 0 ? 'block' : 'none';
    
    // Completed section visibility depends on both having items and the toggle state
    completedSection.style.display = (showCompleted && categorized.completed.length > 0) ? 'block' : 'none';
    
    console.log('UI Rendered:', {
        overdue: categorized.overdue.length,
        active: categorized.active.length,
        upcoming: categorized.upcoming.length,
        completed: categorized.completed.length,
        showCompleted
    });
}

function getListElement(category) {
    switch (category) {
        case 'overdue': return overdueList;
        case 'active': return activeList;
        case 'upcoming': return upcomingList;
        case 'completed': return completedList;
    }
}

function createTaskElement(todo) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    const category = getTaskCategory(todo);

    if (todo.completed) li.classList.add('completed-item');
    else if (category === 'overdue') li.classList.add('overdue-item');

    // Edit mode: replace the task row with an input field and save button when the task is being edited.
    if (editingId === todo.id) {
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.className = 'edit-input';
        editInput.value = todo.text;

        const actions = document.createElement('div');
        actions.className = 'actions';
        const saveBtn = document.createElement('button');
        saveBtn.textContent = '✓';
        saveBtn.className = 'edit-btn';
        saveBtn.style.backgroundColor = 'var(--success)';
        saveBtn.onclick = () => {
            const newText = editInput.value.trim();
            if (newText) {
                todo.text = newText;
                saveTodos();
            }
            editingId = null;
            renderTodos();
        };

        li.appendChild(editInput);
        actions.appendChild(saveBtn);
        li.appendChild(actions);
        setTimeout(() => editInput.focus(), 0);
    } else {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox-input';
        checkbox.checked = todo.completed;
        checkbox.onchange = () => {
            todo.completed = checkbox.checked;
            saveTodos();
            renderTodos();
        };

        const taskContent = document.createElement('span');
        taskContent.className = 'task-content';
        taskContent.textContent = todo.text;
        taskContent.onclick = () => {
            if (category !== 'overdue') {
                todo.completed = !todo.completed;
                saveTodos();
                renderTodos();
            }
        };

        const dateBadge = document.createElement('span');
        dateBadge.className = 'time-badge';
        dateBadge.textContent = formatDateDisplay(todo.dueDate);

        const actions = document.createElement('div');
        actions.className = 'actions';
        const editButton = document.createElement('button');
        editButton.innerHTML = '✎';
        editButton.className = 'edit-btn';
        editButton.onclick = (e) => {
            e.stopPropagation();
            editingId = todo.id;
            renderTodos();
        };

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '✖';
        deleteButton.className = 'delete-btn';
        deleteButton.onclick = (e) => {
            e.stopPropagation();
            todos = todos.filter(t => t.id !== todo.id);
            saveTodos();
            renderTodos();
        };

        li.appendChild(checkbox);
        li.appendChild(taskContent);
        li.appendChild(dateBadge);
        actions.appendChild(editButton);
        actions.appendChild(deleteButton);
        li.appendChild(actions);
    }
    return li;
}
