const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const Contact = require("../models/contact");
const memoryStore = require("../config/memoryStore");
const dotenv = require("dotenv");
dotenv.config();

const isMongoActive = () => mongoose.connection.readyState === 1;

let transporter = null;
if (process.env.GMAIL_EMAIL && process.env.PASS) {
  transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.PASS,
    },
  });
}

// =================================================
//  CONTACT ADD ROUTES
// =================================================

const contactUs = async (req, res) => {
  const contactData = {
    name: req.body.name || "Anonymous",
    email: req.body.email || "no-email@provided.com",
    contactNo: req.body.contactNo || "",
    feedback: req.body.feedback || "",
  };

  try {
    if (isMongoActive()) {
      try {
        const newContact = new Contact({
          _id: new mongoose.Types.ObjectId(),
          ...contactData,
        });
        await newContact.save();
      } catch (dbErr) {
        console.warn("MongoDB contact save failed:", dbErr.message);
        memoryStore.saveContact(contactData);
      }
    } else {
      memoryStore.saveContact(contactData);
    }

    if (transporter) {
      const mailOptions = {
        from: contactData.email,
        to: "attainu.deepambahre@gmail.com",
        subject: "Our Blog Contact Form",
        text: `From: ${contactData.name} (${contactData.email})\nPhone: ${contactData.contactNo}\n\nMessage:\n${contactData.feedback}`,
      };
      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          console.warn("Email send failed:", error.message);
        }
      });
    }

    req.flash("success", "Thank you for contacting us! Your message has been received.");
    res.redirect("/contact");
  } catch (err) {
    console.error("Error in contactUs:", err);
    req.flash("error", "Failed to submit message. Please try again.");
    res.redirect("/contact");
  }
};

// Exports Our Index Routes
module.exports = {
  contactUs,
};