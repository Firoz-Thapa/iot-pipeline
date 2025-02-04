import { useState } from "react";
import "./NowPage.css";

const NowPage = () => {
  const [selectedRating, setSelectedRating] = useState(0); // State for rating stars

  const handleRatingClick = (index) => {
    setSelectedRating(index + 1); // Update selected rating
  };

  const handleCardClick = (category) => {
    alert(`You clicked on ${category}`); // Show an alert for the clicked category
  };

  const handleForecastClick = () => {
    alert("Displaying forecast data..."); // Show a placeholder action for the forecast button
  };

  return (
    <div className="bg-gradient-to-b from-blue-600 to-blue-800 rounded-2xl shadow-xl p-6 text-white max-w-md mx-auto lg:max-w-xl">
      {/* Blinking Light with Text */}
      <div className="flex items-center space-x-2 mb-6">
        <div className="blinking-light"></div>
        <h2 className="text-2xl font-semibold tracking-wide">13 people in the gym</h2>
      </div>

      {/* Gym Stats */}
      <div className="grid grid-cols-2 gap-6 mt-4 text-center">
        <button
          className="bg-white bg-opacity-10 p-4 rounded-lg shadow-inner focus:outline-none hover:bg-opacity-20 transition"
          onClick={() => handleCardClick("Muscle Fitness")}
        >
          <p className="text-2xl font-bold">10 / 34</p>
          <p className="text-sm">Muscle Fitness</p>
        </button>
        <button
          className="bg-white bg-opacity-10 p-4 rounded-lg shadow-inner focus:outline-none hover:bg-opacity-20 transition"
          onClick={() => handleCardClick("Aerobic")}
        >
          <p className="text-2xl font-bold">1 / 9</p>
          <p className="text-sm">Aerobic</p>
        </button>
        <button
          className="bg-white bg-opacity-10 p-4 rounded-lg shadow-inner focus:outline-none hover:bg-opacity-20 transition"
          onClick={() => handleCardClick("Functional")}
        >
          <p className="text-2xl font-bold">0 / 2</p>
          <p className="text-sm">Functional</p>
        </button>
        <button
          className="bg-white bg-opacity-10 p-4 rounded-lg shadow-inner focus:outline-none hover:bg-opacity-20 transition"
          onClick={() => handleCardClick("Not On Devices")}
        >
          <p className="text-2xl font-bold">2</p>
          <p className="text-sm">Not On Devices</p>
        </button>
      </div>

      {/* Footer Section */}
      <p className="text-center mt-6 text-sm opacity-80">Powered By GymPlus</p>
      <div className="text-center my-6">
        <p className="text-lg mb-2">How well does the gym equipment support your training?</p>
        <div className="flex justify-center mt-2 space-x-2">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <button
                key={index}
                className={`w-8 h-8 rounded-full cursor-pointer ${
                  selectedRating > index
                    ? "bg-yellow-400"
                    : "bg-white bg-opacity-20"
                } transition`}
                onClick={() => handleRatingClick(index)}
              ></button>
            ))}
        </div>
      </div>
      <button
        className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold py-3 rounded-lg mt-4 shadow-md transition"
        onClick={handleForecastClick}
      >
        See the forecast for the next few hours
      </button>
    </div>
  );
};

export default NowPage;