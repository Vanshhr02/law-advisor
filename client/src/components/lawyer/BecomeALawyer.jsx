import React, { useState } from "react";
import newRequest from "../../utils/newRequest";
import "./BecomeALawyer.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function BecomeALawyer() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    speciality: "",
    description: "",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formattedData = {
      ...formData,
      speciality: formData.speciality.split(",").map((item) => item.trim()),
    };
  
    try {
      // Call the backend endpoint
      await newRequest.post("/adminRouter/approve-reject", formattedData);
  
      setSuccess(true);
      setFormData({
        name: "",
        contact: "",
        speciality: "",
        description: "",
      });
  
      toast.success("Form submitted successfully! A confirmation email has been sent.", {
        position: "top-center",
        autoClose: 3000,
      });
    } catch (err) {
      setError("Failed to submit the form. Please try again.");
      setSuccess(false);
  
      toast.error(error, {
        position: "top-center",
        autoClose: 3000,
      });
    }
  
  };
  
  

  return (
    <div className="become-a-lawyer">
      <ToastContainer />
      <h1>Become a Lawyer</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact Number"
          value={formData.contact}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="speciality"
          placeholder="Specialities (e.g., Labor, Immigration)"
          value={formData.speciality}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default BecomeALawyer;
