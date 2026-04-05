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
        console.log('Added todo:', newTodo);
        saveTodos();
        renderTodos();
        todoInput.value = '';
    });

    toggleCompletedBtn.addEventListener('click', () => {
        showCompleted = !showCompleted;
        toggleCompletedBtn.querySelector('span').textContent = showCompleted ? "Hide Completed" : "Show Completed";
        toggleCompletedBtn.querySelector('svg').style.transform = showCompleted ? "rotate(180deg)" : "rotate(0deg)";
        renderTodos();
    });

    // Load from local storage
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
        try {
            todos = JSON.parse(storedTodos);
        } catch (e) {
            todos = [];
        }
    }
    
    renderTodos();
    setInterval(renderTodos, 60000); // Check for day changes
};

function updateDateDisplay() {
    if (!taskDateInput.value) return;
    const [y, m, d] = taskDateInput.value.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    dateDisplay.textContent = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTaskCategory(todo) {
    const now = new Date();
    // Get local date at midnight for today
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    // Parse Due Date in local time
    const [y, m, d] = todo.dueDate.split('-').map(Number);
    const dueDateTimestamp = new Date(y, m - 1, d).getTime();

    // Unfinished tasks only
    if (dueDateTimestamp < today) return 'overdue';
    if (dueDateTimestamp === today) return 'today';
    return 'upcoming';
}

function formatDateDisplay(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function createTaskElement(todo) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    const category = getTaskCategory(todo);
    
    if (todo.completed) li.classList.add('completed-item');
    else if (category === 'overdue') li.classList.add('overdue-item');

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

function renderTodos() {
    overdueList.innerHTML = '';
    activeList.innerHTML = '';
    upcomingList.innerHTML = '';
    completedList.innerHTML = '';

    let counts = { overdue: 0, today: 0, upcoming: 0, completed: 0 };
    const sortedTodos = [...todos].sort((a, b) => a.dueDate.localeCompare(b.dueDate));

    // Handle completed tasks separately
    if (showCompleted) {
        const completedTodos = sortedTodos.filter(todo => todo.completed).slice(0, 5);
        completedTodos.forEach(todo => {
            const element = createTaskElement(todo);
            completedList.appendChild(element);
            counts.completed++;
        });
    }

    sortedTodos.forEach(todo => {
        if (todo.completed) return;

        const category = getTaskCategory(todo);
        const element = createTaskElement(todo);
        if (category === 'overdue') {
            overdueList.appendChild(element);
            counts.overdue++;
        } else if (category === 'today') {
            activeList.appendChild(element);
            counts.today++;
        } else if (category === 'upcoming') {
            upcomingList.appendChild(element);
            counts.upcoming++;
        }
    });

    overdueSection.style.display = counts.overdue > 0 ? 'block' : 'none';
    upcomingSection.style.display = counts.upcoming > 0 ? 'block' : 'none';
    completedSection.style.display = showCompleted && counts.completed > 0 ? 'block' : 'none';
}
