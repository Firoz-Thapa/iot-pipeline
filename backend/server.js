require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.GEMINI_API_KEY;

app.use(cors());
app.use(express.json());

// Route to generate AI workout plans
app.post("/generate-workout", async (req, res) => {
  const { goals, level, frequency } = req.body;

  if (!goals || !level || !frequency) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Create a personalized workout plan based on:
                - Goals: ${goals.join(", ")}
                - Fitness Level: ${level}
                - Frequency: ${frequency} per week
                Provide structured exercises, duration, and warm-up/cool-down tips.`
              }
            ]
          }
        ]
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "AI response unavailable.";
    res.json({ workoutPlan: aiResponse });
  } catch (error) {
    console.error("Error fetching AI-generated workout plan:", error);
    res.status(500).json({ error: "Failed to generate workout plan" });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
