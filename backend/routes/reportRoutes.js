const express = require('express');
const router = express.Router();
const { Volunteer, Event, Match, VolunteerHistory } = require('../models');
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');
const moment = require('moment');

router.get('/generate-pdf', async (req, res) => {
    try {
        const volunteers = await Volunteer.find({}).lean();
        const events = await Event.find({}).lean();
        const matches = await Match.find().populate('eventId').lean();
        const history = await VolunteerHistory.find().lean();

        const doc = new PDFDocument();
        const chunks = [];

        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => {
            const result = Buffer.concat(chunks);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=volunteer-report.pdf');
            res.send(result);
        });

        // Title and Timestamp
        doc.fontSize(20).text('Volunteer Management System Report', { align: 'center' });
        doc.fontSize(12).text(`Generated: ${moment().format('MMMM Do YYYY, h:mm:ss a')}`, { align: 'right' });
        doc.moveDown(2);

        // Volunteers and Their History
        doc.fontSize(16).text('Volunteer Participation Report', { underline: true });
        doc.moveDown();

        for (const volunteer of volunteers) {
            doc.fontSize(14).text(volunteer.name);
            doc.fontSize(10).text(`Email: ${volunteer.email}`);
            doc.text(`Skills: ${volunteer.skills.join(', ')}`);
            
            // Get volunteer's history
            const volunteerHistory = history.filter(h => h.userId === volunteer.email);
            if (volunteerHistory.length > 0) {
                doc.text('Participation History:');
                volunteerHistory.forEach(h => {
                    doc.text(`• ${h.eventName} - ${moment(h.eventDate).format('MMM DD, YYYY')} - ${h.status}`);
                });
            } else {
                doc.text('No participation history');
            }
            doc.moveDown();
        }

        // Events and Assignments
        doc.addPage();
        doc.fontSize(16).text('Event Assignments Report', { underline: true });
        doc.moveDown();

        for (const event of events) {
            doc.fontSize(14).text(event.eventName);
            doc.fontSize(10)
               .text(`Date: ${moment(event.eventDate).format('MMM DD, YYYY')}`)
               .text(`Location: ${event.eventLocation}`)
               .text(`Required Skills: ${event.requiredSkills.join(', ')}`);

            // Get event matches
            const eventMatches = matches.filter(m => m.eventId?._id.toString() === event._id.toString());
            if (eventMatches.length > 0) {
                doc.text('Assigned Volunteers:');
                eventMatches.forEach(match => {
                    const volunteer = volunteers.find(v => v._id.toString() === match.volunteerId.toString());
                    if (volunteer) {
                        doc.text(`• ${volunteer.name} - ${match.status}`);
                    }
                });
            } else {
                doc.text('No volunteer assignments');
            }
            doc.moveDown();
        }

        doc.end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate PDF report' });
    }
});

router.get('/generate-csv', async (req, res) => {
    try {
        const volunteers = await Volunteer.find().lean();
        const events = await Event.find().lean();
        const matches = await Match.find().populate('eventId').lean();
        const history = await VolunteerHistory.find().lean();

        // Prepare volunteer participation data
        const volunteerParticipationData = volunteers.map(v => {
            const volunteerHistory = history.filter(h => h.userId === v.email);
            return {
                name: v.name,
                email: v.email,
                skills: v.skills.join('; '),
                dateRegistered: moment(v.dateRegistered).format('YYYY-MM-DD'),
                participationCount: volunteerHistory.length,
                events: volunteerHistory.map(h => h.eventName).join('; '),
                statuses: volunteerHistory.map(h => h.status).join('; ')
            };
        });

        // Prepare event assignments data
        const eventAssignmentsData = events.map(e => {
            const eventMatches = matches.filter(m => m.eventId?._id.toString() === e._id.toString());
            return {
                eventName: e.eventName,
                eventDate: moment(e.eventDate).format('YYYY-MM-DD'),
                location: e.eventLocation,
                requiredSkills: e.requiredSkills.join('; '),
                assignedVolunteers: eventMatches.length,
                volunteerNames: eventMatches.map(m => {
                    const volunteer = volunteers.find(v => v._id.toString() === m.volunteerId.toString());
                    return volunteer ? volunteer.name : 'Unknown';
                }).join('; ')
            };
        });

        // Generate CSVs
        const volunteerParser = new Parser();
        const eventParser = new Parser();
        
        const volunteersCsv = volunteerParser.parse(volunteerParticipationData);
        const eventsCsv = eventParser.parse(eventAssignmentsData);

        const combinedCsv = `VOLUNTEER PARTICIPATION\n${volunteersCsv}\n\nEVENT ASSIGNMENTS\n${eventsCsv}`;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=volunteer-report.csv');
        res.send(combinedCsv);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate CSV report' });
    }
});

module.exports = router;