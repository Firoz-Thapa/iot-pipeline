import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Holiday Village</h1>
        <ul className="flex space-x-4">
          <li><Link to="/" className="hover:text-yellow-300">Home</Link></li>
          <li><Link to="/about" className="hover:text-yellow-300">About</Link></li>
          <li><Link to="/accomodation" className="hover:text-yellow-300">Accommodations</Link></li>
          <li><Link to="/gallery" className="hover:text-yellow-300">Gallery</Link></li>
          <li><Link to="/contact" className="hover:text-yellow-300">Contact</Link></li>
        </ul>
      </div>
    </nav>
  );
}
