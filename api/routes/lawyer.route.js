// import express from 'express';
// import lawyers from "../models/lawyer.model";

// lawrouter.get("/lawyers", async (req, res) => {
//   try {
//     const { query } = req.query;

//     let lawyers;

//     if (query) {
//       // Case-insensitive search in speciality array
//       lawyers = await lawyers.find({
//         speciality: { $regex: new RegExp(query, "i") }
//       });
//     } else {
//       lawyers = await lawyers.find();
//     }

//     res.status(200).json(lawyers);
//   } catch (error) {
//     console.error("Error fetching lawyers:", error);
//     res.status(500).json({ message: "Error fetching lawyers from DB", error });
//   }
// });


import express from "express";
import fs from "fs"; 
import path from "path"; 
import { fileURLToPath } from "url"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const lawrouter = express.Router();


const filePath = path.join(__dirname, "../dummyLawyers.json");

lawrouter.get("/lawyers", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8")); 
    const { query } = req.query; 

   
    if (!query) {
      return res.status(200).json(data);
    }

    
    const filteredData = data.filter(lawyer => {
      return lawyer.speciality.some(spec =>
        spec.toLowerCase().includes(query.toLowerCase())
      );
    });

    res.status(200).json(filteredData); 
  } catch (error) {
    console.error("Error fetching lawyers:", error);
    res.status(500).json({ message: "Error fetching dummy lawyers data", error });
  }
});

// Route to register a new lawyer (POST request)
lawrouter.post("/register", (req, res) => {
  try {
    const { name, contact, speciality, description } = req.body;

    // Validate input data
    if (!name || !contact || !speciality || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Ensure speciality is an array
    if (!Array.isArray(speciality)) {
      return res.status(400).json({ message: "Speciality must be an array" });
    }

    // Read the existing data
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // Create a new lawyer object
    const newLawyer = {
      id: Date.now(),
      name,
      contact,
      speciality,
      description,
    };

    // Add the new lawyer to the array
    data.push(newLawyer);

    // Write the updated data back to the file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");

    // Respond with success
    res.status(201).json({ message: "Lawyer registered successfully", lawyer: newLawyer });
  } catch (error) {
    console.error("Error adding lawyer:", error);
    res.status(500).json({ message: "Error adding lawyer to the database", error });
  }
});

export default lawrouter;
