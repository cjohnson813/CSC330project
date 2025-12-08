
// within Calendar class: defined constructor to store 
// current and selected dates/call init method 
class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.events = [];
        this.init();
    }
    // set up the calendar by rendering the display and attaching button event listeners
    async init() {
        await this.loadEvents();
        this.renderCalendar();
        this.attachEventListeners();
        this.setupModal();
    }

    // Load events from the API
    async loadEvents() {
        try {
            const response = await fetch('/calendar-events');
            if (response.ok) {
                this.events = await response.json();
            } else {
                console.error('Error loading events');
                this.events = [];
            }
        } catch (err) {
            console.error('Error fetching events: ', err);
            this.events = [];
        }
    }


    // add event listeners to each landing page button (header and calendar)
    async attachEventListeners() {
        // previous month button
        document.getElementById('previousMonth').addEventListener('click', async () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1); // go back 1 month
            await this.loadEvents();
            this.renderCalendar();
        });

        // next month button
        document.getElementById('nextMonth').addEventListener('click', async () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1); // go forward 1 month
            await this.loadEvents();
            this.renderCalendar();           
        });

        // login button (to be completed)
        document.getElementById('loginBtn').addEventListener('click', () => {
            //sends a get request to /login.html, no need for fetch API here
            //and no need for code in the backend since express.static serves the file automatically
            window.location.href = '/login.html';
        });

        // contact button (to be completed)
        document.getElementById('contactBtn').addEventListener('click', () => {
            alert('tbd');
        });

        // join button (to be completed)
        document.getElementById('joinBtn').addEventListener('click', () => {
            alert('tbd');
        });
    }
    // create the grid for the selected month
    renderCalendar() {
        const monthYear = document.getElementById('monthYear'); // header showing month & year
        const calendarDays = document.getElementById('calendarDays'); // container holding calendar days

        // update month & year display
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June', 'July',
            'August', 'September', 'October', 'November', 'December' ];
        // update header text based on month
        monthYear.textContent = `${months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;

        // clear any existing day elements
        calendarDays.innerHTML = '';

        // get the first day of month and number of days
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1); // get first day of the current month
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0); // get the last day of the current month
        const daysInMonth = lastDay.getDate(); // total number of days in the month
        const startingDayOfWeek = firstDay.getDay(); // index (0 -> 6) of the first day (Sunday = 0)

        // get the last days of the previous month
        const prevMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 0); // get last day of the previous month
        const daysInPrevMonth = prevMonth.getDate(); // get the number of days in the previous month
        // add trailing days from the previous month
        for (let i = startingDayOfWeek - 1; i >= 0; i--) { // add days before the current month
            const day = daysInPrevMonth - i; 
            const dayElement = this.createDayElement(day, true); // create element for days in "other month"
            calendarDays.appendChild(dayElement); // add to the calendar 
        }

        // add days from the current month
        const today = new Date(); // get today's date
        for (let day = 1; day <= daysInMonth; day++) { // loop through days of the current month
            const dayDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day); // create date object
            const isToday = this.isSameDay(dayDate, today); // check if date is correct
            const dayElement = this.createDayElement(day, false, isToday, dayDate); // create day element for current month
            dayElement.addEventListener('click', () => { // add listener for selecting the date
                this.selectDay(dayElement, dayDate);
            });
            calendarDays.appendChild(dayElement); // add day to the calendar 
        }

        // add leading days from the following month
        const totalCells = calendarDays.children.length; // count of how many cells are populated
        const remainingCells = 42 - totalCells; // calculate how many cells remain
        for (let day = 1; day <= remainingCells && calendarDays.children.length < 42; day++) { // add starting days for next month
            const dayElement = this.createDayElement(day, true); // create day element for "other month"
            calendarDays.appendChild(dayElement); // add to the calendar
        }
    }
    // create a new element for a single day, make a new div, name the class, display the day number
    createDayElement(day, isOtherMonth, isToday = false, dayDate = null) { 
        const dayElement = document.createElement('div'); 
        dayElement.className = 'calendar-day'; 
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;        
        dayElement.appendChild(dayNumber); 

        if (isOtherMonth) {
            dayElement.classList.add('other-month'); // style if day is in a different month
        }

        if (isToday) {
            dayElement.classList.add('today'); // style if day is current date
        }
        // Add events for this day if not in other month and dayDate is provided
        if (!isOtherMonth && dayDate) {
            this.addEventsToDay(dayElement, dayDate);
        }

        return dayElement;
    }

    // Add events to a calendar day
    addEventsToDay(dayElement, dayDate) {
        // Format date to match database format (YYYY-MM-DD)
        const dateStr = this.formatDateForComparison(dayDate);
        
        // Find events for this day
        const dayEvents = this.events.filter(event => {
            const eventDate = new Date(event.event_date);
            return this.isSameDay(eventDate, dayDate);
        });

        // Create container for events
        if (dayEvents.length > 0) {
            const eventsContainer = document.createElement('div');
            eventsContainer.className = 'day-events';
            
            dayEvents.forEach(event => {
                const eventElement = this.createEventElement(event);
                eventsContainer.appendChild(eventElement);
            });
            
            dayElement.appendChild(eventsContainer);
        }
    }

    // Create an event element to display in calendar day
    createEventElement(event) {
        const eventDiv = document.createElement('div');
        eventDiv.className = 'calendar-event';
        
        // Event name
        const eventName = document.createElement('div');
        eventName.className = 'event-name';
        eventName.textContent = event.event_name;
        eventDiv.appendChild(eventName);
        
        // Event time
        const eventTime = document.createElement('div');
        eventTime.className = 'event-time';
        eventTime.textContent = this.formatTime(event.event_time);
        eventDiv.appendChild(eventTime);
        
        // More Details button
        const detailsBtn = document.createElement('button');
        detailsBtn.className = 'event-details-btn';
        detailsBtn.textContent = 'More Details';
        detailsBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent day selection
            this.showEventModal(event);
        });
        eventDiv.appendChild(detailsBtn);
        
        return eventDiv;
    }

    // Format time from HH:MM:SS to HH:MM AM/PM
    formatTime(timeStr) {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    }

    // Format date for comparison (YYYY-MM-DD)
    formatDateForComparison(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Show event details modal
    showEventModal(event) {
        const modal = document.getElementById('eventModal');
        if (!modal) return;

        // Populate modal with event data
        document.getElementById('modalEventName').textContent = event.event_name;
        document.getElementById('modalEventDate').textContent = this.formatDate(event.event_date);
        document.getElementById('modalEventTime').textContent = this.formatTime(event.event_time);
        document.getElementById('modalEventLocation').textContent = event.event_location;
        
        // Display capacity as "RSVP count/capacity"
        const rsvpCount = event.rsvp_count || 0;
        const capacity = event.event_capacity || 0;
        document.getElementById('modalEventCapacity').textContent = `${rsvpCount}/${capacity}`;

        // Show modal
        modal.style.display = 'flex';
    }

    // Format date for display
    formatDate(dateStr) {
        const date = new Date(dateStr);
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June', 'July',
            'August', 'September', 'October', 'November', 'December'
        ];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }

    // handles user selecting a date
    selectDay(dayElement, date) {
        //remove the previous selection
        document.querySelectorAll('.calendar-day.selected').forEach(day => {
            day.classList.remove('selected');
        });

        // add selected day to selection
        if (!dayElement.classList.contains('other-month')) {
            dayElement.classList.add('selected');
            this.selectedDate = date;
        }
    }

    isSameDay(date1, date2) {
        return  date1.getDate() === date2.getDate() &&
                date1.getMonth() === date2.getMonth() &&
                date1.getFullYear() === date2.getFullYear();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Load calender when page is loaded
    const calendar = new Calendar();

    // View and schedule event buttons
	const viewBtn = document.getElementById('viewBtn');
	const scheduleBtn = document.getElementById('scheduleBtn');

	if (viewBtn)
	{
		viewBtn.addEventListener('click', () =>
		{
			window.location.href = 'viewEvents.html';
		});
	}

	if (scheduleBtn)
	{
		scheduleBtn.addEventListener('click', () =>
		{
			window.location.href = 'scheduleEvent.html';
		});
	}

	if (profileBtn)
	{
		profileBtn.addEventListener('click', () =>
		{
			window.location.href = 'profile.html';
		});
	}

	// Modal close functionality
	const modal = document.getElementById('eventModal');
	const closeBtn = document.querySelector('.modal-close');
	
	if (closeBtn) {
		closeBtn.addEventListener('click', () => {
			if (modal) {
				modal.style.display = 'none';
			}
		});
	}

	// Close modal when clicking outside of it
	if (modal) {
		modal.addEventListener('click', (e) => {
			if (e.target === modal) {
				modal.style.display = 'none';
			}
		});
	}

});
