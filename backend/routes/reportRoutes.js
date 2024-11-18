const express = require('express');
const router = express.Router();
const { generatePDFReport, generateCSVReport } = require('../utils/reportGenerator');
const Volunteer = require('../models/volunteer'); // Example model
const Event = require('../models/event'); // Example model

// Generate a PDF report
router.get('/generate-pdf', async (req, res) => {
    try {
        const volunteers = await Volunteer.find({});
        const events = await Event.find({});
        const pdfBuffer = await generatePDFReport(volunteers, events);
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate PDF report' });
    }
});

// Generate a CSV report
router.get('/generate-csv', async (req, res) => {
    try {
        const volunteers = await Volunteer.find({});
        const events = await Event.find({});
        const csvData = await generateCSVReport(volunteers, events);
        res.setHeader('Content-Type', 'text/csv');
        res.attachment('report.csv');
        res.send(csvData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate CSV report' });
    }
});

module.exports = router;