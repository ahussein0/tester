// backend/utils/reportGenerator.js
const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');
const moment = require('moment');

const generatePDFReport = async (volunteers, events) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument();
            const chunks = [];

            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));

            // Title
            doc.fontSize(20).text('Volunteer Management System Report', { align: 'center' });
            doc.moveDown();
            
            // Add current date
            doc.fontSize(12).text(`Generated on: ${moment().format('MMMM Do YYYY, h:mm:ss a')}`, { align: 'right' });
            doc.moveDown();

            // Volunteers Section
            doc.fontSize(16).text('Volunteers Summary', { underline: true });
            doc.fontSize(12).text(`Total Volunteers: ${volunteers.length}`);
            doc.moveDown();

            volunteers.forEach(volunteer => {
                doc.text(`Name: ${volunteer.name}`);
                doc.text(`Email: ${volunteer.email}`);
                doc.text(`Skills: ${volunteer.skills.join(', ')}`);
                doc.text(`Registered: ${moment(volunteer.dateRegistered).format('MMMM Do YYYY')}`);
                doc.moveDown();
            });

            // Events Section
            doc.addPage();
            doc.fontSize(16).text('Events Summary', { underline: true });
            doc.fontSize(12).text(`Total Events: ${events.length}`);
            doc.moveDown();

            events.forEach(event => {
                doc.text(`Event: ${event.eventName}`);
                doc.text(`Description: ${event.eventDescription}`);
                doc.text(`Location: ${event.eventLocation}`);
                doc.text(`Date: ${moment(event.eventDate).format('MMMM Do YYYY')}`);
                doc.text(`Urgency: ${event.urgency}`);
                doc.text(`Required Skills: ${event.requiredSkills.join(', ')}`);
                doc.moveDown();
            });

            doc.end();
        } catch (error) {
            reject(error);
        }
    });
};

const generateCSVReport = async (volunteers, events) => {
    try {
        // Prepare volunteer data
        const volunteerFields = ['name', 'email', 'skills', 'dateRegistered', 'status'];
        const volunteerOpts = { fields: volunteerFields };
        const volunteerParser = new Parser(volunteerOpts);
        const volunteerData = volunteers.map(v => ({
            ...v.toObject(),
            skills: v.skills.join('; '),
            dateRegistered: moment(v.dateRegistered).format('YYYY-MM-DD')
        }));

        // Prepare event data
        const eventFields = ['eventName', 'eventDescription', 'eventLocation', 'eventDate', 'urgency', 'requiredSkills'];
        const eventOpts = { fields: eventFields };
        const eventParser = new Parser(eventOpts);
        const eventData = events.map(e => ({
            ...e.toObject(),
            requiredSkills: e.requiredSkills.join('; '),
            eventDate: moment(e.eventDate).format('YYYY-MM-DD')
        }));

        // Generate CSVs
        const volunteersCSV = volunteerParser.parse(volunteerData);
        const eventsCSV = eventParser.parse(eventData);

        // Combine the reports with headers
        return `VOLUNTEERS\n${volunteersCSV}\n\nEVENTS\n${eventsCSV}`;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    generatePDFReport,
    generateCSVReport
};