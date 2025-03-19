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

  // Get backend URL from environment variables
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

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
    // Clear previous errors and results
    setError(null);
    
    // Form validation
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
      
      // First try the main endpoint
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
            timeout: 30000 // 30 seconds timeout
          }
        );
        
        console.log("API Response:", response.data);
        
        // Extract the workout plan
        const workoutPlan = response.data.workoutPlan;
        
        if (!workoutPlan) {
          throw new Error("No workout plan returned from the API");
        }
        
        setResult(workoutPlan);
      } catch (mainError) {
        console.error("Main API error, trying fallback:", mainError);
        
        // If main endpoint fails, try the fallback
        const fallbackResponse = await axios.post(
          `${BACKEND_URL}/generate-workout-fallback`,
          {
            goals: formData.goals,
            level: formData.level,
            frequency: formData.frequency
          },
          {
            headers: { "Content-Type": "application/json" },
            timeout: 10000 // 10 seconds timeout for fallback
          }
        );
        
        console.log("Fallback API Response:", fallbackResponse.data);
        
        // Extract the workout plan from fallback
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

  // Clean markup from the text (remove ** markers)
  const cleanTextMarkup = (text) => {
    if (!text) return "";
    return text.replace(/\*\*/g, '');
  };
  
  // Format workout plan with proper tables and sections
  const formatWorkoutPlan = (text) => {
    if (!text) return null;

    // Clean up the text to remove asterisks
    const cleanedText = cleanTextMarkup(text);
    
    // Split the text into sections
    const sections = cleanedText.split(/\n\n+/);
    
    return (
      <div className="space-y-6">
        {sections.map((section, sectionIndex) => {
          // Handle section titles
          if (section.includes("Workout Plan") || section.includes("Personalized") || section.toLowerCase().includes("day")) {
            return (
              <div key={sectionIndex} className="mt-6">
                <h3 className="text-xl font-bold text-blue-800 border-b-2 border-blue-500 pb-2 mb-3">
                  {section.replace(/^\s*#*\s*|\s*#*\s*$/g, '')}
                </h3>
              </div>
            );
          }
          
          // Handle Warm-up and Cool-down sections
          else if (section.toLowerCase().includes("warm-up") || section.toLowerCase().includes("cool-down")) {
            return (
              <div key={sectionIndex} className="bg-blue-50 p-4 rounded-lg shadow-sm mb-4">
                <h4 className="font-semibold text-blue-700 mb-2">
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
          }

          // Detect and format tables
          else if (section.includes("| Exercise |") || section.includes("| Sets |") || 
                   section.includes("| Reps |") || section.includes("| Duration |")) {
            
            try {
              // Identify the table headers
              const headerLine = section.split('\n').find(line => line.includes("| Exercise |") || 
                                                                 line.includes("| Duration |"));
              
              if (headerLine) {
                const headers = headerLine.split('|')
                  .map(h => h.trim())
                  .filter(h => h !== '');
                
                // Extract table rows - find all lines with | characters
                const tableRows = section.split('\n')
                  .filter(line => line.includes('|') && line !== headerLine && !line.includes('---'))
                  .map(line => line.split('|')
                    .map(cell => cell.trim())
                    .filter(cell => cell !== '')
                  );
                
                // Create a formatted table
                return (
                  <div key={sectionIndex} className="my-6 overflow-x-auto">
                    <table className="min-w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-blue-700 text-white">
                          {headers.map((header, i) => (
                            <th key={i} className="py-2 px-4 text-left border border-blue-600">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tableRows.map((row, rowIndex) => (
                          <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
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
              // Fallback if table parsing fails
              return (
                <div key={sectionIndex} className="bg-white p-4 rounded-lg border border-gray-200 my-4">
                  <pre className="whitespace-pre-wrap text-sm">{section}</pre>
                </div>
              );
            }
          }
          
          // Handle exercise descriptions
          else if (section.toLowerCase().includes("exercise") || 
                   section.toLowerCase().includes("duration") || 
                   section.toLowerCase().includes("sets") || 
                   section.toLowerCase().includes("reps")) {
            
            // Check if it has bullet points
            if (section.includes("•") || section.includes("-") || section.includes("*")) {
              return (
                <div key={sectionIndex} className="bg-white p-4 rounded-lg shadow-sm mb-4">
                  <ul className="list-disc pl-8 space-y-2">
                    {section.split('\n').map((line, i) => 
                      line.trim() && (
                        <li key={i} className="text-gray-700">
                          {line.replace(/^\s*•\s*|\s*•\s*$|^\s*-\s*|\s*-\s*$|^\s*\*\s*|\s*\*\s*$/g, '')}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              );
            } else {
              return (
                <div key={sectionIndex} className="bg-white p-4 rounded-lg shadow-sm mb-4">
                  {section.split('\n').map((line, i) => (
                    <p key={i} className="mb-2">{line}</p>
                  ))}
                </div>
              );
            }
          }
          
          // Default formatting for other sections
          else {
            return (
              <div key={sectionIndex} className="bg-white p-4 rounded-lg shadow-sm mb-4">
                {section.split('\n').map((line, lineIndex) => {
                  // Check for bullet points
                  if (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')) {
                    return (
                      <div key={lineIndex} className="flex ml-2 mb-2">
                        <span className="mr-2">•</span>
                        <span>{line.replace(/^\s*•\s*|\s*•\s*$|^\s*-\s*|\s*-\s*$|^\s*\*\s*|\s*\*\s*$/g, '')}</span>
                      </div>
                    );
                  }
                  
                  // Handle labeled lines with colons
                  if (line.includes(':') && !line.includes('|')) {
                    const [label, ...rest] = line.split(':');
                    const value = rest.join(':');
                    return (
                      <div key={lineIndex} className="mb-2">
                        <span className="font-semibold">{label.trim()}:</span>
                        <span className="ml-2">{value.trim()}</span>
                      </div>
                    );
                  }
                  
                  // Default line formatting
                  return <p key={lineIndex} className="mb-2">{line}</p>;
                })}
              </div>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-b from-blue-600 to-blue-800 min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {!result ? (
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-center text-blue-800 mb-6">Let AI Create Your Personalized Workout Plan</h2>
            
            {/* Error display */}
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
                  <label key={goal} className="flex items-center bg-blue-50 p-3 rounded-lg transition-all hover:bg-blue-100 cursor-pointer">
                    <input
                      type="checkbox"
                      value={goal}
                      onChange={handleCheckboxChange}
                      checked={formData.goals.includes(goal)}
                      className="w-5 h-5 mr-3 accent-blue-600"
                    />
                    <span>{goal}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="font-semibold text-lg mb-3">Your current fitness level:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {["Beginner", "Medium level", "Advanced"].map((level) => (
                  <label key={level} className="flex items-center bg-blue-50 p-3 rounded-lg transition-all hover:bg-blue-100 cursor-pointer">
                    <input
                      type="radio"
                      name="level"
                      value={level}
                      onChange={handleRadioChange}
                      checked={formData.level === level}
                      className="w-5 h-5 mr-3 accent-blue-600"
                    />
                    <span>{level}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <p className="font-semibold text-lg mb-3">Weekly gym frequency:</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {["1 day", "2 days", "3 days", "4 days"].map((freq) => (
                  <label key={freq} className="flex items-center bg-blue-50 p-3 rounded-lg transition-all hover:bg-blue-100 cursor-pointer">
                    <input
                      type="radio"
                      name="frequency"
                      value={freq}
                      onChange={handleRadioChange}
                      checked={formData.frequency === freq}
                      className="w-5 h-5 mr-3 accent-blue-600"
                    />
                    <span>{freq}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold py-3 px-6 rounded-lg transition-all hover:from-blue-700 hover:to-blue-900 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Your Personalized Workout Plan...
                </div>
              ) : (
                "Generate My Workout Plan"
              )}
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="bg-blue-800 text-white p-6">
              <h2 className="text-2xl font-bold text-center">Your Personalized Workout Plan</h2>
              <p className="text-center text-blue-200 mt-2">Based on your fitness goals and preferences</p>
            </div>
            
            <div className="p-6">
              {formatWorkoutPlan(result)}
              
              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => window.print()}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded-lg transition-colors shadow-sm"
                >
                  Print Plan
                </button>
                
                <button
                  onClick={() => setResult(null)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors shadow"
                >
                  Create Another Plan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PTBetaPage;