// server.js
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 🔹 Central place for all model names
const MODELS = {
  tutor: "gpt-4o-mini",
  feedback: "gpt-4o-mini",
  speakingTranscribe: "whisper-1", // for future speaking features
};

// OpenAI client – uses your key from Render env vars
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Health check route
app.get("/", (req, res) => {
  res.json({ status: "LearnCore Backend is LIVE" });
});

// Test OpenAI connection – shows list of models
app.get("/test-openai", async (req, res) => {
  try {
    const models = await openai.models.list();
    res.json(models.data.map(m => m.id));
  } catch (error) {
    console.error("Error in /test-openai:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Simple AI tutor reply – uses MODELS.tutor
app.get("/ask", async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      model: MODELS.tutor,
      messages: [
        { role: "user", content: "Hello from LearnCore backend!" }
      ],
    });

    const reply = completion.choices[0].message.content;
    res.json({ success: true, reply });
  } catch (error) {
    console.error("Error in /ask:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
