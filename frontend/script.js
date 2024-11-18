// Function to show different sections
function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = section.id === sectionId ? 'block' : 'none';
    });
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    showSection('dashboard'); // Default section
    loadNotifications();
    loadVolunteerHistory();
    loadVolunteerMatching();
    initializeSkillsPicker();
});

// Initialize the multi-select datepicker for availability
$(function() {
    const selectedDates = [];

    $('#availability').datepicker({
        onSelect: function(dateText) {
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
    elem.addEventListener("click", function(event) {
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
    const profileSkills = document.getElementById('skills');
    const selectedSkillsContainer = document.getElementById('selectedSkillsContainer');
    const selectedSkillsList = document.getElementById('selectedSkillsList');

    function updateSelectedSkills(dropdown) {
        selectedSkillsList.innerHTML = '';
        
        Array.from(dropdown.selectedOptions).forEach(option => {
            const li = document.createElement('li');
            li.textContent = option.value;
            
            const removeBtn = document.createElement('span');
            removeBtn.textContent = '✕';
            removeBtn.style.cursor = 'pointer';
            removeBtn.onclick = (e) => {
                e.stopPropagation();
                option.selected = false;
                updateSelectedSkills(dropdown);
            };
            
            li.appendChild(removeBtn);
            selectedSkillsList.appendChild(li);
        });
        
        selectedSkillsContainer.style.display = 
            selectedSkillsList.children.length > 0 ? 'block' : 'none';
    }

    if (profileSkills) {
        profileSkills.addEventListener('change', function() {
            updateSelectedSkills(this);
        });
    }
}


// Helper function to retrieve selected skills
function getSelectedSkills() {
    const skillsDropdown = document.getElementById('skills');
    return Array.from(skillsDropdown.selectedOptions).map(option => option.value);
}

// Handle Login
document.getElementById('loginForm').addEventListener('submit', async function(event) {
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
        localStorage.setItem('userEmail', email);
        showSection('dashboard');
    } catch (error) {
        messageElement.innerHTML = `<p style="color: red;">${error.message || 'Login failed'}</p>`;
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Login';
    }
});

// Handle Registration
document.getElementById('registrationForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const messageElement = document.getElementById('registerMessage');
    const submitButton = event.target.querySelector('button[type="submit"]');

    try {
        submitButton.disabled = true;
        submitButton.textContent = 'Registering...';

        const data = await fetchWithErrorHandling('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

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
// Handle Profile Form Submission
document.getElementById('profileForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const userEmail = localStorage.getItem('userEmail');
    
    const formData = {
        fullName: document.getElementById('fullName').value,
        address1: document.getElementById('address1').value,
        address2: document.getElementById('address2').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zipCode: document.getElementById('zipCode').value,
        skills: Array.from(document.getElementById('skills').selectedOptions).map(option => option.value),
        preferences: document.getElementById('preferences').value || '',
        availability: $('#availability').val() ? $('#availability').val().split(', ') : []
    };

    try {
        // Update profile
        const profileResponse = await fetch('/api/profile', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'user-id': userEmail,
            },
            body: JSON.stringify(formData),
        });

        if (!profileResponse.ok) {
            throw new Error('Failed to update profile');
        }

        // Register as volunteer
        const volunteerResponse = await fetch('/api/matching/register-volunteer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullName: formData.fullName,
                email: userEmail,
                skills: formData.skills
            }),
        });

        if (!volunteerResponse.ok) {
            throw new Error('Failed to register as volunteer');
        }

        document.getElementById('profileMessage').innerHTML = 
            `<p style="color: green;">Profile updated successfully!</p>`;
            
        // Reload matching data
        loadVolunteerMatching();
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('profileMessage').innerHTML = 
            `<p style="color: red;">${error.message}</p>`;
    }
});

// Handle Event Form Submission
// Handle Event Form Submission
document.getElementById('eventForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = {
        eventName: document.getElementById('eventName').value,
        eventDescription: document.getElementById('eventDescription').value,
        eventLocation: document.getElementById('eventLocation').value,
        requiredSkills: Array.from(document.getElementById('eventSkills').selectedOptions).map(option => option.value),
        urgency: document.getElementById('urgency').value,
        eventDate: document.getElementById('eventDate').value,
        createdBy: localStorage.getItem('userEmail')
    };

    try {
        // Create event
        const response = await fetch('/api/matching/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error('Failed to create event');
        }

        const data = await response.json();
        
        alert('Event created successfully!');
        document.getElementById('eventForm').reset();
        
        // Reload matching data
        loadVolunteerMatching();
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
        const [eventsResponse, volunteersResponse] = await Promise.all([
            fetch('/api/matching/events'),
            fetch('/api/matching/volunteers')
        ]);

        const events = await eventsResponse.json();
        const volunteers = await volunteersResponse.json();

        console.log('Loaded events:', events); // Debug log
        console.log('Loaded volunteers:', volunteers); // Debug log

        const eventSelect = document.getElementById('matchEventName');
        const volunteerSelect = document.getElementById('volunteerName');

        // Clear existing options
        eventSelect.innerHTML = '<option value="">Select Event</option>';
        volunteerSelect.innerHTML = '<option value="">Select Volunteer</option>';

        // Populate events dropdown
        events.forEach(event => {
            const option = document.createElement('option');
            option.value = event.id;
            option.textContent = `${event.eventName} (${new Date(event.eventDate).toLocaleDateString()})`;
            eventSelect.appendChild(option);
        });

        // Populate volunteers dropdown
        volunteers.forEach(volunteer => {
            const option = document.createElement('option');
            option.value = volunteer.id;
            option.textContent = `${volunteer.name}`;
            volunteerSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading volunteer matching data:', error);
    }
}

// Add volunteer matching form handler
// Handle Volunteer Matching Form Submission
document.getElementById('matchingForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const formData = {
        volunteerId: document.getElementById('volunteerName').value,
        eventId: document.getElementById('matchEventName').value
    };

    if (!formData.volunteerId || !formData.eventId) {
        alert('Please select both a volunteer and an event');
        return;
    }

    try {
        const response = await fetch('/api/matching/match', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error('Failed to create match');
        }

        const data = await response.json();
        document.getElementById('matchMessage').innerHTML = 
            `<p style="color: green;">Successfully matched volunteer to event!</p>`;
            
        // Optionally refresh the matching data
        loadVolunteerMatching();
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('matchMessage').innerHTML = 
            `<p style="color: red;">${error.message || 'Failed to create match.'}</p>`;
    }
});

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