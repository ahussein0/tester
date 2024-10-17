# Software Design Task 3 (Back-end)

## Features
- User Authentication: Users can register and log in with email and password.
- Profile Management: Users can update their profile details, including address, skills, and availability.
- Event Creation: Admins can create events with details like event name, location, required skills, and urgency.
- Volunteer Matching: Matches volunteers to events based on skills and availability.
- Notifications: Provides notifications for upcoming events and reminders.
- Volunteer History: Tracks and displays volunteer participation history.

## Technologies Used
- Node.js: JavaScript runtime used for building the backend server.
- Express: Web framework for Node.js to create and manage routes.
- Jest & Supertest: Testing libraries for unit and integration testing.
- Other Packages:
- body-parser: Parses incoming request bodies in a middleware.
- cors: Allows cross-origin requests for development.

## Installation and Setup
- clone the repository: ''' git clone https://github.com/ahussein0/S.DTask3.git
                            cd S.DTask3 ```

## Install Dependencies
- Make sure you have Node.js and npm installed. Install the necessary packages by running:
  ``` npm install ``` 
This will install all dependencies listed in package.json, including:
  - express
  - body-parser
  - cors
  - jest (for testing)
  - supertest (for testing)
