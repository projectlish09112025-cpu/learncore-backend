// server.js
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// 🔹 All model names in one place
const MODELS = {
  tutor: "gpt-4o-mini",          // main brain for tutor / feedback
  speakingTranscribe: "whisper-1" // for future speaking features
};

// OpenAI client – uses your key from Render env vars
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ✅ Health check route
app.get("/", (req, res) => {
  res.json({ status: "LearnCore Backend is LIVE" });
});

// ✅ Test OpenAI connection – shows list of models
app.get("/test-openai", async (req, res) => {
  try {
    const models = await openai.models.list();
    res.json(models.data.map(m => m.id));
  } catch (error) {
    console.error("Error in /test-openai:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Simple AI route using URL ?q=...
// Example:
// https://YOUR-APP.onrender.com/ask?q=Give feedback on this PTE essay...
app.get("/ask", async (req, res) => {
  try {
    const userMessage =
      req.query.q || "Please give general PTE study advice.";

    const completion = await openai.chat.completions.create({
      model: MODELS.tutor,
      messages: [
        { role: "user", content: userMessage }
      ]
    });

    const reply = completion.choices[0].message.content;
    res.json({ success: true, reply });
  } catch (error) {
    console.error("Error in /ask:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🔚 Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
