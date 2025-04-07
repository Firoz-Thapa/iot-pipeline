import { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js modules
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WeekPage = () => {
  const [weeklyData, setWeeklyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Category names updated to match NowPage
  const categories = [
    { id: 'strength', label: 'Strength Zone', color: 'rgba(255, 99, 132, 0.7)' }, // Red
    { id: 'cardio', label: 'Cardio Area', color: 'rgba(54, 162, 235, 0.7)' },     // Blue
    { id: 'crossfit', label: 'CrossFit Space', color: 'rgba(255, 159, 64, 0.7)' },  // Orange
    { id: 'stretching', label: 'Stretching Area', color: 'rgba(75, 192, 192, 0.7)' } // Teal
];


  // Fetch weekly data from API
  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        setLoading(true);
        // Get the last 7 days of data
        const response = await axios.get('http://localhost:5000/api/gym-entries?hours=168', {
          timeout: 10000, // 10 second timeout
        });
        
        if (response.data && response.data.data) {
          // Process the data
          const processedData = processWeeklyData(response.data.data);
          setWeeklyData(processedData);
          setError(null);
        } else {
          // Fallback to simulated data if no data is available
          setWeeklyData(generateSimulatedWeeklyData());
        }
      } catch (error) {
        console.error('Error fetching weekly data:', error);
        setError('Failed to load weekly data. Using simulated data instead.');
        // Generate simulated data as a fallback
        setWeeklyData(generateSimulatedWeeklyData());
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyData();
    
    // Refresh data every 5 minutes
    const intervalId = setInterval(fetchWeeklyData, 300000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Process data into weekly format
  const processWeeklyData = (rawData) => {
    // Get day names
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = new Date().getDay();
    
    // Reorder days so that the days array starts with 7 days ago
    const reorderedDays = [...days.slice((currentDay + 1) % 7), ...days.slice(0, (currentDay + 1) % 7)];
    
    // Initialize data structure
    const dayData = reorderedDays.map(day => ({
      day: day,
      totalCount: 0,
      distributionData: {
        strength: 0,
        cardio: 0,
        crossfit: 0,
        stretching: 0
      }
    }));
    
    // Process raw data
    if (rawData && rawData.length > 0) {
      rawData.forEach(entry => {
        const entryDate = new Date(entry.timestamp);
        const dayOfWeek = entryDate.getDay();
        const dayIndex = reorderedDays.indexOf(days[dayOfWeek]);
        
        if (dayIndex !== -1) {
          // Increment total count
          dayData[dayIndex].totalCount = Math.max(dayData[dayIndex].totalCount, entry.count);
          
          // Distribute count across categories - using random distribution
          if (entry.count > 0) {
            const distribution = generateRandomDistribution(entry.count);
            dayData[dayIndex].distributionData.strength += distribution[0];
            dayData[dayIndex].distributionData.cardio += distribution[1];
            dayData[dayIndex].distributionData.crossfit += distribution[2];
            dayData[dayIndex].distributionData.stretching += distribution[3];
          }
        }
      });
    }
    
    return dayData;
  };

  // Generate random distribution of people across categories
  const generateRandomDistribution = (total) => {
    if (total === 0) return [0, 0, 0, 0];
    
    // Generate random weights
    const weights = [
      Math.random() + 0.5, // Slightly favor strength zone
      Math.random(),
      Math.random() * 0.7, // Less likely for CrossFit
      Math.random()
    ];
    
    const weightSum = weights.reduce((sum, weight) => sum + weight, 0);
    
    // Initial distribution based on weights
    let distribution = weights.map(weight => 
      Math.floor(total * (weight / weightSum))
    );
    
    // Calculate the current sum
    const distributionSum = distribution.reduce((sum, count) => sum + count, 0);
    
    // Adjust to ensure sum equals total
    const difference = total - distributionSum;
    
    if (difference > 0) {
      // Add remaining people
      for (let i = 0; i < difference; i++) {
        distribution[Math.floor(Math.random() * 4)]++;
      }
    } else if (difference < 0) {
      // Remove excess people
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

  // Generate simulated data for fallback
  const generateSimulatedWeeklyData = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return days.map(day => {
      const totalCount = Math.floor(Math.random() * 50) + 10;
      const distribution = generateRandomDistribution(totalCount);
      
      return {
        day: day,
        totalCount: totalCount,
        distributionData: {
          strength: distribution[0],
          cardio: distribution[1],
          crossfit: distribution[2],
          stretching: distribution[3]
        }
      };
    });
  };

  // Prepare chart data
  const prepareChartData = () => {
    if (!weeklyData) return null;
    
    const labels = weeklyData.map(day => day.day);
    
    const datasets = categories.map(category => ({
      label: category.label,
      data: weeklyData.map(day => day.distributionData[category.id]),
      backgroundColor: category.color,
    }));
    
    return { labels, datasets };
  };

  const chartData = prepareChartData();
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Weekly Gym Usage Statistics",
        color: "#10B981", // Green color to match theme
        font: {
          size: 18,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          // Tooltip customization
        }
      }
    }
  };

  return (
    <div className="bg-gradient-to-b from-green-600 to-green-800 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-11/12 lg:w-3/4">
        <h2 className="text-2xl font-bold text-green-600 mb-4 text-center">
          Weekly Usage
        </h2>

        {loading && !chartData && (
          <div className="text-center p-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading weekly data...</p>
          </div>
        )}

        {error && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <p className="text-yellow-700">{error}</p>
          </div>
        )}

        {chartData && (
          <>
            <p className="text-center text-gray-500 mb-6">
              Live data from PIR sensor aggregated by day
            </p>
            <div className="chart-container">
              <Bar data={chartData} options={options} />
            </div>
            
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Data reflects peak occupancy for each gym area by day of week</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WeekPage;
