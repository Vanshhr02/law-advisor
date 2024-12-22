// import express from "express";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// // Get the directory name (since __dirname is not available in ES modules)
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const lawrouter = express.Router();

// // Path to the dummy JSON file
// const filePath = path.join(__dirname, "../dummyLawyers.json");

// // Route to fetch dummy lawyers data
// lawrouter.get("/lawyers", (req, res) => {
//   try {
//     const data = JSON.parse(fs.readFileSync(filePath, "utf8")); // Read the file
//     res.status(200).json(data); // Send the data
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching dummy lawyers data", error });
//   }
// });

// // Route to add a new lawyer to the dummy JSON file
// lawrouter.post("/lawyers/register", (req, res) => {
//   try {
//     const { name, contact, specialty, description } = req.body;

//     // Validation: Check for required fields
//     if (!name || !contact || !specialty || !description) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Read the existing data
//     const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

//     // Create a new lawyer object
//     const newLawyer = {
//       id: Date.now(), // Unique ID
//       name,
//       contact,
//       specialty,
//       description,
//     };

//     // Add the new lawyer to the array
//     data.push(newLawyer);

//     // Write the updated data back to the file
//     fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");

//     // Respond with success
//     res.status(201).json({ message: "Lawyer registered successfully", lawyer: newLawyer });
//   } catch (error) {
//     res.status(500).json({ message: "Error adding lawyer to the database", error });
//   }
// });

// export default lawrouter;
import express from "express";
import fs from "fs"; // For reading/writing files
import path from "path"; // For handling file paths
import { fileURLToPath } from "url"; // To recreate __dirname for ES modules

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const lawrouter = express.Router();

// Path to the dummy JSON file
const filePath = path.join(__dirname, "../dummyLawyers.json");

// Route to fetch dummy lawyers data (GET request)
lawrouter.get("/lawyers", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8")); // Read the file
    res.status(200).json(data); // Send the data
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
