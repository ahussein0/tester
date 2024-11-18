const PDFDocument = require('pdfkit');
const { Parser } = require('json2csv');
const moment = require('moment'); 

// Generate PDF Report
const generatePDFReport = async (volunteers, events) => {
    const doc = new PDFDocument();
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {});

    doc.fontSize(20).text('Volunteer and Event Report', { underline: true });
    doc.moveDown();

    // Add volunteer details
    doc.fontSize(14).text('Volunteers:');
    if (volunteers.length > 0) {
        volunteers.forEach(volunteer => {
            doc.text(`- ${volunteer.name}, Email: ${volunteer.email}`);
        });
    } else {
        doc.text('No volunteers found.');
    }
    doc.moveDown();

    // Add event details
    doc.text('Events:');
    if (events.length > 0) {
        events.forEach(event => {
            const formattedDate = moment(event.date).format('YYYY-MM-DD');
            doc.text(`- ${event.name}, Date: ${formattedDate}`);
        });
    } else {
        doc.text('No events found.');
    }

    doc.end();

    return new Promise((resolve, reject) => {
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);
    });
};


// Generate CSV Report
const generateCSVReport = async (volunteers, events) => {
    const volunteerFields = ['name', 'email', 'participation'];
    const eventFields = ['name', 'date', 'volunteerCount'];

    const parser = new Parser();

    let volunteerCSV = 'No volunteer data available.';
    let eventCSV = 'No event data available.';

    if (volunteers.length > 0) {
        volunteerCSV = parser.parse(
            volunteers.map(v => ({
                name: v.name,
                email: v.email,
                participation: v.participation.length || 0,
            })),
            { fields: volunteerFields }
        );
    }

    if (events.length > 0) {
        eventCSV = parser.parse(
            events.map(e => ({
                name: e.name,
                date: e.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
                volunteerCount: e.volunteers.length || 0,
            })),
            { fields: eventFields }
        );
    }

    return `${volunteerCSV}\n\n${eventCSV}`;
};

module.exports = { generatePDFReport, generateCSVReport };
