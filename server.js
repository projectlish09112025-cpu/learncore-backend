import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

// Load OpenAI key from Render Environment Variables
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// === TEST ROUTE ===
app.get("/", (req, res) => {
  res.json({ status: "LearnCore Backend is LIVE" });
});

// === REAL CHAT ROUTE ===
app.post("/ask", async (req, res) => {
  try {
    const userMessage = req.body.message || "Hello";

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: userMessage }]
    });

    const reply = completion.choices[0].message.content;
    res.json({ success: true, reply });

  } catch (error) {
    console.error("❌ OPENAI ERROR:", error);
    res.json({ success: false, error: error.message });
  }
});

// === START SERVER ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
