import { Schema, model } from 'mongoose';

const lawyerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
   // required: true,
  },
  speciality: {
    type: [String], // Array of strings
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  }
});

export default model('Lawyers', lawyerSchema);
