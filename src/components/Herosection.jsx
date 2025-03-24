import { useNavigate } from "react-router-dom"; // ✅ Import React Router navigation
import heroImage from "../images/front_page.jpg"; // ✅ Import hero image

export default function Herosection() {
  const navigate = useNavigate(); // ✅ Initialize navigation function

  return (
    <div className="relative h-screen flex flex-col items-center justify-center bg-cover bg-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <h1 className="text-5xl text-white font-bold">Escape to Paradise</h1>
        <p className="text-white text-lg mt-4">
          Experience tranquility at our holiday village.
        </p>
        
        {/* Book Now Button - Navigates to Accommodation Page */}
        <button
          onClick={() => navigate("/accomodation")} // ✅ Ensure the correct route
          className="mt-6 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-700 transition"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
