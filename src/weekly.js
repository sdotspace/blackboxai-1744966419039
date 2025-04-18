class WeeklyGoals {
    constructor() {
        this.goals = JSON.parse(localStorage.getItem('weeklyGoals')) || [];
        this.currentWeek = this.getCurrentWeekNumber();
        this.init();
    }

    init() {
        this.renderGoals();
        document.getElementById('addGoal').addEventListener('click', () => this.addGoal());
        document.getElementById('goalInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addGoal();
        });
        document.getElementById('clearGoals').addEventListener('click', () => this.clearGoals());
    }

    getCurrentWeekNumber() {
        const now = new Date();
        const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
        const pastDaysOfYear = (now - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

    addGoal() {
        const input = document.getElementById('goalInput');
        if (input.value.trim() === '') return;
        
        this.goals.push({
            id: Date.now(),
            text: input.value.trim(),
            completed: false,
            week: this.currentWeek,
            createdAt: new Date().toISOString()
        });
        
        this.saveGoals();
        input.value = '';
        this.renderGoals();
    }

    renderGoals() {
        const goalList = document.getElementById('goalList');
        goalList.innerHTML = '';
        
        const currentWeekGoals = this.goals.filter(goal => goal.week === this.currentWeek);
        
        currentWeekGoals.forEach(goal => {
            const goalElement = document.createElement('div');
            goalElement.className = `goal-card flex items-center p-3 rounded border border-gray-800 ${goal.completed ? 'completed' : ''}`;
            goalElement.dataset.id = goal.id;

            goalElement.innerHTML = `
                <input type="checkbox" ${goal.completed ? 'checked' : ''} 
                    class="mr-3 h-5 w-5 rounded border-gray-300">
                <span class="flex-1">${goal.text}</span>
                <span class="text-xs text-gray-400 ml-2">Week ${goal.week}</span>
                <button class="ml-2 text-gray-400 hover:text-white">
                    <i class="fas fa-trash"></i>
                </button>
            `;

            const checkbox = goalElement.querySelector('input[type="checkbox"]');
            checkbox.addEventListener('change', () => this.toggleGoal(goal.id));

            const deleteBtn = goalElement.querySelector('button');
            deleteBtn.addEventListener('click', () => this.deleteGoal(goal.id));

            goalList.appendChild(goalElement);
        });

        this.updateGoalCount();
    }

    toggleGoal(id) {
        const goal = this.goals.find(g => g.id === id);
        if (goal) {
            goal.completed = !goal.completed;
            this.saveGoals();
            this.renderGoals();
        }
    }

    deleteGoal(id) {
        this.goals = this.goals.filter(g => g.id !== id);
        this.saveGoals();
        this.renderGoals();
    }

    clearGoals() {
        this.goals = this.goals.filter(g => g.week !== this.currentWeek);
        this.saveGoals();
        this.renderGoals();
    }

    updateGoalCount() {
        const countElement = document.getElementById('goalCount');
        const currentWeekGoals = this.goals.filter(goal => goal.week === this.currentWeek);
        const total = currentWeekGoals.length;
        const completed = currentWeekGoals.filter(g => g.completed).length;
        countElement.textContent = `${completed} of ${total} goals completed`;
    }

    saveGoals() {
        localStorage.setItem('weeklyGoals', JSON.stringify(this.goals));
    }
}

// Initialize the weekly goals when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeeklyGoals();
});