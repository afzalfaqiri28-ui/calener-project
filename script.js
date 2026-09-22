const calendarGrid = document.getElementById("calendarGrid");

const monthTitle = document.getElementById("monthTitle");

const todayDate = document.getElementById("todayDate");

const totalEvents = document.getElementById("totalEvents");

const upcomingEvents = document.getElementById("upcomingEvents");

const eventList = document.getElementById("eventList");

const searchInput = document.getElementById("searchInput");


const addEventBtn = document.getElementById("addEventBtn");

const todayBtn = document.getElementById("todayBtn");

const previousBtn = document.getElementById("previousBtn");

const nextBtn = document.getElementById("nextBtn");

const notificationBtn =
    document.getElementById("notificationBtn");



const eventModal =
    document.getElementById("eventModal");

const closeModal =
    document.getElementById("closeModal");

const cancelBtn =
    document.getElementById("cancelBtn");



const eventForm =
    document.getElementById("eventForm");

const eventId =
    document.getElementById("eventId");

const eventTitle =
    document.getElementById("eventTitle");

const eventDate =
    document.getElementById("eventDate");

const eventTime =
    document.getElementById("eventTime");

const eventCategory =
    document.getElementById("eventCategory");

const eventReminder =
    document.getElementById("eventReminder");

const eventDescription =
    document.getElementById("eventDescription");

const modalTitle =
    document.getElementById("modalTitle");

const deleteBtn =
    document.getElementById("deleteBtn");

const toastContainer =
    document.getElementById("toastContainer");



let currentDate = new Date();


let events =
    JSON.parse(
        localStorage.getItem("calendarEvents")
    ) || [];


function pad(number) {

    return String(number).padStart(2, "0");

}


function getDateKey(date) {

    return (
        date.getFullYear() +
        "-" +
        pad(date.getMonth() + 1) +
        "-" +
        pad(date.getDate())
    );

}



function saveEvents() {

    localStorage.setItem(
        "calendarEvents",
        JSON.stringify(events)
    );

}


function showTodayDate() {

    const today = new Date();

    todayDate.textContent =
        today.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );

}


function renderCalendar() {

    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();

  

    monthTitle.textContent =
        new Date(
            year,
            month,
            1
        ).toLocaleDateString(
            "en-US",
            {
                month: "long",
                year: "numeric"
            }
        );



    calendarGrid.innerHTML = "";

   

    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();

    // Number of days in month

    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();

    // Number of days in previous month

    const daysInPreviousMonth =
        new Date(
            year,
            month,
            0
        ).getDate();

    // ====================================
    // PREVIOUS MONTH DAYS
    // ====================================

    for (
        let i = firstDay - 1;
        i >= 0;
        i--
    ) {

        const day =
            daysInPreviousMonth - i;

        const date =
            new Date(
                year,
                month - 1,
                day
            );

        createCalendarDay(
            date,
            true
        );

    }

    // ====================================
    // CURRENT MONTH DAYS
    // ====================================

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const date =
            new Date(
                year,
                month,
                day
            );

        createCalendarDay(
            date,
            false
        );

    }

    // ====================================
    // NEXT MONTH DAYS
    // ====================================

    const currentCells =
        calendarGrid.children.length;

    const cellsNeeded =
        currentCells <= 35
            ? 35 - currentCells
            : 42 - currentCells;

    for (
        let day = 1;
        day <= cellsNeeded;
        day++
    ) {

        const date =
            new Date(
                year,
                month + 1,
                day
            );

        createCalendarDay(
            date,
            true
        );

    }

}

// ========================================
// 7. CREATE CALENDAR DAY
// ========================================

function createCalendarDay(
    date,
    isOtherMonth
) {

    const dayElement =
        document.createElement("div");

    dayElement.className =
        "calendar-day";

    // Other month

    if (isOtherMonth) {

        dayElement.classList.add(
            "other-month"
        );

    }

    // Check if today

    const today =
        new Date();

    if (
        getDateKey(date) ===
        getDateKey(today)
    ) {

        dayElement.classList.add(
            "today"
        );

    }

    // Day number

    const dayNumber =
        document.createElement("div");

    dayNumber.className =
        "day-number";

    dayNumber.textContent =
        date.getDate();

    dayElement.appendChild(
        dayNumber
    );

    // ====================================
    // EVENTS FOR THIS DAY
    // ====================================

    const dayEvents =
        events
            .filter(
                event =>
                    event.date ===
                    getDateKey(date)
            )
            .sort(
                (a, b) =>
                    a.time.localeCompare(
                        b.time
                    )
            );

    dayEvents.forEach(
        event => {

            const eventButton =
                document.createElement(
                    "button"
                );

            eventButton.className =
                "event-chip";

            eventButton.textContent =
                event.time +
                " " +
                event.title;

            eventButton.title =
                "Click to edit event";

            // Edit event

            eventButton.addEventListener(
                "click",
                function (e) {

                    e.stopPropagation();

                    openEditModal(
                        event.id
                    );

                }
            );

            dayElement.appendChild(
                eventButton
            );

        }
    );

    // Double click day → Add event

    dayElement.addEventListener(
        "dblclick",
        function () {

            openAddModal(
                getDateKey(date)
            );

        }
    );

    calendarGrid.appendChild(
        dayElement
    );

}

// ========================================
// 8. OPEN ADD EVENT MODAL
// ========================================

function openAddModal(
    selectedDate = getDateKey(new Date())
) {

    // Reset form

    eventForm.reset();

    // Empty ID means new event

    eventId.value = "";

    // Selected date

    eventDate.value =
        selectedDate;

    // Default time

    eventTime.value =
        "09:00";

    // Default reminder

    eventReminder.value =
        "15";

    // Modal title

    modalTitle.textContent =
        "Add Event";

    // Hide delete button

    deleteBtn.classList.add(
        "hidden"
    );

    // Show modal

    eventModal.classList.remove(
        "hidden"
    );

    eventTitle.focus();

}

// ========================================
// 9. OPEN EDIT MODAL
// ========================================

function openEditModal(id) {

    const event =
        events.find(
            item =>
                item.id === id
        );

    if (!event) {

        return;

    }

    // Fill form

    eventId.value =
        event.id;

    eventTitle.value =
        event.title;

    eventDate.value =
        event.date;

    eventTime.value =
        event.time;

    eventCategory.value =
        event.category;

    eventReminder.value =
        event.reminder;

    eventDescription.value =
        event.description || "";

    // Change modal title

    modalTitle.textContent =
        "Edit Event";

    // Show delete button

    deleteBtn.classList.remove(
        "hidden"
    );

    // Show modal

    eventModal.classList.remove(
        "hidden"
    );

}

// ========================================
// 10. CLOSE MODAL
// ========================================

function closeEventModal() {

    eventModal.classList.add(
        "hidden"
    );

}

closeModal.addEventListener(
    "click",
    closeEventModal
);

cancelBtn.addEventListener(
    "click",
    closeEventModal
);

// Close modal when clicking outside

eventModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            eventModal
        ) {

            closeEventModal();

        }

    }
);

// ========================================
// 11. ADD / EDIT EVENT
// ========================================

eventForm.addEventListener(
    "submit",
    function (e) {

        e.preventDefault();

        // Create event object

        const eventData = {

            id:
                eventId.value ||
                Date.now().toString(),

            title:
                eventTitle.value.trim(),

            date:
                eventDate.value,

            time:
                eventTime.value,

            category:
                eventCategory.value,

            reminder:
                Number(
                    eventReminder.value
                ),

            description:
                eventDescription.value.trim(),

            reminded:
                false

        };

        // ====================================
        // CHECK EDIT OR ADD
        // ====================================

        const existingIndex =
            events.findIndex(
                event =>
                    event.id ===
                    eventData.id
            );

        if (
            existingIndex !== -1
        ) {

            // Update event

            events[existingIndex] =
                eventData;

            showToast(
                "Event updated successfully!"
            );

        }

        else {

            // Add new event

            events.push(
                eventData
            );

            showToast(
                "Event added successfully!"
            );

        }

        // Save

        saveEvents();

        // Update screen

        renderAll();

        // Close modal

        closeEventModal();

    }
);

// ========================================
// 12. DELETE EVENT
// ========================================

function deleteEvent(id) {

    const event =
        events.find(
            item =>
                item.id === id
        );

    if (!event) {

        return;

    }

    const answer =
        confirm(
            `Are you sure you want to delete "${event.title}"?`
        );

    if (!answer) {

        return;

    }

    // Remove event

    events =
        events.filter(
            item =>
                item.id !== id
        );

    // Save

    saveEvents();

    // Update

    renderAll();

    // Close modal

    closeEventModal();

    showToast(
        "Event deleted successfully!"
    );

}

// Delete button

deleteBtn.addEventListener(
    "click",
    function () {

        deleteEvent(
            eventId.value
        );

    }
);

// ========================================
// 13. RENDER UPCOMING EVENTS
// ========================================

function renderEventList() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();

    const now =
        new Date();

    const filteredEvents =
        [...events]

            // Search

            .filter(
                event => {

                    const text =
                        (
                            event.title +
                            " " +
                            event.description +
                            " " +
                            event.category
                        ).toLowerCase();

                    return text.includes(
                        search
                    );

                }
            )

            // Only upcoming events

            .filter(
                event => {

                    const eventDateTime =
                        new Date(
                            event.date +
                            "T" +
                            event.time
                        );

                    return (
                        eventDateTime >=
                        now
                    );

                }
            )

            // Sort by date

            .sort(
                (a, b) => {

                    const dateA =
                        new Date(
                            a.date +
                            "T" +
                            a.time
                        );

                    const dateB =
                        new Date(
                            b.date +
                            "T" +
                            b.time
                        );

                    return dateA - dateB;

                }
            );

    // Clear list

    eventList.innerHTML = "";

    // No events

    if (
        filteredEvents.length === 0
    ) {

        eventList.innerHTML =
            `
            <p class="empty-message">
                No upcoming events found.
            </p>
            `;

        return;

    }

    // ====================================
    // CREATE EVENT ITEMS
    // ====================================

    filteredEvents
        .slice(0, 15)
        .forEach(
            event => {

                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "event-item";

                item.innerHTML =
                    `
                    <div class="event-info">

                        <span class="event-dot"></span>

                        <div>

                            <h4>
                                ${escapeHTML(
                                    event.title
                                )}
                            </h4>

                            <p>
                                ${formatEventDate(
                                    event.date,
                                    event.time
                                )}
                                •
                                ${escapeHTML(
                                    event.category
                                )}
                            </p>

                        </div>

                    </div>

                    <div class="event-actions">

                        <button
                            class="edit-btn">
                            Edit
                        </button>

                        <button
                            class="delete-event-btn">
                            Delete
                        </button>

                    </div>
                    `;

                // Edit

                item
                    .querySelector(
                        ".edit-btn"
                    )
                    .addEventListener(
                        "click",
                        function () {

                            openEditModal(
                                event.id
                            );

                        }
                    );

                // Delete

                item
                    .querySelector(
                        ".delete-event-btn"
                    )
                    .addEventListener(
                        "click",
                        function () {

                            deleteEvent(
                                event.id
                            );

                        }
                    );

                eventList.appendChild(
                    item
                );

            }
        );

}

// ========================================
// 14. FORMAT EVENT DATE
// ========================================

function formatEventDate(
    dateString,
    time
) {

    const date =
        new Date(
            dateString +
            "T" +
            time
        );

    return (
        date.toLocaleDateString(
            "en-US",
            {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        ) +
        " • " +
        time
    );

}

// ========================================
// 15. UPDATE STATISTICS
// ========================================

function updateStatistics() {

    const now =
        new Date();

    const upcoming =
        events.filter(
            event => {

                const eventDate =
                    new Date(
                        event.date +
                        "T" +
                        event.time
                    );

                return (
                    eventDate >=
                    now
                );

            }
        );

    totalEvents.textContent =
        events.length;

    upcomingEvents.textContent =
        upcoming.length;

}

// ========================================
// 16. ESCAPE HTML
// ========================================

function escapeHTML(text) {

    return String(text)
        .replace(
            /[&<>"']/g,
            function (character) {

                const characters = {

                    "&": "&amp;",

                    "<": "&lt;",

                    ">": "&gt;",

                    '"': "&quot;",

                    "'": "&#039;"

                };

                return characters[
                    character
                ];

            }
        );

}

// ========================================
// 17. RENDER EVERYTHING
// ========================================

function renderAll() {

    renderCalendar();

    renderEventList();

    updateStatistics();

    showTodayDate();

}

// ========================================
// 18. ADD EVENT BUTTON
// ========================================

addEventBtn.addEventListener(
    "click",
    function () {

        openAddModal();

    }
);

// ========================================
// 19. PREVIOUS MONTH
// ========================================

previousBtn.addEventListener(
    "click",
    function () {

        currentDate.setMonth(
            currentDate.getMonth() - 1
        );

        renderCalendar();

    }
);

// ========================================
// 20. NEXT MONTH
// ========================================

nextBtn.addEventListener(
    "click",
    function () {

        currentDate.setMonth(
            currentDate.getMonth() + 1
        );

        renderCalendar();

    }
);

// ========================================
// 21. TODAY BUTTON
// ========================================

todayBtn.addEventListener(
    "click",
    function () {

        currentDate =
            new Date();

        renderCalendar();

    }
);

// ========================================
// 22. SEARCH EVENTS
// ========================================

searchInput.addEventListener(
    "input",
    function () {

        renderEventList();

    }
);

// ========================================
// 23. BROWSER NOTIFICATIONS
// ========================================

notificationBtn.addEventListener(
    "click",
    async function () {

        // Check browser support

        if (
            !("Notification" in window)
        ) {

            showToast(
                "Your browser does not support notifications."
            );

            return;

        }

        // Request permission

        const permission =
            await Notification.requestPermission();

        if (
            permission ===
            "granted"
        ) {

            showToast(
                "Notifications enabled successfully!"
            );

            // Test notification

            new Notification(
                "Smart Calendar",
                {
                    body:
                        "Notifications are now enabled."
                }
            );

        }

        else {

            showToast(
                "Notification permission was not granted."
            );

        }

    }
);

// ========================================
// 24. CHECK EVENT REMINDERS
// ========================================

function checkReminders() {

    const now =
        new Date();

    events.forEach(
        event => {

            const eventDateTime =
                new Date(
                    event.date +
                    "T" +
                    event.time
                );

            // Calculate reminder time

            const reminderTime =
                new Date(
                    eventDateTime.getTime() -
                    event.reminder *
                    60 *
                    1000
                );

            const difference =
                now.getTime() -
                reminderTime.getTime();

            // Reminder should appear

            if (

                !event.reminded &&

                difference >= 0 &&

                difference < 60000

            ) {

                // Mark as reminded

                event.reminded =
                    true;

                saveEvents();

                const message =
                    `${event.title} starts at ${event.time}.`;

                // In-app notification

                showToast(
                    "🔔 Reminder: " +
                    message
                );

                // Browser notification

                if (

                    "Notification" in
                    window &&

                    Notification.permission ===
                    "granted"

                ) {

                    new Notification(
                        "Calendar Reminder",
                        {
                            body:
                                message
                        }
                    );

                }

            }

        }
    );

}

// ========================================
// 25. TOAST MESSAGE
// ========================================

function showToast(message) {

    const toast =
        document.createElement(
            "div"
        );

    toast.className =
        "toast";

    toast.textContent =
        message;

    toastContainer.appendChild(
        toast
    );

    // Remove after 3.5 seconds

    setTimeout(
        function () {

            toast.remove();

        },
        3500
    );

}

// ========================================
// 26. START REMINDER CHECKER
// ========================================

// Check reminders every 30 seconds

setInterval(
    checkReminders,
    30000
);

// ========================================
// 27. START APPLICATION
// ========================================

renderAll();