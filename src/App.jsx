import { Routes, Route } from "react-router-dom";
//import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Accomodation from "./pages/Accomodation";
import LentajanPoika1 from "./pages/accomodation/LentajanPoika_1"; // Corrected path
import LentajanPoika2 from "./pages/accomodation/LentajanPoika_2";
import HenryFordCabin from "./pages/accomodation/HenryFordCabin";
import BeachHouse from "./pages/accomodation/BeachHouse"
import GalleryPage from "./pages/GalleryPage";
import ContactPage from "./pages/ContactPage";
import Booking from "./pages/Booking";



export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/accomodation" element={<Accomodation />} />
          <Route path="/accomodation/lentajan-poika-1" element={<LentajanPoika1 />} />
          <Route path="/accomodation/lentajan-poika-2" element={<LentajanPoika2 />} />
          <Route path="/accomodation/henry-ford-cabin" element={<HenryFordCabin />} />
          <Route path="/accomodation/beach-house" element={<BeachHouse />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/booking" element={<Booking />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}
