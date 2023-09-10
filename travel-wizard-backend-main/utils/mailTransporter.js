require('dotenv').config();

const nodeMailer = require('nodemailer');

const transporter = nodeMailer.createTransport({
    service:'Gmail',
    auth:{
        user:process.env.ADMIN_EMAIL,
        pass:process.env.EMAIL_PASS
    }
});

module.exports = transporter;
