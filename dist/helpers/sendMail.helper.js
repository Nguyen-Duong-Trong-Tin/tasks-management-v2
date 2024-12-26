"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});
const sendMailHelper = (email, title, html) => {
    var mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: title,
        html: html
    };
    transporter.sendMail(mailOptions, (e, info) => {
        if (e) {
            console.log(e);
        }
        else {
            console.log("Email sent: " + info.response);
        }
    });
};
exports.default = sendMailHelper;
