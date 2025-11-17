import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get("/", (req, res) => {
  res.send("✅ LearnCore backend is live!");
});

app.get("/test-openai", async (req, res) => {
  try {
    const models = await client.models.list();
    res.json(models.data.map(m => m.id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/ask", async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: "Hello backend!" }]
    });

    res.json(completion.choices[0].message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(process.env.PORT || 3000, () =>
  console.log("Server running on port", process.env.PORT || 3000)
);

