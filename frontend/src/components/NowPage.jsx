// import { useState } from "react";
// import "./NowPage.css";

// const NowPage = () => {
//   const [selectedRating, setSelectedRating] = useState(0); // State for rating stars

//   const handleRatingClick = (index) => {
//     setSelectedRating(index + 1); // Update selected rating
//   };

//   const handleCardClick = (category) => {
//     alert(`You clicked on ${category}`); // Show an alert for the clicked category
//   };

//   const handleForecastClick = () => {
//     alert("Displaying forecast data..."); // Show a placeholder action for the forecast button
//   };

//   return (
//     <div className="bg-gradient-to-b from-blue-600 to-blue-800 rounded-2xl shadow-xl p-6 text-white max-w-md mx-auto lg:max-w-xl">
//       {/* Blinking Light with Text */}
//       <div className="flex items-center space-x-2 mb-6">
//         <div className="blinking-light"></div>
//         <h2 className="text-2xl font-semibold tracking-wide">13 people in the gym</h2>
//       </div>

//       {/* Gym Stats */}
//       <div className="grid grid-cols-2 gap-6 mt-4 text-center">
//         <button
//           className="bg-white bg-opacity-10 p-4 rounded-lg shadow-inner focus:outline-none hover:bg-opacity-20 transition"
//           onClick={() => handleCardClick("Muscle Fitness")}
//         >
//           <p className="text-2xl font-bold">10 / 34</p>
//           <p className="text-sm">Muscle Fitness</p>
//         </button>
//         <button
//           className="bg-white bg-opacity-10 p-4 rounded-lg shadow-inner focus:outline-none hover:bg-opacity-20 transition"
//           onClick={() => handleCardClick("Aerobic")}
//         >
//           <p className="text-2xl font-bold">1 / 9</p>
//           <p className="text-sm">Aerobic</p>
//         </button>
//         <button
//           className="bg-white bg-opacity-10 p-4 rounded-lg shadow-inner focus:outline-none hover:bg-opacity-20 transition"
//           onClick={() => handleCardClick("Functional")}
//         >
//           <p className="text-2xl font-bold">0 / 2</p>
//           <p className="text-sm">Functional</p>
//         </button>
//         <button
//           className="bg-white bg-opacity-10 p-4 rounded-lg shadow-inner focus:outline-none hover:bg-opacity-20 transition"
//           onClick={() => handleCardClick("Not On Devices")}
//         >
//           <p className="text-2xl font-bold">2</p>
//           <p className="text-sm">Not On Devices</p>
//         </button>
//       </div>

//       {/* Footer Section */}
//       <p className="text-center mt-6 text-sm opacity-80">Powered By IoT</p>
//       <div className="text-center my-6">
//         <p className="text-lg mb-2">How well does the gym equipment support your training?</p>
//         <div className="flex justify-center mt-2 space-x-2">
//           {Array(5)
//             .fill(0)
//             .map((_, index) => (
//               <button
//                 key={index}
//                 className={`w-8 h-8 rounded-full cursor-pointer ${
//                   selectedRating > index
//                     ? "bg-yellow-400"
//                     : "bg-white bg-opacity-20"
//                 } transition`}
//                 onClick={() => handleRatingClick(index)}
//               ></button>
//             ))}
//         </div>
//       </div>
//       <button
//         className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold py-3 rounded-lg mt-4 shadow-md transition"
//         onClick={handleForecastClick}
//       >
//         See the forecast for the next few hours
//       </button>
//     </div>
//   );
// };

// export default NowPage;


import { useState } from "react";
import "./NowPage.css";

const NowPage = () => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [showForecast, setShowForecast] = useState(false);

  const handleRatingClick = (index) => {
    setSelectedRating(index + 1);
  };

  const handleCardClick = (category) => {
    alert(`You clicked on ${category}`);
  };

  const handleForecastClick = () => {
    setShowForecast(true); // Show the forecast modal
  };

  const handleCloseForecast = () => {
    setShowForecast(false);
  };

  // Dummy Forecast Data
  const forecastData = [
    { time: "Now", people: 13 },
    { time: "1 Hour +", people: 15 },
    { time: "2 Hours +", people: 18 },
    { time: "3 Hours +", people: 12 },
    { time: "4 Hours +", people: 9 },
  ];

  return (
    <div className="bg-gradient-to-b from-blue-700 to-blue-900 rounded-2xl shadow-2xl p-8 text-white max-w-lg mx-auto lg:max-w-2xl transition-all duration-300">
      {/* Blinking Light with Text */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="blinking-light animate-pulse w-4 h-4 bg-red-500 rounded-full shadow-lg"></div>
        <h2 className="text-3xl font-extrabold tracking-wide">🏋️ 13 people in the gym</h2>
      </div>

      {/* Gym Stats */}
      <div className="grid grid-cols-2 gap-6 text-center">
        {[
          { label: "Muscle Fitness", value: "10 / 34" },
          { label: "Aerobic", value: "1 / 9" },
          { label: "Functional", value: "0 / 2" },
          { label: "Not On Devices", value: "2" },
        ].map((item, index) => (
          <button
            key={index}
            className="bg-white bg-opacity-10 p-5 rounded-lg shadow-lg focus:outline-none hover:bg-opacity-30 transition duration-300 transform hover:scale-105"
            onClick={() => handleCardClick(item.label)}
          >
            <p className="text-3xl font-bold">{item.value}</p>
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

      {/* Forecast Button */}
      <button
        className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-4 rounded-xl mt-6 shadow-lg transition duration-300 transform hover:scale-105"
        onClick={handleForecastClick}
      >
        🔮 See the forecast for the next few hours
      </button>

      {/* Forecast Modal */}
      {showForecast && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
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

