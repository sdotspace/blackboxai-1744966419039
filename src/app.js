// Core functionality for all pages
class App {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.goals = JSON.parse(localStorage.getItem('goals')) || {};
        this.events = JSON.parse(localStorage.getItem('events')) || {};
        this.flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
        
        this.initTodoList();
        this.initEventListeners();
    }

    initTodoList() {
        if (!document.getElementById('taskList')) return;
        
        this.renderTasks();
        document.getElementById('addTask').addEventListener('click', () => this.addTask());
        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        document.getElementById('clearCompleted').addEventListener('click', () => this.clearCompleted());
    }

    addTask() {
        const input = document.getElementById('taskInput');
        if (input.value.trim() === '') return;
        
        this.tasks.push({
            id: Date.now(),
            text: input.value.trim(),
            completed: false,
            priority: 'medium',
            createdAt: new Date().toISOString()
        });
        
        this.saveTasks();
        input.value = '';
        this.renderTasks();
    }

    renderTasks() {
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';
        
        this.tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task-item flex items-center p-3 rounded border border-gray-800 ${task.completed ? 'completed' : ''}`;
            taskElement.draggable = true;
            taskElement.dataset.id = task.id;

            taskElement.innerHTML = `
                <input type="checkbox" ${task.completed ? 'checked' : ''} 
                    class="mr-3 h-5 w-5 rounded border-gray-300">
                <span class="flex-1">${task.text}</span>
                <select class="ml-2 bg-gray-900 border border-gray-700 rounded px-2 py-1 text-sm">
                    <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
                    <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
                    <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
                </select>
                <button class="ml-2 text-gray-400 hover:text-white">
                    <i class="fas fa-trash"></i>
                </button>
            `;

            const checkbox = taskElement.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => this.toggleTask(task.id));

            const prioritySelect = taskElement.querySelector('select');
            prioritySelect.addEventListener('change', (e) => {
                this.updateTaskPriority(task.id, e.target.value);
            });

            const deleteBtn = taskElement.querySelector('button');
            deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

            taskList.appendChild(taskElement);
        });

        this.updateTaskCount();
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
        }
    }

    updateTaskPriority(id, priority) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.priority = priority;
            this.saveTasks();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.saveTasks();
        this.renderTasks();
    }

    clearCompleted() {
        this.tasks = this.tasks.filter(t => !t.completed);
        this.saveTasks();
        this.renderTasks();
    }

    updateTaskCount() {
        const countElement = document.getElementById('taskCount');
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        countElement.textContent = `${completed} of ${total} tasks completed`;
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    initEventListeners() {
        // Will be used for drag and drop functionality
        document.addEventListener('DOMContentLoaded', () => {
            const taskList = document.getElementById('taskList');
            if (taskList) {
                taskList.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    const draggingItem = document.querySelector('.dragging');
                    const afterElement = this.getDragAfterElement(taskList, e.clientY);
                    if (afterElement == null) {
                        taskList.appendChild(draggingItem);
                    } else {
                        taskList.insertBefore(draggingItem, afterElement);
                    }
                });
            }
        });
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { element: child, offset: offset };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});