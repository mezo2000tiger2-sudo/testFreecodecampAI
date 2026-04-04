//to-do app crud operations with local storage and an array to hold the to-do items

// Get references to DOM elements
const todoInput = document.getElementById('taskInput');
const addButton = document.getElementById('addTaskBtn');
const todoList = document.getElementById('taskList');
// Array to hold to-do items
let todos = [];
// Load to-do items from local storage
window.onload = function() {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
        todos = JSON.parse(storedTodos);
        renderTodos();
    }
};
// Add a new to-do item
addButton.addEventListener('click', function() {
    const todoText = todoInput.value.trim();
    if (todoText) {
        const newTodo = {
            id: Date.now(),
            text: todoText,
            completed: false
        };
        todos.push(newTodo);
        saveTodos();
        renderTodos();
        todoInput.value = '';
    }
});
// Save to-do items to local storage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}
// Render to-do items to the DOM
function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach(todo => {
        const li = document.createElement('li');
        li.textContent = todo.text;
        if (todo.completed) {
            li.classList.add('completed');
        }
        // Toggle completion status of a to-do item
        li.addEventListener('click', function() {
            todo.completed = !todo.completed;
            saveTodos();
            renderTodos();
        });
        // Add an edit button for each to-do item
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-btn';
        editButton.addEventListener('click', function() {
            const newText = prompt('Edit task:', todo.text);
            if (newText !== null && newText.trim() !== '') {
                todo.text = newText.trim();
                saveTodos();
                renderTodos();
            }
        });
        li.appendChild(editButton);
        // Add a delete button for each to-do item
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-btn';
        deleteButton.addEventListener('click', function() {
            todos = todos.filter(t => t.id !== todo.id);
            saveTodos();
            renderTodos();
        });
        li.appendChild(deleteButton);
        todoList.appendChild(li);
    });
}
