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
          // Add the selected date to the array if it's not already selected
          if (!selectedDates.includes(dateText)) {
              selectedDates.push(dateText);
          } else {
              // If already selected, remove it from the array (toggle functionality)
              const index = selectedDates.indexOf(dateText);
              if (index > -1) {
                  selectedDates.splice(index, 1);
              }
          }

          // Update the input field with the selected dates
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
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('loginMessage').innerHTML = `<p style="color: ${data.status === 'success' ? 'green' : 'red'};">${data.message}</p>`;
        if (data.status === 'success') {
            localStorage.setItem('userEmail', email);
            showSection('dashboard');
        }
    })
    .catch(error => console.error('Error:', error));
});

// Handle registration form submission
document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('registerMessage').innerHTML = `<p style="color: ${data.status === 'success' ? 'green' : 'red'};">${data.message}</p>`;
    })
    .catch(error => console.error('Error:', error));
});

// Handle profile form submission
document.getElementById('profileForm').addEventListener('submit', function(event) {
  event.preventDefault();

  // Get Address 1 value and trim any extra whitespace
  const address1 = document.getElementById('address1').value.trim();

  // Validate Address 1: Check if it's at least 5 characters long after trimming
  if (address1.length < 5) {
      alert('Address 1 must be at least 5 characters long.');
      return;  // Stop the form submission if validation fails
  }

  // If validation passes, proceed to gather form data
  const formData = {
      fullName: document.getElementById('fullName').value,
      address1: document.getElementById('address1').value.trim(),  // Trim the address before submitting
      address2: document.getElementById('address2').value.trim(),  // Trim Address 2 as well
      city: document.getElementById('city').value,
      state: document.getElementById('state').value,
      zipCode: document.getElementById('zipCode').value,
      skills: Array.from(document.getElementById('skills').selectedOptions).map(option => option.value),
      preferences: document.getElementById('preferences').value,
      availability: document.getElementById('availability').value
  };

  // Proceed with fetch or other submission logic (e.g., sending the data to the server)
  fetch('/profile', {
      method: 'POST',
      headers: { 
          'Content-Type': 'application/json',
          'user-id': localStorage.getItem('userEmail')
      },
      body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {
      document.getElementById('profileMessage').innerHTML = `<p style="color: ${data.status === 'success' ? 'green' : 'red'};">${data.message}</p>`;
  })
  .catch(error => console.error('Error:', error));
});



// Handle event creation form submission
// Handle event creation form submission
document.getElementById('eventForm').addEventListener('submit', function(event) {
  event.preventDefault();
  const formData = {
      eventName: document.getElementById('eventName').value,
      eventDescription: document.getElementById('eventDescription').value,
      eventLocation: document.getElementById('eventLocation').value,
      requiredSkills: Array.from(document.getElementById('requiredSkills').selectedOptions).map(option => option.value),
      urgency: document.getElementById('urgency').value,
      eventDate: document.getElementById('eventDate').value
  };

  fetch('/events', {
      method: 'POST',
      headers: { 
          'Content-Type': 'application/json',
          'user-id': localStorage.getItem('userEmail')
      },
      body: JSON.stringify(formData)
  })
  .then(response => response.json())
  .then(data => {
      document.getElementById('eventMessage').innerHTML = `<p style="color: ${data.status === 'success' ? 'green' : 'red'};">${data.message}</p>`;
  })
  .catch(error => console.error('Error:', error));
});


// Handle volunteer matching form submission
document.getElementById('matchingForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const eventId = document.getElementById('eventName').value;

    fetch('/match', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'user-id': localStorage.getItem('userEmail')
        },
        body: JSON.stringify({ eventId })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('matchMessage').innerHTML = `<p style="color: ${data.status === 'success' ? 'green' : 'red'};">${data.message}</p>`;
    })
    .catch(error => console.error('Error:', error));
});

// Function to load and display volunteer history
function loadVolunteerHistory() {
    fetch('/history', {
        headers: { 'user-id': localStorage.getItem('userEmail') }
    })
    .then(response => response.json())
    .then(data => {
        const historyTableBody = document.getElementById('historyTable').querySelector('tbody');
        historyTableBody.innerHTML = '';
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.eventName}</td>
                <td>${item.eventDate}</td>
                <td>${item.eventLocation}</td>
                <td>${item.requiredSkills.join(', ')}</td>
                <td>${item.urgency}</td>
                <td>${item.status}</td>
            `;
            historyTableBody.appendChild(row);
        });
    })
    .catch(error => console.error('Error:', error));
}

// Function to load and display notifications
function loadNotifications() {
    fetch('/notifications', {
        headers: { 'user-id': localStorage.getItem('userEmail') }
    })
    .then(response => response.json())
    .then(data => {
        const notificationList = document.getElementById('notificationList');
        notificationList.innerHTML = '';
        data.forEach(notification => {
            const p = document.createElement('p');
            p.textContent = notification.message;
            notificationList.appendChild(p);
        });
    })
    .catch(error => console.error('Error:', error));
}

// Populate volunteer and event dropdowns for matching
function populateDropdowns() {
    // This would typically fetch data from the server
    // For this example, we'll use dummy data
    const volunteers = ['John Doe', 'Jane Smith', 'Bob Johnson'];
    const events = ['Community Cleanup', 'Food Drive', 'Elderly Care'];

    const volunteerSelect = document.getElementById('volunteerName');
    const eventSelect = document.getElementById('eventName');

    volunteers.forEach(volunteer => {
        const option = document.createElement('option');
        option.value = volunteer;
        option.textContent = volunteer;
        volunteerSelect.appendChild(option);
    });

    events.forEach(event => {
        const option = document.createElement('option');
        option.value = event;
        option.textContent = event;
        eventSelect.appendChild(option);
    });
}

// Handle skill selection and move to the selected box
const skillSelect = document.getElementById('skills');
const selectedSkillsList = document.getElementById('selectedSkillsList');

skillSelect.addEventListener('change', function() {
    const selectedOptions = Array.from(skillSelect.selectedOptions);

    selectedOptions.forEach(option => {
        // Create a list item for the selected skill
        const listItem = document.createElement('li');
        listItem.textContent = option.textContent;

        // Add the skill to the selected skills list
        selectedSkillsList.appendChild(listItem);

        // Remove the skill from the dropdown
        option.remove();

        // Add a click event to remove the skill when clicked in the selected box
        listItem.addEventListener('click', function() {
            // Add the skill back to the dropdown
            const newOption = document.createElement('option');
            newOption.value = option.value;
            newOption.textContent = option.textContent;
            skillSelect.appendChild(newOption);

            // Remove the skill from the selected list
            listItem.remove();
        });
    });
});



populateDropdowns();