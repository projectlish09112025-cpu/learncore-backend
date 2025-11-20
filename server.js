// server.js
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// OpenAI client (uses your OPENAI_API_KEY from Render env vars)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Root route – health check
app.get("/", (req, res) => {
  res.json({ status: "LearnCore Backend is LIVE" });
});

// Test OpenAI connection – lists model IDs
app.get("/test-openai", async (req, res) => {
  try {
    const models = await openai.models.list();
    res.json(models.data.map(m => m.id));
  } catch (error) {
    console.error("Error in /test-openai:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Simple AI reply – GET /ask
app.get("/ask", async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini", // or "gpt-4o-mini" if you prefer
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
