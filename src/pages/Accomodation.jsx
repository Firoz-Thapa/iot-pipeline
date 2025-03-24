import React from "react";
import { Link } from "react-router-dom";
import LentajanPoika1 from "../images/cabin_1_1.jpg";
import LentajanPoika2 from "../images/cabin_2_1.jpg";
import LentajanPoika3 from "../images/cabin_3.jpg";
import LentajanPoika4 from "../images/cabin_4.jpg";

const accommodations = [
  {
    name: "Lentäjän Poika 1",
    description: "A cozy retreat for couples or small families, featuring stunning views of the lake and ski slopes.",
    img: LentajanPoika1,
    hoverDescription:
      "One of four beautiful little cottages in a holiday village built in 2024 on the shores of Lake Syväjärvi, close to the ski slopes, within walking distance of Ukkohalla's services. The lake, the northern lights, and the slopes open directly from the large windows.",
    link: "/accomodation/lentajan-Poika-1", // Route to details page
  },
  {
    name: "Lentäjän Poika 2",
    description: "A charming lakeside cabin with a traditional wood-burning sauna, perfect for relaxation.",
    img: LentajanPoika2,
    hoverDescription:
      "Vacation in style in Ukkohalla! Rent a magnificent villa on the shore of Lake Syväjärvi, right next to the ski slopes...",
    link: "/accomodation/lentajan-poika-2",
  },
  {
    name: "Henry Ford Cabin",
    description: "A modern and rustic cabin inspired by Henry Ford, offering comfort and innovation in nature.",
    img: LentajanPoika3,
    hoverDescription:
      "Rakkaranta holiday village was completed in February 2024. Our smallest villa is made in the spirit of Henry Ford...",
    link: "/accomodation/henry-ford-cabin",
  },
  {
    name: "Beach House",
    description: "A luxurious lakeside home with private access to the beach, designed for ultimate comfort and relaxation.",
    img: LentajanPoika4,
    hoverDescription:
      "Experience luxury on the shores of Lake Syväjärvi! A stunning beach villa right next to the ski slopes offers breathtaking views...",
    link: "/accomodation/beach-house",
  },
];

export default function Accomodation() {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-blue-600 mb-4">Our Accommodations</h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Experience the best of Finnish lakeside living in our well-designed, cozy, and modern cabins.
          </p>
        </div>

        {/* Accommodation Listings */}
        <div className="grid md:grid-cols-2 gap-8">
          {accommodations.map((accommodation, index) => (
            <div key={index} className="relative group bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Image with Hover Effect */}
              <div className="relative overflow-hidden">
                <img
                  src={accommodation.img}
                  alt={accommodation.name}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Hover Overlay */}
                {accommodation.hoverDescription && (
                  <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-4">
                    <p className="text-white text-sm text-center">{accommodation.hoverDescription}</p>
                  </div>
                )}
              </div>

              {/* Name & Permanent Description */}
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800">{accommodation.name}</h2>
                <p className="text-gray-600 mt-2">{accommodation.description}</p>

                {/* More Details Button */}
                <div className="mt-4">
                  <Link to={accommodation.link}>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition">
                      More Details
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
