const express = require('express');
const router = express.Router();
const { parse } = require('json2csv');
const PDFDocument = require('pdfkit');
const VolunteerHistory = require('../models/VolunteerHistory');
const EventDetails = require('../models/EventDetails');

// Generate Reports
router.get('/:format', async (req, res) => {
    const { format } = req.params;
    const { type } = req.query;

    if (!type) {
        return res.status(400).json({ message: 'Report type is required' });
    }

    let data;
    try {
        if (type === 'volunteer') {
            data = await VolunteerHistory.find().populate('userId eventId', 'fullName eventName eventDate');
        } else if (type === 'event') {
            data = await EventDetails.find();
        } else {
            return res.status(400).json({ message: 'Invalid report type' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching data', error: error.message });
    }

    if (format === 'csv') {
        try {
            const csv = parse(data);
            res.header('Content-Type', 'text/csv');
            res.attachment(`${type}_report.csv`);
            return res.send(csv);
        } catch (err) {
            return res.status(500).json({ message: 'Error generating CSV', error: err.message });
        }
    } else if (format === 'pdf') {
        try {
            const doc = new PDFDocument();
            res.header('Content-Type', 'application/pdf');
            res.attachment(`${type}_report.pdf`);

            doc.fontSize(14).text(`Report Type: ${type}`, { underline: true });
            doc.moveDown();
            data.forEach((item, index) => {
                doc.text(`${index + 1}. ${JSON.stringify(item, null, 2)}`);
                doc.moveDown();
            });
            doc.end();
            doc.pipe(res);
        } catch (err) {
            return res.status(500).json({ message: 'Error generating PDF', error: err.message });
        }
    } else {
        return res.status(400).json({ message: 'Unsupported format. Use "csv" or "pdf"' });
    }
});

module.exports = router;
