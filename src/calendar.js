class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.events = JSON.parse(localStorage.getItem('calendarEvents')) || [];
        this.init();
    }

    init() {
        this.renderCalendar();
        document.getElementById('prevMonth').addEventListener('click', () => this.prevMonth());
        document.getElementById('nextMonth').addEventListener('click', () => this.nextMonth());
        document.getElementById('today').addEventListener('click', () => this.goToToday());
        document.getElementById('saveEvent').addEventListener('click', () => this.saveEvent());
        document.getElementById('cancelEvent').addEventListener('click', () => this.closeModal());
    }

    renderCalendar() {
        const monthYearDisplay = document.getElementById('monthYearDisplay');
        const calendarGrid = document.getElementById('calendarGrid');
        
        // Set month/year display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];
        monthYearDisplay.textContent = `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        
        // Clear previous calendar
        calendarGrid.innerHTML = '';
        
        // Get first day of month and total days in month
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        // Get day of week for first day (0 = Sunday, 6 = Saturday)
        const startingDay = firstDay.getDay();
        
        // Create empty cells for days before first day of month
        for (let i = 0; i < startingDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'h-16 p-1 border border-gray-800 bg-gray-900';
            calendarGrid.appendChild(emptyCell);
        }
        
        // Create cells for each day of month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day h-16 p-1 border border-gray-700 flex flex-col';
            
            // Check if this date has any events
            const dateStr = this.formatDate(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day));
            const hasEvent = this.events.some(event => event.date === dateStr);
            
            // Add day number
            const dayNumber = document.createElement('div');
            dayNumber.className = 'text-sm font-medium';
            dayNumber.textContent = day;
            dayCell.appendChild(dayNumber);
            
            // Add event indicator if needed
            if (hasEvent) {
                dayCell.classList.add('has-event');
            }
            
            // Highlight current day
            const today = new Date();
            if (day === today.getDate() && 
                this.currentDate.getMonth() === today.getMonth() && 
                this.currentDate.getFullYear() === today.getFullYear()) {
                dayCell.classList.add('bg-gray-800');
            }
            
            // Add click event for adding/editing events
            dayCell.addEventListener('click', () => this.openEventModal(day));
            
            calendarGrid.appendChild(dayCell);
        }
    }

    prevMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.renderCalendar();
    }

    nextMonth() {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.renderCalendar();
    }

    goToToday() {
        this.currentDate = new Date();
        this.renderCalendar();
    }

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    openEventModal(day) {
        const modal = document.getElementById('eventModal');
        const eventTitle = document.getElementById('eventTitle');
        const eventDate = document.getElementById('eventDate');
        
        const selectedDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
        const dateStr = this.formatDate(selectedDate);
        
        // Check if there's already an event for this date
        const existingEvent = this.events.find(event => event.date === dateStr);
        
        if (existingEvent) {
            document.getElementById('eventModalTitle').textContent = 'Edit Event';
            eventTitle.value = existingEvent.title;
            eventDate.value = dateStr;
        } else {
            document.getElementById('eventModalTitle').textContent = 'Add Event';
            eventTitle.value = '';
            eventDate.value = dateStr;
        }
        
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    }

    closeModal() {
        const modal = document.getElementById('eventModal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    saveEvent() {
        const title = document.getElementById('eventTitle').value.trim();
        const date = document.getElementById('eventDate').value;
        
        if (!title) {
            alert('Please enter a title for the event');
            return;
        }
        
        // Remove any existing event for this date
        this.events = this.events.filter(event => event.date !== date);
        
        // Add new event
        this.events.push({
            title,
            date,
            createdAt: new Date().toISOString()
        });
        
        this.saveEvents();
        this.closeModal();
        this.renderCalendar();
    }

    saveEvents() {
        localStorage.setItem('calendarEvents', JSON.stringify(this.events));
    }
}

// Initialize the calendar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calendar();
});