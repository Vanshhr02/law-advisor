import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./db/connect.js";
import Lawyers from "./models/lawyer.model.js";
import fs from "fs";

// Load env variables
dotenv.config();

// Read JSON data from file
const lawyersData = JSON.parse(fs.readFileSync("./dummyLawyers.json", "utf-8"));

const importData = async () => {
  try {
    await connectDB();

    // Optional: clear existing lawyers
   // await Lawyers.deleteMany();
   
    // Remove `id` field from each lawyer object here:
   // const cleanedData = lawyersData.map(({ id, ...rest }) => rest);

   // await Lawyers.insertMany(cleanedData);
    // Insert new data
    await Lawyers.insertMany(lawyersData);

    console.log("✅ Data successfully imported!");
    process.exit();
  } catch (error) {
    console.error("❌ Error inserting data:", error);
    process.exit(1);
  }
};

importData();
