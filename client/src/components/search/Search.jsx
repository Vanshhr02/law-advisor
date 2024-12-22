import React, { useState } from "react";
import "./Search.scss";
import newRequest from "../../utils/newRequest"; 

const Search = () => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSearch = async () => {
    if (input.trim()) {
      try {
        const response = await newRequest.get(`/lawyers?query=${input}`);
        setResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }
  };

  const handleCardClick = (lawyer) => {
    setSelectedLawyer(lawyer); 
    setShowModal(true); 
  };

  const closeModal = () => {
    setSelectedLawyer(null);
    setShowModal(false);
  };

  return (
    <div className="search">
      <div className="searchBar">
        <input
          type="text"
          placeholder="Search for a lawyer (e.g., Criminal)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="results">
        {results.length > 0 ? (
          results.map((lawyer) => (
            <div
              className="card"
              key={lawyer.id}
              onClick={() => handleCardClick(lawyer)} 
            >
              <div className="cardHeader">
                <h3>{lawyer.name}</h3>
                <p>{lawyer.location}</p>
              </div>
              <div className="cardBody">
                <p><strong>Speciality:</strong> {lawyer.speciality.join(", ")}</p>
                <p><strong>Rating:</strong> {lawyer.rating}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="noResults">No results found. Try another search.</p>
        )}
      </div>

      {/* Modal for showing complete details */}
      {showModal && selectedLawyer && (
        <div className="modal" onClick={closeModal}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <button className="closeButton" onClick={closeModal}>
              &times;
            </button>
            <h2>{selectedLawyer.name}</h2>
            <p><strong>Location:</strong> {selectedLawyer.location}</p>
            <p><strong>Speciality:</strong> {selectedLawyer.speciality.join(", ")}</p>
            <p><strong>Rating:</strong> {selectedLawyer.rating}</p>
            <p><strong>Contact:</strong> {selectedLawyer.contact}</p>
            <p><strong>Description:</strong> {selectedLawyer.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
