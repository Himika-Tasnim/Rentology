const express = require('express');
const { sendMeetingEmail } = require('../controllers/meetingController');
const router = express.Router();


const { protect } = require('../middlewares/authMiddleware');

router.post('/:owner', protect, sendMeetingEmail);

module.exports = router;
