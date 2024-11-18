const express = require('express');
const router = express.Router();
const { Volunteer, Event } = require('../models');
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');
const moment = require('moment');

// Generate a PDF report
router.get('/generate-pdf', async (req, res) => {
    try {
        const volunteers = await Volunteer.find({}).lean();
        const events = await Event.find({}).lean();
        
        const doc = new PDFDocument();
        const chunks = [];

        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => {
            const result = Buffer.concat(chunks);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
            res.send(result);
        });

        // Add content to PDF
        doc.fontSize(20).text('Volunteer Management System Report', { align: 'center' });
        doc.moveDown();
        
        // Add timestamps
        doc.fontSize(12).text(`Generated: ${moment().format('MMMM Do YYYY, h:mm:ss a')}`, { align: 'right' });
        doc.moveDown();

        // Volunteers Section
        doc.fontSize(16).text('Volunteers', { underline: true });
        volunteers.forEach(volunteer => {
            doc.fontSize(12)
               .text(`Name: ${volunteer.name}`)
               .text(`Email: ${volunteer.email}`)
               .text(`Skills: ${volunteer.skills.join(', ')}`)
               .moveDown();
        });

        // Events Section
        doc.addPage();
        doc.fontSize(16).text('Events', { underline: true });
        events.forEach(event => {
            doc.fontSize(12)
               .text(`Event: ${event.eventName}`)
               .text(`Date: ${moment(event.eventDate).format('MMM Do, YYYY')}`)
               .text(`Location: ${event.eventLocation}`)
               .text(`Required Skills: ${event.requiredSkills.join(', ')}`)
               .moveDown();
        });

        doc.end();

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate PDF report' });
    }
});

// Generate a CSV report
router.get('/generate-csv', async (req, res) => {
    try {
        const volunteers = await Volunteer.find({}).lean();
        const events = await Event.find({}).lean();

        // Prepare volunteer data
        const volunteerFields = ['name', 'email', 'skills', 'dateRegistered'];
        const volunteerParser = new Parser({ fields: volunteerFields });
        const volunteerData = volunteers.map(v => ({
            ...v,
            skills: v.skills.join('; '),
            dateRegistered: moment(v.dateRegistered).format('YYYY-MM-DD')
        }));

        // Prepare event data
        const eventFields = ['eventName', 'eventLocation', 'eventDate', 'requiredSkills'];
        const eventParser = new Parser({ fields: eventFields });
        const eventData = events.map(e => ({
            ...e,
            requiredSkills: e.requiredSkills.join('; '),
            eventDate: moment(e.eventDate).format('YYYY-MM-DD')
        }));

        // Generate CSVs
        const volunteersCsv = volunteerParser.parse(volunteerData);
        const eventsCsv = eventParser.parse(eventData);

        // Combine reports
        const combinedCsv = `VOLUNTEERS\n${volunteersCsv}\n\nEVENTS\n${eventsCsv}`;

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=report.csv');
        res.send(combinedCsv);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate CSV report' });
    }
});

module.exports = router;