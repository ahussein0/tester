// Function to show different sections
function showSection(sectionId) {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = section.id === sectionId ? 'block' : 'none';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    showSection('dashboard');
    loadNotifications();
    loadVolunteerHistory();
});

$(function() {
    const selectedDates = [];

    // Initialize the datepicker
    $('#availability').datepicker({
        onSelect: function(dateText, inst) {
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
        showButtonPanel: true
    });
});

// Handle sidebar link clicks
document.querySelectorAll(".sidebar-links a").forEach((elem) => {
    elem.addEventListener("click", function (event) {
        event.preventDefault();
        const sectionId = this.getAttribute('onclick').match(/'([^']+)'/)[1];
        showSection(sectionId);
    });
});

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageElement = document.getElementById('loginMessage');
    const submitButton = event.target.querySelector('button[type="submit"]');

    try {
        submitButton.disabled = true;
        submitButton.textContent = 'Logging in...';

        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            messageElement.innerHTML = '<p style="color: green;">Login successful!</p>';
            localStorage.setItem('userEmail', email);
            showSection('dashboard');
        } else {
            messageElement.innerHTML = `<p style="color: red;">${data.message || 'Login failed'}</p>`;
        }
    } catch (error) {
        console.error('Login error:', error);
        messageElement.innerHTML = '<p style="color: red;">Server error. Please try again later.</p>';
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Login';
    }
});

// Handle registration form submission
document.getElementById('registrationForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    console.log('Registration form submitted');
    
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const messageElement = document.getElementById('registerMessage');
    const submitButton = event.target.querySelector('button[type="submit"]');
    
    try {
        // Add loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Registering...';
        
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        console.log('Server response:', data);
        
        if (response.ok) {
            messageElement.innerHTML = '<p style="color: green;">Registration successful! Redirecting to login...</p>';
            setTimeout(() => showSection('login'), 2000);
        } else {
            messageElement.innerHTML = `<p style="color: red;">${data.message || 'Registration failed'}</p>`;
        }
    } catch (error) {
        console.error('Registration error:', error);
        messageElement.innerHTML = '<p style="color: red;">Server error. Please try again later.</p>';
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Register';
    }
});

// Handle profile form submission
document.getElementById('profileForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const address1 = document.getElementById('address1').value.trim();

    if (address1.length < 5) {
        alert('Address 1 must be at least 5 characters long.');
        return;
    }

    const formData = {
        fullName: document.getElementById('fullName').value,
        address1: address1,
        address2: document.getElementById('address2').value.trim(),
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zipCode: document.getElementById('zipCode').value,
        skills: Array.from(document.getElementById('skills').selectedOptions).map(option => option.value),
        preferences: document.getElementById('preferences').value,
        availability: document.getElementById('availability').value
    };

    try {
        const response = await fetch('http://localhost:3000/api/profile', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'user-id': localStorage.getItem('userEmail')
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        document.getElementById('profileMessage').innerHTML = 
            `<p style="color: ${data.status === 'success' ? 'green' : 'red'};">${data.message}</p>`;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('profileMessage').innerHTML = 
            '<p style="color: red;">Failed to update profile. Please try again.</p>';
    }
});

// Handle event creation form submission
document.getElementById('eventForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = {
        eventName: document.getElementById('eventName').value,
        eventDescription: document.getElementById('eventDescription').value,
        eventLocation: document.getElementById('eventLocation').value,
        requiredSkills: Array.from(document.getElementById('skills').selectedOptions).map(option => option.value),
        urgency: document.getElementById('urgency').value,
        eventDate: document.getElementById('eventDate').value
    };

    try {
        const response = await fetch('http://localhost:3000/api/events', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'user-id': localStorage.getItem('userEmail')
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();
        document.getElementById('eventMessage').innerHTML = 
            `<p style="color: ${data.status === 'success' ? 'green' : 'red'};">${data.message}</p>`;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('eventMessage').innerHTML = 
            '<p style="color: red;">Failed to create event. Please try again.</p>';
    }
});

// Handle volunteer matching form submission
document.getElementById('matchingForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    const eventId = document.getElementById('eventName').value;
    const messageElement = document.getElementById('matchMessage');

    try {
        const response = await fetch('http://localhost:3000/api/match', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'user-id': localStorage.getItem('userEmail')
            },
            body: JSON.stringify({ eventId })
        });

        const data = await response.json();
        messageElement.innerHTML = 
            `<p style="color: ${data.status === 'success' ? 'green' : 'red'};">${data.message}</p>`;
    } catch (error) {
        console.error('Error:', error);
        messageElement.innerHTML = 
            '<p style="color: red;">Failed to match volunteer. Please try again.</p>';
    }
});

// Function to load and display volunteer history
async function loadVolunteerHistory() {
    try {
        const response = await fetch('http://localhost:3000/api/history', {
            headers: { 'user-id': localStorage.getItem('userEmail') }
        });

        const data = await response.json();
        const historyTableBody = document.getElementById('historyTable').querySelector('tbody');
        historyTableBody.innerHTML = '';
        
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.eventName}</td>
                <td>${item.eventDate}</td>
                <td>${item.status}</td>
            `;
            historyTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading history:', error);
    }
}

// Function to load and display notifications
async function loadNotifications() {
    try {
        const response = await fetch('http://localhost:3000/api/notifications', {
            headers: { 'user-id': localStorage.getItem('userEmail') }
        });

        const data = await response.json();
        const notificationElement = document.getElementById('notificationMessage');
        notificationElement.innerHTML = '';
        
        data.forEach(notification => {
            const p = document.createElement('p');
            p.textContent = notification.message;
            notificationElement.appendChild(p);
        });
    } catch (error) {
        console.error('Error loading notifications:', error);
    }
}

// Handle skill selection and move to the selected box
const skillSelect = document.getElementById('skills');
const selectedSkillsList = document.getElementById('selectedSkillsList');

skillSelect.addEventListener('change', function() {
    const selectedOptions = Array.from(skillSelect.selectedOptions);

    selectedOptions.forEach(option => {
        const listItem = document.createElement('li');
        listItem.textContent = option.textContent;
        selectedSkillsList.appendChild(listItem);
        option.remove();

        listItem.addEventListener('click', function() {
            const newOption = document.createElement('option');
            newOption.value = option.value;
            newOption.textContent = option.textContent;
            skillSelect.appendChild(newOption);
            listItem.remove();
        });
    });
});

// Initial load of data
loadVolunteerHistory();
loadNotifications();