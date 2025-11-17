import express from "express";
import OpenAI from "openai";

const app = express();
const port = process.env.PORT || 3000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("LearnCore Backend Running ⚡");
});

app.get("/ask", async (req, res) => {
  try {
    const completion = await client.responses.create({
      model: "gpt-4o-mini",
      input: "Hello backend!",
    });

    res.json({
      success: true,
      reply: completion.output[0].content[0].text,
    });

  } catch (error) {
    res.json({ error: error.message });
  }
});

app.listen(port, () => console.log(`🚀 Server running on ${port}`));
