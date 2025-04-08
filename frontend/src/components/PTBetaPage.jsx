import { useState } from "react";
import axios from "axios";

const PTBetaPage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    goals: [],
    level: "",
    frequency: "",
  });

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

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

  const handleSubmit = async () => {
    setError(null);
    
    if (formData.goals.length === 0) {
      setError("Please select at least one fitness goal");
      return;
    }
    
    if (!formData.level) {
      setError("Please select your fitness level");
      return;
    }
    
    if (!formData.frequency) {
      setError("Please select your weekly gym frequency");
      return;
    }

    setLoading(true);
    try {
      console.log("Sending request to:", `${BACKEND_URL}/generate-workout`);
      console.log("Request data:", formData);
      
      try {
        const response = await axios.post(
          `${BACKEND_URL}/generate-workout`,
          {
            goals: formData.goals,
            level: formData.level,
            frequency: formData.frequency
          },
          {
            headers: { "Content-Type": "application/json" },
            timeout: 30000
          }
        );
        
        console.log("API Response:", response.data);
        
        const workoutPlan = response.data.workoutPlan;
        
        if (!workoutPlan) {
          throw new Error("No workout plan returned from the API");
        }
        
        setResult(workoutPlan);
      } catch (mainError) {
        console.error("Main API error, trying fallback:", mainError);

        const fallbackResponse = await axios.post(
          `${BACKEND_URL}/generate-workout-fallback`,
          {
            goals: formData.goals,
            level: formData.level,
            frequency: formData.frequency
          },
          {
            headers: { "Content-Type": "application/json" },
            timeout: 10000
          }
        );
        
        console.log("Fallback API Response:", fallbackResponse.data);
        
        const fallbackWorkoutPlan = fallbackResponse.data.workoutPlan;
        
        if (!fallbackWorkoutPlan) {
          throw new Error("No workout plan returned from the fallback API");
        }
        
        setResult(fallbackWorkoutPlan);
      }
    } catch (error) {
      console.error("Error fetching AI-generated workout plan:", error);
      
      let errorMessage = "Failed to fetch workout plan. Please try again.";
      
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        
        if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.status === 429) {
          errorMessage = "Too many requests. Please try again later.";
        } else if (error.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else {
        errorMessage = `Error: ${error.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const cleanTextMarkup = (text) => {
    if (!text) return "";
    return text.replace(/\*\*/g, '');
  };
  
  const formatWorkoutPlan = (text) => {
    if (!text) return null;

    const cleanedText = cleanTextMarkup(text);
    const sections = cleanedText.split(/\n\n+/);
    
    return (
      <div className="space-y-6">
        {sections.map((section, sectionIndex) => {
          if (section.includes("Workout Plan") || section.includes("Personalized") || section.toLowerCase().includes("day")) {
            return (
              <div key={sectionIndex} className="mt-6">
                <h3 className="text-xl font-bold text-green-800 border-b-2 border-green-500 pb-2 mb-3">
                  {section.replace(/^\s*#*\s*|\s*#*\s*$/g, '')}
                </h3>
              </div>
            );
          } else if (section.toLowerCase().includes("warm-up") || section.toLowerCase().includes("cool-down")) {
            return (
              <div key={sectionIndex} className="bg-green-50 p-4 rounded-lg shadow-sm mb-4">
                <h4 className="font-semibold text-green-700 mb-2">
                  {section.split('\n')[0].trim()}
                </h4>
                <ul className="list-disc pl-8 mt-2 space-y-2">
                  {section.split('\n').slice(1).map((line, i) => 
                    line.trim() && (
                      <li key={i} className="text-gray-700">
                        {line.replace(/^\s*•\s*|\s*•\s*$|^\s*-\s*|\s*-\s*$|^\s*\*\s*|\s*\*\s*$/g, '')}
                      </li>
                    )
                  )}
                </ul>
              </div>
            );
          } else if (section.includes("| Exercise |") || section.includes("| Sets |") || 
                   section.includes("| Reps |") || section.includes("| Duration |")) {
            
            try {
              const headerLine = section.split('\n').find(line => line.includes("| Exercise |") || 
                                                                 line.includes("| Duration |"));
              
              if (headerLine) {
                const headers = headerLine.split('|')
                  .map(h => h.trim())
                  .filter(h => h !== '');
                
                const tableRows = section.split('\n')
                  .filter(line => line.includes('|') && line !== headerLine && !line.includes('---'))
                  .map(line => line.split('|')
                    .map(cell => cell.trim())
                    .filter(cell => cell !== '')
                  );
                
                return (
                  <div key={sectionIndex} className="my-6 overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-green-700 text-white">
                          {headers.map((header, i) => (
                            <th key={i} className="py-2 px-4 text-left border border-green-600">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tableRows.map((row, rowIndex) => (
                          <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-green-50'}>
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="py-2 px-4 border border-gray-300">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              }
            } catch (error) {
              console.error("Error formatting table:", error);
              return (
                <div key={sectionIndex} className="bg-white p-4 rounded-lg border border-gray-200 my-4">
                  <pre className="whitespace-pre-wrap text-sm">{section}</pre>
                </div>
              );
            }
          }
          else {
            return (
              <div key={sectionIndex} className="bg-white p-4 rounded-lg shadow-sm mb-4">
                {section.split('\n').map((line, lineIndex) => (
                  <p key={lineIndex} className="mb-2">{line}</p>
                ))}
              </div>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-green-600 to-green-800 min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {!result ? (
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-center text-green-800 mb-6">Let AI Create Your Personalized Workout Plan</h2>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <p className="font-semibold text-lg mb-3">Select your fitness goals:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {["Weight loss", "Muscle mass", "Endurance", "Strength"].map((goal) => (
                  <label key={goal} className="flex items-center bg-green-50 p-3 rounded-lg transition-all hover:bg-green-100 cursor-pointer">
                    <input
                      type="checkbox"
                      value={goal}
                      onChange={handleCheckboxChange}
                      checked={formData.goals.includes(goal)}
                      className="w-5 h-5 mr-3 accent-green-600"
                    />
                    <span>{goal}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="font-semibold text-lg mb-3">Select your fitness level:</p>
              <div className="flex space-x-6">
                {["Beginner", "Intermediate", "Advanced"].map((level) => (
                  <label key={level} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="level"
                      value={level}
                      onChange={handleRadioChange}
                      checked={formData.level === level}
                      className="w-5 h-5 accent-green-600"
                    />
                    <span>{level}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="font-semibold text-lg mb-3">How many days per week do you plan to go to the gym?</p>
              <div className="flex space-x-6">
                {["2-3 days", "4-5 days", "6-7 days"].map((frequency) => (
                  <label key={frequency} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="frequency"
                      value={frequency}
                      onChange={handleRadioChange}
                      checked={formData.frequency === frequency}
                      className="w-5 h-5 accent-green-600"
                    />
                    <span>{frequency}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-3 bg-green-700 text-white text-lg font-semibold rounded-lg shadow-md transition-transform transform hover:scale-105"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Workout Plan"}
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-center text-green-800 mb-6">Your Personalized Workout Plan</h2>
            <div className="space-y-4">{formatWorkoutPlan(result)}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PTBetaPage;
