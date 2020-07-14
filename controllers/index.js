// Importing mongoose
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');

// Importing Blog model
const Contact = require('../models/contact');
dotenv = require("dotenv");
dotenv.config();

  let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.PASS
    }
});



// =================================================
//  CONTACT ADD ROUTES
// =================================================


const contactUs = (req, res) => {

    let mailOptions = {
        from: req.body.email,
        to: 'attainu.deepambahre@gmail.com',
        subject: 'Our Blog',
        text: req.body.feedback
    };
    let newContact = new Contact({
        _id : new mongoose.Types.ObjectId(),
        name : req.body.name,
        email : req.body.email,
        contactNo : req.body.contactNo,
        feedback : req.body.feedback
    });

    newContact.save()
    .then(contact => {
        console.log(contact);

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error.message);
            }
            console.log('success');
            res.redirect('/');
        });

    })
    .catch(err => {
        //req.flash('error','Failed to create contact.');
        res.redirect('/contact');
    });

};

// Exports Our Index Routes
module.exports = {
    contactUs
};