import { useState, useEffect } from "react";
import axios from "axios";
import "./NowPage.css";

const NowPage = () => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [showForecast, setShowForecast] = useState(false);
  const [gymEntryData, setGymEntryData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [areaDistribution, setAreaDistribution] = useState([]);

  const categories = [
    { label: "Strength Zone", current: 0, total: 34 },
    { label: "Cardio Area", current: 0, total: 9 },
    { label: "CrossFit Space", current: 0, total: 2 },
    { label: "Stretching Area", current: 0 }
  ];

  const fetchGymEntryData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/gym-entries', {
        timeout: 5000,
      });
      
      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        const sortedData = [...response.data.data].sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        if (sortedData.length > 0) {
          const currentCount = sortedData[0].count;
          setGymEntryData({
            value: currentCount,
            timestamp: sortedData[0].timestamp
          });
          setAreaDistribution(generateRandomDistribution(currentCount));
        } else {
          setGymEntryData({
            value: 0,
            timestamp: new Date().toISOString()
          });
          setAreaDistribution([0, 0, 0, 0]);
        }
        
        setError(null);
        setRetryCount(0);
      } else {
        throw new Error('Invalid data format received');
      }
    } catch (error) {
      setError(`Failed to connect to the server. Please try again later.`);
      setRetryCount(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const generateRandomDistribution = (total) => {
    if (total === 0) return [0, 0, 0, 0];
    
    const weights = [
      Math.random() + 0.5,
      Math.random(),
      Math.random() * 0.7,
      Math.random()
    ];
    
    const weightSum = weights.reduce((sum, weight) => sum + weight, 0);
    
    let distribution = weights.map(weight => 
      Math.floor(total * (weight / weightSum))
    );
    
    const distributionSum = distribution.reduce((sum, count) => sum + count, 0);
    const difference = total - distributionSum;
    
    if (difference > 0) {
      for (let i = 0; i < difference; i++) {
        const randomIndex = Math.random() < 0.3 ? 2 : Math.floor(Math.random() * 4);
        distribution[randomIndex]++;
      }
    } else if (difference < 0) {
      for (let i = 0; i < Math.abs(difference); i++) {
        const availableAreas = distribution
          .map((count, index) => ({ count, index }))
          .filter(item => item.count > 0);
          
        if (availableAreas.length > 0) {
          const randomArea = availableAreas[Math.floor(Math.random() * availableAreas.length)];
          distribution[randomArea.index]--;
        }
      }
    }
    
    return distribution;
  };

  useEffect(() => {
    fetchGymEntryData();
    const intervalId = setInterval(fetchGymEntryData, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleRatingClick = (index) => {
    setSelectedRating(index + 1);
  };

  const handleCardClick = (category) => {
    alert(`You clicked on ${category}`);
  };

  const handleForecastClick = () => {
    setShowForecast(true);
  };

  const handleCloseForecast = () => {
    setShowForecast(false);
  };

  const generateForecastData = () => {
    const currentValue = gymEntryData?.value || 0;
    return [
      { time: "Now", people: currentValue },
      { time: "1 Hour +", people: Math.max(5, Math.floor(currentValue * (1 + Math.random() * 0.3))) },
      { time: "2 Hours +", people: Math.max(5, Math.floor(currentValue * (1 + Math.random() * 0.4))) },
      { time: "3 Hours +", people: Math.max(5, Math.floor(currentValue * (0.8 + Math.random() * 0.3))) },
      { time: "4 Hours +", people: Math.max(5, Math.floor(currentValue * (0.6 + Math.random() * 0.3))) },
    ];
  };

  const getAreasWithCounts = () => {
    if (!gymEntryData || areaDistribution.length === 0) {
      return categories;
    }
    return categories.map((category, index) => ({
      ...category,
      current: areaDistribution[index]
    }));
  };

  const areasWithCounts = getAreasWithCounts();
  const forecastData = generateForecastData();

  return (
    <div className="bg-gradient-to-b from-teal-700 to-teal-900 rounded-2xl shadow-lg p-8 text-gray-100 max-w-lg mx-auto lg:max-w-2xl transition-all duration-300">
      {/* Blinking Light with Text */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="blinking-light animate-pulse w-4 h-4 bg-amber-400 rounded-full shadow-lg"></div>
        <h2 className="text-3xl font-extrabold tracking-wide">
          🏋️ {gymEntryData ? gymEntryData.value : '...'} people in the gym
        </h2>
      </div>

      {/* Loading or Error States */}
      {loading && !gymEntryData && (
        <div className="text-center p-4 mb-4 bg-teal-600 bg-opacity-50 rounded-lg">
          <p>Loading gym occupancy data...</p>
        </div>
      )}

      {error && (
        <div className="text-center p-4 mb-4 bg-red-600 bg-opacity-50 rounded-lg">
          <p>{error}</p>
          <button 
            onClick={fetchGymEntryData}
            className="mt-2 px-4 py-2 bg-white text-red-600 rounded-lg font-semibold hover:bg-red-100 transition"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Real-time Indicator */}
      {gymEntryData && !error && (
        <div className="text-center p-3 mb-4 bg-green-500 bg-opacity-30 rounded-lg">
          <p className="text-sm font-medium">🔴 Live Data from PIR Sensor</p>
        </div>
      )}

      {/* Gym Stats */}
      <div className="grid grid-cols-2 gap-6 text-center">
        {areasWithCounts.map((item, index) => (
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
      <p className="text-center mt-8 text-sm opacity-70 font-light italic">Powered By IoT PIR Sensor</p>
      <div className="text-center my-6">
        <p className="text-lg mb-3 font-semibold">How well does the gym equipment support your training?</p>
        <div className="flex justify-center mt-2 space-x-2">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <button
                key={index}
                className={`w-10 h-10 rounded-full cursor-pointer transition duration-300 transform hover:scale-110 ${
                  selectedRating > index ? "bg-amber-500 shadow-lg" : "bg-white bg-opacity-20"
                }`}
                onClick={() => handleRatingClick(index)}
              >
                ⭐
              </button>
            ))}
        </div>
      </div>

      {/* Last Update Timestamp */}
      {gymEntryData && (
        <p className="text-center text-xs opacity-70 mb-3">
          Last updated: {new Date(gymEntryData.timestamp).toLocaleTimeString()}
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
              className="w-full bg-teal-600 text-white font-bold py-2 rounded-lg mt-4 hover:bg-teal-700 transition duration-300"
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
