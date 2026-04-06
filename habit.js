// State Management
let habits = JSON.parse(localStorage.getItem('habits')) || [];

const habitInput = document.getElementById('habitInput');
const addHabitBtn = document.getElementById('addHabitBtn');
const habitList = document.getElementById('habitList');

// Helper to get today's date string (YYYY-MM-DD)
function getTodayStr() {
    return new Date().toISOString().split('T')[0];
}

// Helper to get yesterday's date string (YYYY-MM-DD)
function getYesterdayStr() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
}

// Check for missed days and reset streaks
function checkStreaks() {
    const today = getTodayStr();
    const yesterday = getYesterdayStr();
    let changed = false;

    habits.forEach(habit => {
        if (habit.lastCompleted) {
            // If the last completion wasn't today or yesterday, they missed a day
            if (habit.lastCompleted !== today && habit.lastCompleted !== yesterday) {
                habit.streak = 0;
                changed = true;
            }
        }
    });

    if (changed) {
        saveHabits();
    }
}

function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
    renderHabits();
}

function addHabit() {
    const name = habitInput.value.trim();
    if (!name) return;

    const newHabit = {
        id: Date.now(),
        name: name,
        streak: 0,
        lastCompleted: null
    };

    habits.push(newHabit);
    habitInput.value = '';
    saveHabits();
}

function toggleHabit(id) {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const today = getTodayStr();

    if (habit.lastCompleted === today) {
        // Un-check (reduce streak)
        habit.streak = Math.max(0, habit.streak - 1);
        habit.lastCompleted = getYesterdayStr(); // Set back to yesterday to allow re-checking
    } else {
        // Check (increase streak)
        habit.streak += 1;
        habit.lastCompleted = today;
    }

    saveHabits();
}

function deleteHabit(id) {
    habits = habits.filter(h => h.id !== id);
    saveHabits();
}

function renderHabits() {
    habitList.innerHTML = '';
    const today = getTodayStr();

    habits.forEach(habit => {
        const li = document.createElement('li');
        li.className = 'habit-item';
        
        const isChecked = habit.lastCompleted === today;

        li.innerHTML = `
            <button class="check-btn ${isChecked ? 'checked' : ''}" onclick="toggleHabit(${habit.id})">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            </button>
            <div class="habit-content">
                <span class="habit-name">${habit.name}</span>
                <span class="habit-streak">
                    <span class="streak-fire">🔥</span> ${habit.streak} Day Streak
                </span>
            </div>
            <button class="delete-btn" onclick="deleteHabit(${habit.id})">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </button>
        `;
        habitList.appendChild(li);
    });
}

// Event Listeners
addHabitBtn.addEventListener('click', addHabit);
habitInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addHabit();
});

// Expose functions to global scope for onclick handlers
window.toggleHabit = toggleHabit;
window.deleteHabit = deleteHabit;

// Initial checks and render
checkStreaks();
renderHabits();