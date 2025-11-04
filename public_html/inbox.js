// Event listener for inbox button
document.addEventListener('DOMContentLoaded', function() {
    const inboxBtn = document.getElementById('inboxBtn');
    const inboxModal = document.getElementById('inboxModal');
    const closeInbox = document.getElementById('closeInbox');

    // Open inbox modal when button is clicked
    if (inboxBtn) {
        inboxBtn.addEventListener('click', function() {
            inboxModal.style.display = 'block';
            loadEventRequests();
        });
    }

    // Close inbox modal when X is clicked
    if (closeInbox) {
        closeInbox.addEventListener('click', function() {
            inboxModal.style.display = 'none';
        });
    }
});

// Function to load event requests from the server
function loadEventRequests() {
    const requestsList = document.getElementById('requestsList');
    const loadingMessage = document.getElementById('loadingMessage');

    // Show loading message
    loadingMessage.style.display = 'block';
    requestsList.innerHTML = '';

      // Fetch event requests from server
    const AJAXObj = new XMLHttpRequest();
    AJAXObj.onload = function() {
        loadingMessage.style.display = 'none';

        if (this.status === 200) {
            try {
                const requests = JSON.parse(this.responseText);
                displayRequests(requests);
            } catch (e) {
                errorHandler('Error parsing server response.');
            }
        else {
          errorHandler('Failed to load event requests. Please try again.');
        }
    };

    AJAXObj.onerror = function() {
        loadingMessage.style.display = 'none';
        errorHandler('Connection error. Please try again later.');
    };

    AJAXObj.open('GET', '/getEventRequests', true);
    AJAXObj.send();
}

// Function to display event requests in the inbox
function displayRequests(requests) {
    const requestsList = document.getElementById('requestsList');
    
    if (!requests || requests.length === 0) {
        requestsList.innerHTML = `
            <div class="empty-inbox">
                <p>No event requests at this time.</p>
                <p>The inbox is empty.</p>
            </div>
        `;
        return;
    }

    // Create HTML for each request
    let html = '';
    pendingRequests.forEach(request => {
        const submittedDate = new Date(request.submittedAt).toLocaleString();
        html += `
            <div class="request-item" data-request-id="${request.id}">
                <h3>${escapeHtml(request.eventName)}</h3>
                <div class="request-details">
                    <div class="request-detail">
                        <label>Event Date:</label>
                        <span>${escapeHtml(request.eventDate)}</span>
                    </div>
                    <div class="request-detail">
                        <label>Event Time:</label>
                        <span>${escapeHtml(request.eventTime)}</span>
                    </div>
                    <div class="request-detail">
                        <label>Submitted At:</label>
                        <span>${submittedDate}</span>
                    </div>
                </div>
                <div class="request-status ${request.status}">${request.status.toUpperCase()}</div>
            </div>
        `;
    });

    requestsList.innerHTML = html;
}

function errorHandler(message) {
  alert('Error: ' + message);
}
    
  

  
