import React, { useState, useEffect } from "react";
import "./Featured.scss";
//import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate


function Featured() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const navigate = useNavigate(); 
  // Handle search
  const handleSearch = () => {
    if (input.trim()) {
      console.log(input);  
      navigate(`/search?query=${encodeURIComponent(input)}`);
        //console.log(input);
    }
};
  return (
    <div className="featured">
      <div className="container">
        <div className="left">
          <h1>
            Find the perfect <span>Lawyer</span> for your Cases
          </h1>
          <div className="search">
            <div className="searchInput">
              <img src="./img/search.png" alt="Search Icon" />
              <input
                type="text"
                placeholder='Try "Criminal"'
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
            
            <button onClick={handleSearch}>Search</button>
          </div>
          
        </div>
        <div className="right">
          <img src="./img/men.png" alt="Man" />
        </div>
      </div>
    </div>
  );
}

export default Featured;
