import express from "express";
import fs from "fs";
 import dotenv from 'dotenv';
import path from "path";
import { fileURLToPath } from "url";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const adminRouter = express.Router();

const adminCredentials = {
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
};


const pendingFilePath = path.join(__dirname, "../pendingLawyers.json");
const approvedFilePath = path.join(__dirname, "../dummyLawyers.json");


if (!fs.existsSync(pendingFilePath)) fs.writeFileSync(pendingFilePath, "[]", "utf8");
if (!fs.existsSync(approvedFilePath)) fs.writeFileSync(approvedFilePath, "[]", "utf8");


adminRouter.post("/submit-lawyer", (req, res) => {
  try {
    const { name, contact, speciality, description } = req.body;

    if (!name || !contact || !speciality || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const pendingLawyers = JSON.parse(fs.readFileSync(pendingFilePath, "utf8"));

    const newLawyer = {
      id: Date.now(),
      name,
      contact,
      speciality,
      description,
      status: "pending",
    };

    pendingLawyers.push(newLawyer);
    fs.writeFileSync(pendingFilePath, JSON.stringify(pendingLawyers, null, 2), "utf8");

    res.status(200).json({ message: "Lawyer application submitted for review", lawyer: newLawyer });
  } catch (error) {
    console.error("Error submitting lawyer:", error);
    res.status(500).json({ message: "Error submitting lawyer application", error });
  }
});


adminRouter.get("/pending-lawyers", (req, res) => {
  try {
    const pendingLawyers = JSON.parse(fs.readFileSync(pendingFilePath, "utf8"));
    res.status(200).json(pendingLawyers);
  } catch (error) {
    console.error("Error fetching pending lawyers:", error);
    res.status(500).json({ message: "Error fetching pending lawyers", error });
  }
});


adminRouter.post('/loginasadmin', (req, res) => {
  const { username, password } = req.body;

  if (username === adminCredentials.username && password === adminCredentials.password) {
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});


adminRouter.patch("/approve-reject", (req, res) => {
  try {
    const { id, action } = req.body; // Expecting { id, action: "approve" or "reject" }

    let pendingLawyers = JSON.parse(fs.readFileSync(pendingFilePath, "utf8"));
    let approvedLawyers = JSON.parse(fs.readFileSync(approvedFilePath, "utf8"));

    const lawyerIndex = pendingLawyers.findIndex((lawyer) => lawyer.id === id);

    if (lawyerIndex === -1) {
      return res.status(404).json({ message: "Lawyer not found in pending list" });
    }

    if (action === "approve") {
      const approvedLawyer = { ...pendingLawyers[lawyerIndex], status: "approved" };
      approvedLawyers.push(approvedLawyer);
      fs.writeFileSync(approvedFilePath, JSON.stringify(approvedLawyers, null, 2), "utf8");
    }

    pendingLawyers.splice(lawyerIndex, 1);
    fs.writeFileSync(pendingFilePath, JSON.stringify(pendingLawyers, null, 2), "utf8");

    res.status(200).json({ message: `Lawyer ${action}d successfully` });
  } catch (error) {
    console.error("Error updating lawyer status:", error);
    res.status(500).json({ message: "Error processing lawyer request", error });
  }
});

export default adminRouter;






// import express from 'express';
// import fs from 'fs';
// import path from 'path';
// import dotenv from 'dotenv';
// import { fileURLToPath } from 'url';
// import axios from 'axios';

// dotenv.config();
// const adminRouter = express.Router();

// const adminCredentials = {
//   username: process.env.ADMIN_USERNAME,
//   password: process.env.ADMIN_PASSWORD,
// };

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const filePath = path.join(__dirname, '../dummyLawyers.json');

// // Function to read lawyer applications from JSON file
// const getLawyers = () => {
//   try {
//     return JSON.parse(fs.readFileSync(filePath, 'utf8')) || [];
//   } catch (error) {
//     console.error('Error fetching lawyers:', error);
//     return [];
//   }
// };

// // Function to write lawyer applications to JSON file
// const saveLawyers = (data) => {
//   try {
//     fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
//   } catch (error) {
//     console.error('Error saving lawyer applications:', error);
//   }
// };

// // Admin login route
// adminRouter.post('/loginasadmin', (req, res) => {
//   const { username, password } = req.body;

//   if (username === adminCredentials.username && password === adminCredentials.password) {
//     res.status(200).json({ message: 'Login successful' });
//   } else {
//     res.status(401).json({ message: 'Invalid credentials' });
//   }
// });

// // Route to fetch only new (pending) lawyer applications
// adminRouter.get('/lawyers', (req, res) => {
//   const lawyers = getLawyers();
  
//   // Show only "pending" lawyers (new applications)
//   const newLawyersOnly = lawyers.filter(lawyer => !lawyer.status || lawyer.status === 'pending');

//   res.status(200).json(newLawyersOnly);
// });

// // Function to send email via Web3Forms
// const sendWeb3FormEmail = async (lawyerEmail, lawyerName) => {
//   try {
//     const response = await axios.post('https://api.web3forms.com/submit', {
//       access_key: process.env.WEB3FORMS_ACCESS_KEY, // Your Web3Forms access key
//       email: lawyerEmail,
//       subject: "You're listed on our website!",
//       message: `Hello ${lawyerName},\n\nYour profile has been successfully approved and listed on our website.\n\nThank you for joining us!\n\nBest regards,\nTeam JurisTech`,
//     });

//     console.log('Email sent via Web3Forms:', response.data);
//   } catch (error) {
//     console.error('Error sending email via Web3Forms:', error.response ? error.response.data : error.message);
//   }
// };

// // Route to approve or reject lawyer application
// adminRouter.post('/approve-reject', async (req, res) => {
//   const { lawyerId, status } = req.body; 

//   if (!lawyerId || !status || (status !== 'approved' && status !== 'rejected')) {
//     return res.status(400).json({ message: 'Invalid request parameters' });
//   }

//   const lawyers = getLawyers();
//   const lawyerIndex = lawyers.findIndex(lawyer => lawyer.id === lawyerId);

//   if (lawyerIndex === -1) {
//     return res.status(404).json({ message: 'Lawyer not found' });
//   }

//   lawyers[lawyerIndex].status = status;
//   saveLawyers(lawyers);

//   // Send confirmation email only if approved
//   if (status === 'approved') {
//     const lawyer = lawyers[lawyerIndex];
//     await sendWeb3FormEmail(lawyer.email, lawyer.name);
//   }

//   res.status(200).json({ message: `Lawyer application ${status} successfully` });
// });

// export default adminRouter;





// import express from 'express';
// import fs from 'fs';
// import path from 'path';
// import dotenv from 'dotenv';
// import { fileURLToPath } from 'url';
// import nodemailer from 'nodemailer';
// dotenv.config();

// const adminRouter = express.Router();

// // Dummy admin credentials (replace with environment variables or database in production)
// const adminCredentials = {
//   username: process.env.ADMIN_USERNAME,
//   password: process.env.ADMIN_PASSWORD,
// };

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// // Path to the JSON file where lawyer applications are stored
// const filePath = path.join(__dirname, '../dummyLawyers.json');

// // Function to read lawyer applications from JSON file
// const getLawyers = () => {
//   try {
//     const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
//     return data;
//   } catch (error) {
//     console.error('Error fetching lawyers:', error);
//     return []; // Return empty array on error
//   }
// };

// // Function to write lawyer applications to JSON file
// const saveLawyers = (data) => {
//   try {
//     fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
//   } catch (error) {
//     console.error('Error saving lawyer applications:', error);
//   }
// };

// // Admin login route (assuming basic authentication for simplicity)
// adminRouter.post('/loginasadmin', (req, res) => {
//   const { username, password } = req.body;

//   if (username === adminCredentials.username && password === adminCredentials.password) {
//     res.status(200).json({ message: 'Login successful' });
//   } else {
//     res.status(401).json({ message: 'Invalid credentials' });
//   }
// });

// // Route to fetch all lawyer applications (GET request)
// adminRouter.get('/lawyers', (req, res) => {
//   const lawyers = getLawyers();
//   res.status(200).json(lawyers);
// });

// // Nodemailer transporter configuration
// const transporter = nodemailer.createTransport({
//     service: 'gmail', 
//     auth: {
//       user: process.env.EMAIL_USER, 
//       pass: process.env.EMAIL_PASS, 
//     },
//   });
  
//   // Function to send email notifications
//   const sendEmailNotification = async (to, subject, html) => {
//     try {
//       await transporter.sendMail({
//         from: process.env.EMAIL_USER,
//         to,
//         subject,
//         html,
//       });
//     } catch (error) {
//       console.error('Error sending email:', error);
//     }
//   };
  
//   // Route to approve or reject lawyer application (POST request)
//   adminRouter.post('/approve-reject', (req, res) => {
//     const { lawyerId, status } = req.body; 
  
//     if (!lawyerId || !status || (status !== 'approved' && status !== 'rejected')) {
//       return res.status(400).json({ message: 'Invalid request parameters' });
//     }
  
//     const lawyers = getLawyers();
//     const lawyerIndex = lawyers.findIndex(lawyer => lawyer.id === lawyerId);
  
//     if (lawyerIndex === -1) {
//       return res.status(404).json({ message: 'Lawyer not found' });
//     }
  
//     lawyers[lawyerIndex].status = status;
//     saveLawyers(lawyers);
  
//     // Send email notification
//     const lawyer = lawyers[lawyerIndex];
//     const notificationMessage = `<p>Hello ${lawyer.name},</p><p>Your application has been ${status} by the admin.</p>`;
//     sendEmailNotification(lawyer.email, `Your application has been ${status}`, notificationMessage);
  
//     res.status(200).json({ message: `Lawyer application ${status} successfully` });
//   });

// export default adminRouter;