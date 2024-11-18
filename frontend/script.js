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

// Initialize the skills picker
function initializeSkillsPicker() {
    const skillsDropdown = document.getElementById('skills');
    const selectedSkillsContainer = document.getElementById('selectedSkillsContainer');
    const selectedSkillsList = document.getElementById('selectedSkillsList');

    if (skillsDropdown) {
        skillsDropdown.addEventListener('change', function() {
            selectedSkillsList.innerHTML = ''; // Clear previous list
            
            Array.from(this.selectedOptions).forEach(option => {
                const li = document.createElement('li');
                li.textContent = option.value;
                selectedSkillsList.appendChild(li);
            });
            
            selectedSkillsContainer.style.display = 
                selectedSkillsList.children.length > 0 ? 'block' : 'none';
        });
    }
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

        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        messageElement.innerHTML = `<p style="color: green;">Login successful!</p>`;
        localStorage.setItem('userEmail', email);
        showSection('dashboard');
    } catch (error) {
        messageElement.innerHTML = `<p style="color: red;">${error.message}</p>`;
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

        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        const data = await response.json();
        localStorage.setItem('userEmail', email);
        messageElement.innerHTML = '<p style="color: green;">Registration successful! Logging you in...</p>';
        setTimeout(() => showSection('dashboard'), 2000);
    } catch (error) {
        messageElement.innerHTML = `<p style="color: red;">${error.message}</p>`;
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
        console.log('Submitting profile data:', formData); // Debug log

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
            const profileError = await profileResponse.json();
            throw new Error(profileError.message || 'Failed to update profile');
        }

        // Register as volunteer with more data
        const volunteerData = {
            fullName: formData.fullName,
            email: userEmail,
            skills: formData.skills,
            availability: formData.availability,
            status: 'ACTIVE'
        };

        console.log('Registering volunteer with data:', volunteerData); // Debug log

        const volunteerResponse = await fetch('/api/matching/register-volunteer', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'user-id': userEmail 
            },
            body: JSON.stringify(volunteerData),
        });

        if (!volunteerResponse.ok) {
            const volunteerError = await volunteerResponse.json();
            throw new Error(volunteerError.message || 'Failed to register as volunteer');
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
        // Add console.log to debug the data being sent
        console.log('Sending event data:', formData);

        const response = await fetch('/api/events', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'user-id': localStorage.getItem('userEmail')  // Add user ID header
            },
            body: JSON.stringify(formData)
        });

        // Add console.log to see the response
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);

        if (!response.ok) {
            throw new Error(data.message || 'Failed to create event');
        }

        alert('Event created successfully!');
        document.getElementById('eventForm').reset();
        
    } catch (error) {
        console.error('Error creating event:', error);
        alert(error.message || 'Failed to create event');
    }
});

// Load Volunteer Matching
// Load Volunteer Matching
async function loadVolunteerMatching() {
    try {
        // Add loading indicators
        const eventSelect = document.getElementById('matchEventName');
        const volunteerSelect = document.getElementById('volunteerName');
        
        eventSelect.innerHTML = '<option value="">Loading events...</option>';
        volunteerSelect.innerHTML = '<option value="">Loading volunteers...</option>';

        const [eventsResponse, volunteersResponse] = await Promise.all([
            fetch('/api/matching/events'),
            fetch('/api/matching/volunteers')
        ]);

        const events = await eventsResponse.json();
        const volunteers = await volunteersResponse.json();

        console.log('Loaded events:', events); // Debug log
        console.log('Loaded volunteers:', volunteers); // Debug log

        // Clear and populate events dropdown
        eventSelect.innerHTML = '<option value="">Select Event</option>';
        events.forEach(event => {
            const option = document.createElement('option');
            option.value = event._id;  // Changed from event.id to event._id
            option.textContent = `${event.eventName} (${new Date(event.eventDate).toLocaleDateString()})`;
            eventSelect.appendChild(option);
        });

        // Clear and populate volunteers dropdown
        volunteerSelect.innerHTML = '<option value="">Select Volunteer</option>';
        volunteers.forEach(volunteer => {
            const option = document.createElement('option');
            option.value = volunteer._id;  // Changed from volunteer.id to volunteer._id
            option.textContent = volunteer.name;
            volunteerSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading matching data:', error);
        document.getElementById('matchMessage').innerHTML = 
            `<p style="color: red;">Error loading matching data</p>`;
    }
}

// Handle Volunteer Matching Form Submission
// Handle Volunteer Matching Form Submission
// Handle Volunteer Matching Form Submission
document.getElementById('matchingForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const volunteerId = document.getElementById('volunteerName').value;
    const eventId = document.getElementById('matchEventName').value;
    const messageElement = document.getElementById('matchMessage');

    // Clear previous messages
    messageElement.innerHTML = '';

    // Validate selections
    if (!volunteerId || !eventId) {
        messageElement.innerHTML = '<p style="color: red;">Please select both a volunteer and an event</p>';
        return;
    }

    try {
        console.log('Sending match data:', { volunteerId, eventId }); // Debug log

        const response = await fetch('/api/matching/match', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ volunteerId, eventId })
        });

        const data = await response.json();
        console.log('Match response:', data); // Debug log

        if (!response.ok) {
            throw new Error(data.message || 'Failed to create match');
        }

        messageElement.innerHTML = '<p style="color: green;">Successfully matched volunteer to event!</p>';
        
        // Reload matching data and history
        await Promise.all([
            loadVolunteerMatching(),
            loadVolunteerHistory()
        ]);

        // Reset form selections
        document.getElementById('matchingForm').reset();

    } catch (error) {
        console.error('Error:', error);
        messageElement.innerHTML = `<p style="color: red;">${error.message || 'Failed to create match'}</p>`;
    }
});

// Load Volunteer History
async function loadVolunteerHistory() {
    try {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) return;

        const response = await fetch('/api/history', {
            headers: {
                'user-id': userEmail
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch history');
        }

        const history = await response.json();
        const tableBody = document.getElementById('historyTable').querySelector('tbody');

        if (history.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="3">No history found.</td></tr>';
            return;
        }

        tableBody.innerHTML = history.map(h => `
            <tr>
                <td>${h.eventName}</td>
                <td>${new Date(h.eventDate).toLocaleDateString()}</td>
                <td>${h.status}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading volunteer history:', error);
        const tableBody = document.getElementById('historyTable').querySelector('tbody');
        tableBody.innerHTML = '<tr><td colspan="3">Error loading history</td></tr>';
    }
}

// Handle Generate PDF Report
document.getElementById('generate-pdf').addEventListener('click', () => {
    fetch('/api/reports/generate-pdf')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to generate PDF report');
            }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'report.pdf';
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            alert(`Error: ${error.message}`);
        });
});

// Handle Generate CSV Report
document.getElementById('generate-csv').addEventListener('click', () => {
    fetch('/api/reports/generate-csv')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to generate CSV report');
            }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'report.csv';
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            alert(`Error: ${error.message}`);
        });
});
