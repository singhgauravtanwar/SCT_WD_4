
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

// Display tasks
function displayTasks() {

    const taskList = document.getElementById("taskList");

    taskList.innerHTML = "";

    let filteredTasks = tasks.filter(task => {

        if (currentFilter === "pending") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.className = task.completed ? "task completed" : "task";

        li.innerHTML = `
            <div class="task-info">
                <h3>${escapeHTML(task.name)}</h3>
                <p>📅 ${task.date || "No date"} | ⏰ ${task.time || "No time"}</p>
            </div>

            <div class="task-buttons">
                <button class="done-btn" onclick="toggleTask(${task.id})">
                    ${task.completed ? "Undo" : "Done"}
                </button>

                <button class="delete-btn" onclick="deleteTask(${task.id})">
                    Delete
                </button>
            </div>
        `;

        taskList.appendChild(li);
    });

    updateCount();

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Escape user input before displaying it as HTML
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

// Add new task
function addTask() {

    const taskInput = document.getElementById("taskInput");
    const taskDate = document.getElementById("taskDate");
    const taskTime = document.getElementById("taskTime");

    const taskName = taskInput.value.trim();

    if (taskName === "") {
        alert("Please enter a task!");
        return;
    }

    const task = {
        id: Date.now(),
        name: taskName,
        date: taskDate.value,
        time: taskTime.value,
        completed: false
    };

    tasks.push(task);

    taskInput.value = "";
    taskDate.value = "";
    taskTime.value = "";

    displayTasks();
}

// Complete or undo task
function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {
            task.completed = !task.completed;
        }

        return task;
    });

    displayTasks();
}

// Delete single task
function deleteTask(id) {

    tasks = tasks.filter(task => task.id !== id);

    displayTasks();
}

// Filter tasks
function filterTasks(filter, button) {

    currentFilter = filter;

    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    button.classList.add("active");

    displayTasks();
}

// Clear all tasks
function clearAll() {

    if (tasks.length === 0) {
        alert("No tasks to clear!");
        return;
    }

    if (confirm("Are you sure you want to delete all tasks?")) {

        tasks = [];

        displayTasks();
    }
}

// Update task counter
function updateCount() {

    const total = tasks.length;

    const completed = tasks.filter(task => task.completed).length;

    const pending = total - completed;

    document.getElementById("count").innerText =
        `Total Tasks: ${total} | Completed: ${completed} | Pending: ${pending}`;
}

// Load saved tasks when page opens
displayTasks();
