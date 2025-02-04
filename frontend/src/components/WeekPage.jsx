
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
  // Fake data for the bar chart
  const data = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    datasets: [
      {
        label: "Muscle Fitness",
        data: [20, 35, 40, 30, 25, 45, 50],
        backgroundColor: "rgba(54, 162, 235, 0.7)",
      },
      {
        label: "Aerobic",
        data: [10, 15, 25, 20, 15, 10, 12],
        backgroundColor: "rgba(255, 99, 132, 0.7)",
      },
      {
        label: "Functional",
        data: [5, 8, 12, 10, 9, 6, 7],
        backgroundColor: "rgba(75, 192, 192, 0.7)",
      },
      {
        label: "Not On Devices",
        data: [2, 4, 3, 5, 6, 3, 4],
        backgroundColor: "rgba(153, 102, 255, 0.7)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Weekly Gym Usage Statistics",
      },
    },
  };

  return (
    <div className="bg-gradient-to-b from-blue-600 to-blue-800 min-h-screen flex flex-col items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-11/12 lg:w-3/4">
        <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
          Weekly Usage
        </h2>
        <p className="text-center text-gray-500 mb-6">Powered By IoT</p>
        <div className="chart-container">
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default WeekPage;
