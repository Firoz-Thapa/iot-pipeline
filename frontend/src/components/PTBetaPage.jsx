import { useState } from "react";

const PTBetaPage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    goals: [],
    level: "",
    frequency: "",
  });

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      goals: checked
        ? [...prev.goals, value]
        : prev.goals.filter((goal) => goal !== value),
    }));
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    setLoading(true);

    setTimeout(() => {
      // Generate workout plan dynamically
      const generatedPlan = generateWorkoutPlan(formData);
      setResult(generatedPlan);
      setLoading(false);
    }, 2000); // Simulate server delay
  };

  const generateWorkoutPlan = ({ goals, level, frequency }) => {
    // Define generic exercises
    const exercises = {
      cardio: "Treadmill: 10 minutes",
      strength: [
        "Leg press: 3 sets x 12 reps",
        "Chest press: 3 sets x 12 reps",
        "Dumbbell bicep curl: 3 sets x 15 reps",
      ],
      flexibility: "Dynamic stretches: 5 minutes",
      warmup: "Exercise bike: 5 minutes",
    };

    // Define intensity based on level
    const intensity = {
      Beginner: "Low intensity",
      "Medium level": "Moderate intensity",
      Advanced: "High intensity",
    };

    // Adjust frequency (days per week)
    const daysPerWeek = parseInt(frequency.split(" ")[0]);

    // Create workout plan
    const program = {
      title: "YOUR TRAINING PROGRAM",
      description: `This program is tailored for your goals: ${goals.join(
        ", "
      )}. It focuses on ${intensity[level]} training with ${daysPerWeek} sessions per week.`,
      days: Array.from({ length: daysPerWeek }, (_, i) => ({
        title: `Day ${i + 1}`,
        activities: [
          { type: "Warm-up and mobility", details: exercises.warmup },
          { type: "Cardio", details: exercises.cardio },
          ...exercises.strength.map((exercise) => ({
            type: "Strength training",
            details: exercise,
          })),
          { type: "Flexibility training", details: exercises.flexibility },
        ],
      })),
    };

    return program;
  };

  const handleDownload = () => {
    alert("Downloading your training program as a PDF...");
    // Placeholder for real PDF generation logic
  };

  return (
    <div className="bg-blue-600 min-h-screen flex items-center justify-center text-white p-6">
      <div className="bg-white text-gray-900 rounded-lg shadow-lg p-6 max-w-lg w-full">
        {!result ? (
          <>
            <h2 className="text-xl font-bold mb-4">Let Artificial Intelligence Create a Workout Program for You!</h2>
            <div className="mb-4">
              <p className="font-semibold">What are your goals for gym training?</p>
              <div className="mt-2 space-y-2">
                {["Weight loss", "Muscle mass", "Constitution", "Resistance"].map((goal) => (
                  <label key={goal} className="flex items-center">
                    <input
                      type="checkbox"
                      value={goal}
                      onChange={handleCheckboxChange}
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
            >
              Create My Program
            </button>
          </>
        ) : loading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-50 mb-4"></div>
            <p>Understanding your goals...</p>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold mb-4">{result.title}</h2>
            <p className="mb-4">{result.description}</p>
            {result.days.map((day, index) => (
              <div key={index} className="mb-4">
                <h3 className="font-semibold">{day.title}</h3>
                <ul className="list-disc ml-5 mt-2">
                  {day.activities.map((activity, idx) => (
                    <li key={idx}>
                      <strong>{activity.type}:</strong> {activity.details}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <button
              onClick={handleDownload}
              className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition mb-4"
            >
              Download PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PTBetaPage;