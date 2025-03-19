import { useState, useEffect } from "react";
import axios from "axios";
import "./NowPage.css";

const NowPage = () => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [showForecast, setShowForecast] = useState(false);
  const [occupancyData, setOccupancyData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  // Categories for display
  const categories = [
    { label: "Muscle Fitness", current: 0, total: 34 },
    { label: "Aerobic", current: 0, total: 9 },
    { label: "Functional", current: 0, total: 2 },
    { label: "Not On Devices", current: 0 }
  ];

  // Fetch occupancy data from backend
  const fetchOccupancyData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/occupancy', {
        timeout: 10000, // 10 second timeout
      });
      
      if (response.data && Array.isArray(response.data)) {
        // Sort by timestamp to get the latest data
        const sortedData = [...response.data].sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        setOccupancyData(sortedData[0]); // Get the most recent reading
        setError(null);
        setRetryCount(0);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (error) {
      console.error('Error fetching occupancy data:', error);
      setError(`Failed to connect to the server. Please try again later.`);
      
      // Increment retry count for exponential backoff
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  // Retry with exponential backoff if there's an error
  useEffect(() => {
    if (error && retryCount > 0) {
      const backoffTime = Math.min(2000 * Math.pow(2, retryCount - 1), 30000); // Max 30s
      const timeoutId = setTimeout(fetchOccupancyData, backoffTime);
      
      return () => clearTimeout(timeoutId);
    }
  }, [error, retryCount]);

  // Initial data fetch and polling setup
  useEffect(() => {
    fetchOccupancyData();
    
    // Set up polling interval - every 30 seconds
    const intervalId = setInterval(fetchOccupancyData, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Handle rating clicks
  const handleRatingClick = (index) => {
    setSelectedRating(index + 1);
  };

  // Handle card clicks
  const handleCardClick = (category) => {
    alert(`You clicked on ${category}`);
  };

  // Toggle forecast modal
  const handleForecastClick = () => {
    setShowForecast(true);
  };

  const handleCloseForecast = () => {
    setShowForecast(false);
  };

  // Forecast data based on current occupancy
  const generateForecastData = () => {
    const currentValue = occupancyData?.value || 13;
    
    return [
      { time: "Now", people: currentValue },
      { time: "1 Hour +", people: Math.max(5, Math.floor(currentValue * (1 + Math.random() * 0.3))) },
      { time: "2 Hours +", people: Math.max(5, Math.floor(currentValue * (1 + Math.random() * 0.4))) },
      { time: "3 Hours +", people: Math.max(5, Math.floor(currentValue * (0.8 + Math.random() * 0.3))) },
      { time: "4 Hours +", people: Math.max(5, Math.floor(currentValue * (0.6 + Math.random() * 0.3))) },
    ];
  };

  // Dynamic categories adjusted by occupancy data
  const getAdjustedCategories = () => {
    if (!occupancyData) return categories;
    
    const totalPeople = occupancyData.value || 13;
    const adjustedCategories = [...categories];
    
    // Distribute people across categories using a weighted approach
    let peoplePlaced = 0;
    
    // 60% in Muscle Fitness
    adjustedCategories[0].current = Math.floor(totalPeople * 0.6);
    peoplePlaced += adjustedCategories[0].current;
    
    // 20% in Aerobic
    adjustedCategories[1].current = Math.floor(totalPeople * 0.2);
    peoplePlaced += adjustedCategories[1].current;
    
    // 5% in Functional
    adjustedCategories[2].current = Math.floor(totalPeople * 0.05);
    peoplePlaced += adjustedCategories[2].current;
    
    // Remaining in Not On Devices
    adjustedCategories[3].current = totalPeople - peoplePlaced;
    
    return adjustedCategories;
  };

  // Get adjusted categories with real data factored in
  const adjustedCategories = getAdjustedCategories();
  // Generate forecast data
  const forecastData = generateForecastData();

  return (
    <div className="bg-gradient-to-b from-blue-700 to-blue-900 rounded-2xl shadow-2xl p-8 text-white max-w-lg mx-auto lg:max-w-2xl transition-all duration-300">
      {/* Blinking Light with Text */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="blinking-light animate-pulse w-4 h-4 bg-red-500 rounded-full shadow-lg"></div>
        <h2 className="text-3xl font-extrabold tracking-wide">
          🏋️ {occupancyData ? occupancyData.value : '...'} people in the gym
        </h2>
      </div>

      {/* Loading or Error States */}
      {loading && !occupancyData && (
        <div className="text-center p-4 mb-4 bg-blue-600 bg-opacity-50 rounded-lg">
          <p>Loading gym occupancy data...</p>
        </div>
      )}

      {error && (
        <div className="text-center p-4 mb-4 bg-red-500 bg-opacity-50 rounded-lg">
          <p>{error}</p>
          <button 
            onClick={fetchOccupancyData}
            className="mt-2 px-4 py-2 bg-white text-red-600 rounded-lg font-semibold hover:bg-red-100 transition"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Gym Stats */}
      <div className="grid grid-cols-2 gap-6 text-center">
        {adjustedCategories.map((item, index) => (
          <button
            key={index}
            className="bg-white bg-opacity-10 p-5 rounded-lg shadow-lg focus:outline-none hover:bg-opacity-30 transition duration-300 transform hover:scale-105"
            onClick={() => handleCardClick(item.label)}
          >
            <p className="text-3xl font-bold">
              {item.total ? `${item.current} / ${item.total}` : item.current}
            </p>
            <p className="text-sm mt-1 font-medium">{item.label}</p>
          </button>
        ))}
      </div>

      {/* Footer Section */}
      <p className="text-center mt-8 text-sm opacity-70 font-light italic">Powered By IoT</p>
      <div className="text-center my-6">
        <p className="text-lg mb-3 font-semibold">How well does the gym equipment support your training?</p>
        <div className="flex justify-center mt-2 space-x-2">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <button
                key={index}
                className={`w-10 h-10 rounded-full cursor-pointer transition duration-300 transform hover:scale-110 ${
                  selectedRating > index ? "bg-yellow-400 shadow-lg" : "bg-white bg-opacity-20"
                }`}
                onClick={() => handleRatingClick(index)}
              >
                ⭐
              </button>
            ))}
        </div>
      </div>

      {/* Last Update Timestamp */}
      {occupancyData && (
        <p className="text-center text-xs opacity-70 mb-3">
          Last updated: {new Date(occupancyData.timestamp).toLocaleTimeString()}
        </p>
      )}

      {/* Forecast Button */}
      <button
        className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-4 rounded-xl mt-6 shadow-lg transition duration-300 transform hover:scale-105"
        onClick={handleForecastClick}
      >
        🔮 See the forecast for the next few hours
      </button>

      {/* Forecast Modal */}
      {showForecast && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
          <div className="bg-white text-gray-900 rounded-lg shadow-xl p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-center mb-4">📊 Gym Occupancy Forecast</h2>
            <ul className="space-y-3">
              {forecastData.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between bg-gray-100 p-3 rounded-lg shadow-md text-lg font-semibold"
                >
                  <span>{item.time}</span>
                  <span>👥 {item.people} people</span>
                </li>
              ))}
            </ul>
            <button
              className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg mt-4 hover:bg-blue-700 transition duration-300"
              onClick={handleCloseForecast}
            >
              ❌ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NowPage;