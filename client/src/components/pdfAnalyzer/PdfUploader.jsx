import React, { useState } from "react";
import axios from "axios";
import "./PdfUploader.scss";
import  newRequest  from "../../utils/newRequest";

const PdfUpload = () => {
  const [text, setText] = useState("");
  const [analysis, setAnalysis] = useState("");

  const handleAnalyze = async () => {
    if (!text) return alert("❌ Please enter some text!");
  
    try {
      setAnalysis("⏳ Analyzing...");
      const response = await newRequest.post("/analyze", { text });
  
      console.log("Full API Response:", response.data); // Debugging
      setAnalysis(response.data.analysis || "⚠️ No analysis received.");
    } catch (error) {
      console.error("❌ Error:", error);
      setAnalysis("❌ Failed to analyze the text.");
    }
  };
  
  

  return (
    <div className="analyzer">
      <h2>📝 AI Text Analyzer</h2>
      <textarea 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
        placeholder="Enter text to analyze..."
      />
      <button onClick={handleAnalyze}>Analyze</button>

      {analysis && (
        <div className="result">
          <h3>💡 AI Explanation:</h3>
          <p>{analysis}</p>
        </div>
      )}
    </div>
  );
};

export default PdfUpload;


// import React, { useState } from "react";
// import "./PdfUploader.scss";
// import newRequest from "../../utils/newRequest";

// const PdfUpload = () => {
//   const [legalText, setLegalText] = useState("");
//   const [userQuery, setUserQuery] = useState("");
//   const [analysis, setAnalysis] = useState("");

//   const handleAnalyze = async () => {
//     if (!legalText || !userQuery) {
//       return alert("❌ Please enter both the legal document and a question!");
//     }

//     try {
//       setAnalysis("⏳ Analyzing legal document...");
//       const response = await newRequest.post("/analyze-legal", { legalText, userQuery });

//       console.log("API Response:", response.data);
//       setAnalysis(response.data.analysis || "⚠️ No analysis received.");
//     } catch (error) {
//       console.error("❌ Error:", error);
//       setAnalysis("❌ Failed to analyze the legal text.");
//     }
//   };

//   return (
//     <div className="analyzer">
//       <h2>⚖️ Legal Document Analyzer</h2>
//       <textarea 
//         value={legalText} 
//         onChange={(e) => setLegalText(e.target.value)} 
//         placeholder="Paste legal document here..."
//       />
//       <input
//         type="text"
//         value={userQuery}
//         onChange={(e) => setUserQuery(e.target.value)}
//         placeholder="Enter your legal question..."
//       />
//       <button onClick={handleAnalyze}>Analyze</button>

//       {analysis && (
//         <div className="result">
//           <h3>📜 AI Legal Analysis:</h3>
//           <p>{analysis}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PdfUpload;
