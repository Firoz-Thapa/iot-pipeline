import React, { useState } from "react";

export default function Booking() {
  const [selectedCabin, setSelectedCabin] = useState("");

  const cabins = [
    { name: "Lentäjän Poika 1", value: "lentajan-poika-1" },
    { name: "Lentäjän Poika 2", value: "lentajan-poika-2" },
    { name: "Henry Ford Cabin", value: "henry-ford-cabin" },
    { name: "Beach House", value: "beach-house" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="max-w-2xl w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">Make a Reservation</h1>
        <p className="text-gray-600 text-center mb-6">
          Fill out the form below to request a reservation.
        </p>

        {/* Cabin Type Selection */}
        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-700 mb-2">
            Select Cabin Type
          </label>
          <select
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedCabin}
            onChange={(e) => setSelectedCabin(e.target.value)}
          >
            <option value="" disabled>Select a Cabin</option>
            {cabins.map((cabin) => (
              <option key={cabin.value} value={cabin.value}>
                {cabin.name}
              </option>
            ))}
          </select>
        </div>

        {/* Booking Form */}
        <form className="space-y-4">
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">Check-in Date</label>
            <input
              type="date"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">Check-out Date</label>
            <input
              type="date"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Confirm Booking
          </button>
        </form>
      </div>
    </div>
  );
}
