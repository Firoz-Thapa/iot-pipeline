import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";

// Import images
import mainImage from "../../images/cabin_4.jpg";
import img1 from "../../images/cabin_4/img_1.jpg";
import img2 from "../../images/cabin_4/img_2.jpg";
import img3 from "../../images/cabin_4/img_3.jpg";
import img4 from "../../images/cabin_4/img_4.jpg";
import img5 from "../../images/cabin_4/img_5.jpg";
import img6 from "../../images/cabin_4/img_6.jpg";

export default function BeachHouse() {
  // State for modal to enlarge images
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Function to open modal with selected image
  const openModal = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  // Function to close modal
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
          alt="Beach House"
          className="w-full h-auto max-h-[600px] object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Beach House</h1>
        <p className="text-gray-700 leading-relaxed">
          Experience luxury on the shores of Lake Syväjärvi! A stunning beach villa right next to the ski slopes offers large 
          windows with breathtaking views of the lake, the northern lights, and the slopes. Relax in a separate beach sauna, 
          enjoying the gentle steam of the wood-burning stove and the magnificent lake view from the large windows of the 
          sauna and fireplace room.
        </p>

        {/* Image Slider Section with Click-to-Enlarge */}
        <div className="mt-8">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            className="rounded-lg overflow-hidden"
          >
            {[mainImage, img1, img2, img3, img4, img5, img6].map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={image}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-auto max-h-[500px] object-cover rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105"
                  onClick={() => openModal(image)} // Open modal on click
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Features Section */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-blue-600 mb-3">Cabin Features</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Panoramic lake and ski slope views</li>
            <li>Private beach access for a luxurious experience</li>
            <li>Exclusive wood-fired sauna by the lake</li>
            <li>Modern interiors with high-end furniture</li>
            <li>Smart TV with Netflix, Amazon Prime & YouTube</li>
            <li>Ultra-fast 400M WiFi covering the entire area</li>
          </ul>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex gap-4">
          <Link to="/accomodation">
            <button className="bg-gray-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-gray-700 transition">
              ← Back to Accommodations
            </button>
          </Link>

          {/* Make a Reservation (Local Booking Page) */}
          <Link to="/booking">
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition">
              Make a Reservation
            </button>
          </Link>

          {/* Book via Airbnb */}
          <a
            href="https://www.airbnb.fi/rooms/1084851233677656663?_set_bev_on_new_domain=1729758684_EAYjMwMTFhNWQzZG&source_impression_id=p3_1730912553_P3OiCuhBVokT5tw2"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition">
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
