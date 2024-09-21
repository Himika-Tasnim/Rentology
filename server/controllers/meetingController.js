const nodemailer = require('nodemailer');
require("dotenv").config();

// Create the transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Utility function to send the mail
const sendMail = async (transporter, mailOptions) => {
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email has been sent.');
    } catch (error) {
        console.error('Error sending email:', error.message);
        throw error;  // Throwing the error so that the calling function can handle it
    }
};

// Function to handle sending meeting emails
const sendMeetingEmail = async (req, res) => {
    const { email } = req.params;
    const { date, time, meetLink, hostName, hostEmail } = req.body;

    // Basic validation to ensure required fields are provided
    if (!date || !time || !meetLink || !hostName || !hostEmail) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Further validation for email (simple format validation)
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
    }

    try {
        const mailOptions = {
            from: {
                name: 'Rentology',
                address: process.env.EMAIL,
            },
            to: email,
            subject: 'Scheduled Meeting Notification',
            text: `You have a meeting scheduled on ${date} at ${time}. Here is the link: ${meetLink}. You are invited by ${hostName} (${hostEmail}).`,
        };

        // Sending the email
        await sendMail(transporter, mailOptions);

        // Send success response
        return res.status(200).json({ message: 'Email sent successfully.' });
    } catch (error) {
        // Handling email sending errors
        console.error('Error sending email:', error.message);
        return res.status(500).json({ message: 'Failed to send email.' });
    }
};

module.exports = { sendMeetingEmail, sendMail, transporter };
