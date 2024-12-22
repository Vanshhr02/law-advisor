import express from 'express';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
dotenv.config();

const adminRouter = express.Router();

// Dummy admin credentials (replace with environment variables or database in production)
const adminCredentials = {
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Path to the JSON file where lawyer applications are stored
const filePath = path.join(__dirname, '../dummyLawyers.json');

// Function to read lawyer applications from JSON file
const getLawyers = () => {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return data;
  } catch (error) {
    console.error('Error fetching lawyers:', error);
    return []; // Return empty array on error
  }
};

// Function to write lawyer applications to JSON file
const saveLawyers = (data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving lawyer applications:', error);
  }
};

// Admin login route (assuming basic authentication for simplicity)
adminRouter.post('/loginasadmin', (req, res) => {
  const { username, password } = req.body;

  if (username === adminCredentials.username && password === adminCredentials.password) {
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Route to fetch all lawyer applications (GET request)
adminRouter.get('/lawyers', (req, res) => {
  const lawyers = getLawyers();
  res.status(200).json(lawyers);
});

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });
  
  // Function to send email notifications
  const sendEmailNotification = async (to, subject, html) => {
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };
  
  // Route to approve or reject lawyer application (POST request)
  adminRouter.post('/approve-reject', (req, res) => {
    const { lawyerId, status } = req.body; 
  
    if (!lawyerId || !status || (status !== 'approved' && status !== 'rejected')) {
      return res.status(400).json({ message: 'Invalid request parameters' });
    }
  
    const lawyers = getLawyers();
    const lawyerIndex = lawyers.findIndex(lawyer => lawyer.id === lawyerId);
  
    if (lawyerIndex === -1) {
      return res.status(404).json({ message: 'Lawyer not found' });
    }
  
    lawyers[lawyerIndex].status = status;
    saveLawyers(lawyers);
  
    // Send email notification
    const lawyer = lawyers[lawyerIndex];
    const notificationMessage = `<p>Hello ${lawyer.name},</p><p>Your application has been ${status} by the admin.</p>`;
    sendEmailNotification(lawyer.email, `Your application has been ${status}`, notificationMessage);
  
    res.status(200).json({ message: `Lawyer application ${status} successfully` });
  });

export default adminRouter;