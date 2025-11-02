
// within Calendar class: defined constructor to store 
// current and selected dates/call init method 
class Calendar {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.init();
    }
    // set up the calendar by rendering the display and attaching button event listeners
    init() {
        this.renderCalendar();
        this.attachEventListeners();
    }
    // add event listeners to each landing page button (header and calendar)
    attachEventListeners() {
        // previous month button
        document.getElementById('previousMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1); // go back 1 month
            this.renderCalendar();
        });
        // next month button
        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1); // go forward 1 month
            this.renderCalendar();           
        });
        // login button (to be completed)
        document.getElementById('loginBtn').addEventListener('click', () => {
            alert('tbd');
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
            const dayElement = this.createDayElement(day, false, isToday); // create day element for current month
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
    createDayElement(day, isOtherMonth, isToday = false) { 
        const dayElement = document.createElement('div'); 
        dayElement.className = 'calendar-day'; 
        dayElement.textContent = day; 

        if (isOtherMonth) {
            dayElement.classList.add('other-month'); // style if day is in a different month
        }

        if (isToday) {
            dayElement.classList.add('today'); // style if day is current date
        }

        return dayElement;
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

// load the calendar when the page is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calendar();

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
});
