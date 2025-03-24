import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";

// Import images
import mainImage from "../../images/cabin_1_1.jpg";
import img1 from "../../images/cabin_1/img1.jpg";
import img2 from "../../images/cabin_1/img3.jpg";
import img3 from "../../images/cabin_1/img4.jpg";

export default function LentajanPoika_1() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Image */}
      <div className="relative w-full max-h-[600px] bg-cover bg-center">
        <img
          src={mainImage}
          alt="Lentäjän Poika 1"
          className="w-full h-auto max-h-[600px] object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Lentäjän Poika 1</h1>
        <p className="text-gray-700 leading-relaxed">
          A cozy retreat for couples or small families, featuring stunning views of the lake and ski slopes.
          One of four beautiful little cottages in a holiday village built in 2024 on the shores of Lake Syväjärvi, 
          close to the ski slopes, within walking distance of Ukkohalla's services. The lake, the northern lights, 
          and the slopes open directly from the large windows.
        </p>

        {/* Image Slider */}
        <div className="mt-8">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            className="rounded-lg overflow-hidden"
          >
            {[mainImage, img1, img2, img3].map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-auto max-h-[500px] object-cover rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105"
                  onClick={() => openModal(image)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Features */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-blue-600 mb-3">Cabin Features</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Stunning views of Lake Syväjärvi</li>
            <li>Private sauna with a traditional wood-burning stove</li>
            <li>Modern and cozy interior with full amenities</li>
            <li>Perfect for couples and small families</li>
            <li>Easy access to Ukkohalla Ski Resort</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link to="/accomodation">
            <button className="bg-gray-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-700 transition">
              ← Back to Accommodations
            </button>
          </Link>
          <Link to="/booking">
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition">
              Make a Reservation
            </button>
          </Link>
          <a
            href="https://www.airbnb.fi/rooms/1084906891278012218?source_impression_id=p3_1730901318_P3_Qx1nSFp6ovlLI"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="bg-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-700 transition">
              Book via Airbnb
            </button>
          </a>
        </div>
      </div>

      {/* Modal for Enlarged Image */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div className="relative p-4">
            <button
              className="absolute top-0 right-0 m-4 text-white text-3xl font-bold hover:text-gray-300"
              onClick={closeModal}
            >
              &times;
            </button>
            <img
              src={selectedImage}
              alt="Enlarged View"
              className="max-w-screen-lg max-h-screen object-contain rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
