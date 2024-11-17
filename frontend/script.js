// Function to show different sections
function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = section.id === sectionId ? 'block' : 'none';
    });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function () {
    showSection('dashboard'); // Default section
    loadNotifications();
    loadVolunteerHistory();
    loadVolunteerMatching();
    initializeSkillsPicker(); // Initialize skills picker functionality
});

// Initialize the multi-select datepicker for availability
$(function () {
    const selectedDates = [];

    $('#availability').datepicker({
        onSelect: function (dateText) {
            if (!selectedDates.includes(dateText)) {
                selectedDates.push(dateText);
            } else {
                const index = selectedDates.indexOf(dateText);
                if (index > -1) {
                    selectedDates.splice(index, 1);
                }
            }
            $('#availability').val(selectedDates.join(', '));
        },
        numberOfMonths: 2,
        showButtonPanel: true,
    });
});

// Sidebar navigation logic
document.querySelectorAll(".sidebar-links a").forEach((elem) => {
    elem.addEventListener("click", function (event) {
        event.preventDefault();
        const sectionId = this.dataset.section;
        showSection(sectionId);
    });
});

// General fetch helper function with error handling
async function fetchWithErrorHandling(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'An error occurred');
        }
        return await response.json();
    } catch (err) {
        console.error(`Error fetching ${url}:`, err);
        throw err;
    }
}

// Initialize the skills picker
function initializeSkillsPicker() {
    const skillsDropdown = document.getElementById('skills');
    const selectedSkillsContainer = document.getElementById('selectedSkillsContainer');
    const selectedSkillsList = document.getElementById('selectedSkillsList');

    skillsDropdown.addEventListener('change', function () {
        selectedSkillsList.innerHTML = ''; // Clear previous list
        Array.from(skillsDropdown.selectedOptions).forEach(option => {
            const li = document.createElement('li');
            li.textContent = option.value;
            selectedSkillsList.appendChild(li);
        });

        selectedSkillsContainer.style.display = selectedSkillsList.children.length > 0 ? 'block' : 'none';
    });
}

// Helper function to retrieve selected skills
function getSelectedSkills() {
    const skillsDropdown = document.getElementById('skills');
    return Array.from(skillsDropdown.selectedOptions).map(option => option.value);
}

// Handle Login
document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('loginMessage');
    const submitButton = event.target.querySelector('button[type="submit"]');

    try {
        submitButton.disabled = true;
        submitButton.textContent = 'Logging in...';

        const data = await fetchWithErrorHandling('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        messageElement.innerHTML = `<p style="color: green;">Login successful!</p>`;
        localStorage.setItem('userEmail', email); // Save user info locally
        showSection('dashboard');
    } catch (error) {
        messageElement.innerHTML = `<p style="color: red;">${error.message || 'Login failed'}</p>`;
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Login';
    }
});

// Handle Registration
document.getElementById('registrationForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const messageElement = document.getElementById('registerMessage');
    const submitButton = event.target.querySelector('button[type="submit"]');

    try {
        submitButton.disabled = true;
        submitButton.textContent = 'Registering...';

        // Send registration request
        const data = await fetchWithErrorHandling('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        // Save user info locally and redirect to the dashboard
        localStorage.setItem('userEmail', data.login.email);
        messageElement.innerHTML = '<p style="color: green;">Registration successful! Logging you in...</p>';
        setTimeout(() => showSection('dashboard'), 2000);
    } catch (error) {
        messageElement.innerHTML = `<p style="color: red;">${error.message || 'Registration failed'}</p>`;
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Register';
    }
});



// Handle Profile Form Submission
document.getElementById('profileForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = {
        fullName: document.getElementById('fullName').value,
        address1: document.getElementById('address1').value,
        address2: document.getElementById('address2').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zipCode: document.getElementById('zipCode').value,
        skills: getSelectedSkills(),
        preferences: document.getElementById('preferences').value,
        availability: $('#availability').val().split(', '),
    };

    try {
        const data = await fetchWithErrorHandling('/api/profile', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'user-id': localStorage.getItem('userEmail'),
            },
            body: JSON.stringify(formData),
        });

        document.getElementById('profileMessage').innerHTML = 
            `<p style="color: green;">${data.message || 'Profile updated successfully!'}</p>`;
    } catch (error) {
        document.getElementById('profileMessage').innerHTML = 
            `<p style="color: red;">${error.message || 'Failed to update profile.'}</p>`;
    }
});

// Handle Event Form Submission
document.getElementById('eventForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = {
        eventName: document.getElementById('eventName').value,
        eventDescription: document.getElementById('eventDescription').value,
        eventLocation: document.getElementById('eventLocation').value,
        requiredSkills: Array.from(document.getElementById('eventSkills').selectedOptions).map(option => option.value),
        urgency: document.getElementById('urgency').value,
        eventDate: document.getElementById('eventDate').value,
    };

    // Ensure requiredSkills is properly populated
    if (!formData.requiredSkills || formData.requiredSkills.length === 0) {
        alert('Please select at least one required skill.');
        return;
    }

    try {
        const response = await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to create event.');
        }

        alert('Event created successfully!');
        document.getElementById('eventForm').reset();
    } catch (error) {
        console.error('Error creating event:', error);
        alert(error.message);
    }
});

// Handle Report Generation
document.getElementById('reportForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const reportType = document.getElementById('reportType').value;
    const reportFormat = document.getElementById('reportFormat').value;
    const reportMessage = document.getElementById('reportMessage');

    if (!reportType || !reportFormat) {
        reportMessage.innerHTML = '<p style="color: red;">Please select a report type and format.</p>';
        return;
    }

    try {
        const response = await fetch(`/api/reports/${reportFormat}?type=${reportType}`);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Error generating report.');
        }

        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `${reportType}_report.${reportFormat}`;
        link.click();

        reportMessage.innerHTML = '<p style="color: green;">Report downloaded successfully.</p>';
    } catch (error) {
        reportMessage.innerHTML = `<p style="color: red;">${error.message || 'Error downloading report.'}</p>`;
    }
});


// Load Volunteer Matching
async function loadVolunteerMatching() {
    try {
        const events = await fetchWithErrorHandling('/api/matching/events');
        const volunteers = await fetchWithErrorHandling('/api/matching/volunteers');

        // Populate events dropdown
        const eventSelect = document.getElementById('matchEventName');
        eventSelect.innerHTML = ''; // Clear previous options
        events.forEach(event => {
            const option = document.createElement('option');
            option.value = event.id;
            option.textContent = `${event.eventName} (${event.eventDate})`;
            eventSelect.appendChild(option);
        });

        // Populate volunteers dropdown
        const volunteerSelect = document.getElementById('volunteerName');
        volunteerSelect.innerHTML = ''; // Clear previous options
        volunteers.forEach(volunteer => {
            const option = document.createElement('option');
            option.value = volunteer.id;
            option.textContent = volunteer.name;
            volunteerSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading volunteer matching data:', error);
    }
}

// Load Notifications
async function loadNotifications() {
    try {
        const notifications = await fetchWithErrorHandling('/api/notifications', {
            headers: { 'user-id': localStorage.getItem('userEmail') },
        });

        const container = document.getElementById('notificationMessage');
        container.innerHTML = notifications.length
            ? notifications.map(n => `<p>${n.message}</p>`).join('')
            : '<p>No notifications available.</p>';
    } catch (error) {
        console.error('Error loading notifications:', error);
    }
}

// Load Volunteer History
async function loadVolunteerHistory() {
    try {
        const history = await fetchWithErrorHandling('/api/history', {
            headers: { 'user-id': localStorage.getItem('userEmail') },
        });

        const tableBody = document.getElementById('historyTable').querySelector('tbody');
        tableBody.innerHTML = history.length
            ? history.map(h => `
                <tr>
                    <td>${h.eventName}</td>
                    <td>${h.eventDate}</td>
                    <td>${h.status}</td>
                </tr>
            `).join('')
            : '<tr><td colspan="3">No history found.</td></tr>';
    } catch (error) {
        console.error('Error loading volunteer history:', error);
    }
}
