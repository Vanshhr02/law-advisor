// import OpenAI from "openai";
// import dotenv from "dotenv";

// dotenv.config();
// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// export const analyzeText = async (req, res) => {
//   const { text } = req.body;
//   if (!text) return res.status(400).json({ error: "❌ No text provided!" });

//   try {
//     const aiResponse = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         { role: "system", content: "You are an AI that explains any text in detail." },
//         { role: "user", content: `Explain this in detail this is legal document summary explain it in simple words:\n\n"${text}"` }
//       ],
//       temperature: 0.5,
//     });

//     res.json({ analysis: aiResponse.choices[0].message.content });

//   } catch (error) {
//     console.error("❌ Error:", error);
//     res.status(500).json({ error: "Failed to analyze text." });
//   }
// };

import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const analyzeText = async (req, res) => {
  try {
    const { legalText, userQuery } = req.body;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      You are a legal AI assistant. Analyze the following legal document.
      
      **User Query:** ${userQuery}
      
      **Instructions:**
      - Identify legal obligations and rights.
      - Summarize key legal points.
      - Explain in simple terms.
      - Highlight potential risks or unusual clauses.
      
      **Legal Document:**
      ${legalText}
    `;

    const result = await model.generateContent(prompt);
    
    const responseText = result?.response?.text?.();
    
    if (!responseText) {
      return res.status(500).json({ error: "AI did not return any analysis!" });
    }

    console.log("Generated Legal Analysis:", responseText);
    res.status(200).json({ analysis: responseText });

  } catch (error) {
    console.error("Error analyzing legal text:", error);
    res.status(500).json({ error: "Something went wrong!" });
  }
};
