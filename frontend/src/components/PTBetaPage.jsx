import { useState } from "react";
import axios from "axios";

const PTBetaPage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    goals: [],
    level: "",
    frequency: "",
  });

  // Retrieve API Key from .env file
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  // Handle checkbox selections for training goals
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      goals: checked
        ? [...prev.goals, value]
        : prev.goals.filter((goal) => goal !== value),
    }));
  };

  // Handle radio button selections for level and frequency
  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Generate AI-powered workout plan
  const handleSubmit = async () => {
    if (!API_KEY) {
      alert("Missing API Key! Ensure it's set in your .env file.");
      return;
    }

    if (formData.goals.length === 0 || !formData.level || !formData.frequency) {
      alert("Please complete all fields before generating your workout plan.");
      return;
    }

    setLoading(true);
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
                  - Goals: ${formData.goals.join(", ")}
                  - Fitness Level: ${formData.level}
                  - Frequency: ${formData.frequency} per week
                  Provide structured exercises, duration, and warm-up/cool-down tips.`
                }
              ]
            }
          ]
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("API Response:", response.data);

      // Extract the AI-generated text safely
      const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "AI response unavailable.";
      setResult(aiResponse);
    } catch (error) {
      console.error("Error fetching AI-generated workout plan:", error);
      alert("Failed to fetch the workout plan. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-blue-600 min-h-screen flex items-center justify-center text-white p-6">
      <div className="bg-white text-gray-900 rounded-lg shadow-lg p-6 max-w-lg w-full">
        {!result ? (
          <>
            <h2 className="text-xl font-bold mb-4">Let AI Create Your Workout Plan!</h2>
            <div className="mb-4">
              <p className="font-semibold">What are your goals for gym training?</p>
              <div className="mt-2 space-y-2">
                {["Weight loss", "Muscle mass", "Constitution", "Resistance"].map((goal) => (
                  <label key={goal} className="flex items-center">
                    <input
                      type="checkbox"
                      value={goal}
                      onChange={handleCheckboxChange}
                      checked={formData.goals.includes(goal)}
                      className="mr-2"
                    />
                    {goal}
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="font-semibold">Your current level?</p>
              <div className="mt-2 space-y-2">
                {["Beginner", "Medium level", "Advanced"].map((level) => (
                  <label key={level} className="flex items-center">
                    <input
                      type="radio"
                      name="level"
                      value={level}
                      onChange={handleRadioChange}
                      checked={formData.level === level}
                      className="mr-2"
                    />
                    {level}
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="font-semibold">How often do you go to the gym a week?</p>
              <div className="mt-2 space-y-2">
                {["1 day", "2 days", "3 days", "4 days"].map((freq) => (
                  <label key={freq} className="flex items-center">
                    <input
                      type="radio"
                      name="frequency"
                      value={freq}
                      onChange={handleRadioChange}
                      checked={formData.frequency === freq}
                      className="mr-2"
                    />
                    {freq}
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? "Generating..." : "Create My Program"}
            </button>
          </>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-4">Your Personalized AI Workout Plan</h2>
            <p className="mb-4 whitespace-pre-line">{result}</p>
            <button
              onClick={() => setResult(null)}
              className="w-full bg-gray-600 text-white font-semibold py-2 rounded hover:bg-gray-700 transition"
            >
              Generate Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PTBetaPage;
