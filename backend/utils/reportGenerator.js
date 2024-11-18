const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');
const moment = require('moment');

const generatePDFReport = async (volunteers, events, matches, history) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument();
            const chunks = [];

            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));

            // Title and Header
            doc.fontSize(20).text('Volunteer Management System Report', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`Generated on: ${moment().format('MMMM Do YYYY, h:mm:ss a')}`, { align: 'right' });
            doc.moveDown(2);

            // Volunteers and Participation History
            doc.fontSize(16).text('Volunteer Participation Summary', { underline: true });
            doc.fontSize(12).text(`Total Active Volunteers: ${volunteers.length}`);
            doc.moveDown();

            volunteers.forEach(volunteer => {
                doc.fontSize(14).text(volunteer.name, { continued: true })
                   .fontSize(10).text(` (${volunteer.email})`);
                doc.fontSize(10).text(`Skills: ${volunteer.skills.join(', ')}`);
                
                // Add participation history
                const volunteerHistory = history.filter(h => h.userId === volunteer.email);
                if (volunteerHistory.length > 0) {
                    doc.text('Event Participation:');
                    volunteerHistory.forEach(h => {
                        doc.text(`• ${h.eventName} - ${moment(h.eventDate).format('MMM DD YYYY')} - ${h.status}`);
                    });
                }
                doc.moveDown();
            });

            // Events and Assignments Section
            doc.addPage();
            doc.fontSize(16).text('Events and Volunteer Assignments', { underline: true });
            doc.fontSize(12).text(`Total Events: ${events.length}`);
            doc.moveDown();

            events.forEach(event => {
                doc.fontSize(14).text(event.eventName);
                doc.fontSize(10)
                   .text(`Date: ${moment(event.eventDate).format('MMMM Do YYYY')}`)
                   .text(`Location: ${event.eventLocation}`)
                   .text(`Urgency: ${event.urgency}`)
                   .text(`Required Skills: ${event.requiredSkills.join(', ')}`);

                // Add volunteer assignments
                const eventMatches = matches.filter(m => m.eventId.toString() === event._id.toString());
                if (eventMatches.length > 0) {
                    doc.text('Assigned Volunteers:');
                    eventMatches.forEach(match => {
                        const volunteer = volunteers.find(v => v._id.toString() === match.volunteerId.toString());
                        if (volunteer) {
                            doc.text(`• ${volunteer.name} - ${match.status}`);
                        }
                    });
                }
                doc.moveDown(2);
            });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

const generateCSVReport = async (volunteers, events, matches, history) => {
    try {
        // Prepare volunteer participation data
        const volunteerData = volunteers.map(v => {
            const volunteerHistory = history.filter(h => h.userId === v.email);
            return {
                name: v.name,
                email: v.email,
                skills: v.skills.join('; '),
                dateRegistered: moment(v.dateRegistered).format('YYYY-MM-DD'),
                totalEvents: volunteerHistory.length,
                eventHistory: volunteerHistory.map(h => 
                    `${h.eventName}(${h.status})`
                ).join('; ')
            };
        });

        // Prepare event assignment data
        const eventData = events.map(e => {
            const eventMatches = matches.filter(m => m.eventId.toString() === e._id.toString());
            return {
                eventName: e.eventName,
                date: moment(e.eventDate).format('YYYY-MM-DD'),
                location: e.eventLocation,
                requiredSkills: e.requiredSkills.join('; '),
                urgency: e.urgency,
                assignedVolunteers: eventMatches.map(m => {
                    const volunteer = volunteers.find(v => v._id.toString() === m.volunteerId.toString());
                    return volunteer ? `${volunteer.name}(${m.status})` : null;
                }).filter(Boolean).join('; ')
            };
        });

        // Generate CSVs
        const volunteerParser = new Parser();
        const eventParser = new Parser();

        const volunteersCSV = volunteerParser.parse(volunteerData);
        const eventsCSV = eventParser.parse(eventData);

        return `VOLUNTEER PARTICIPATION\n${volunteersCSV}\n\nEVENT ASSIGNMENTS\n${eventsCSV}`;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    generatePDFReport,
    generateCSVReport
};