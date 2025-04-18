import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import NowPage from "./components/NowPage";
import WeekPage from "./components/WeekPage";
import PTBetaPage from "./components/PTBetaPage";

const App = () => {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <nav className="bg-green-700 p-4 text-white flex justify-around"> {/* Changed to bg-green-700 */}
          <Link to="/" className="font-bold">
            Now
          </Link>
          <Link to="/week" className="font-bold">
            Week
          </Link>
          <Link to="/ptbeta" className="font-bold">
            I PT Beta
          </Link>
          
        </nav>
        <div className="p-4">
          <Routes>
            <Route path="/" element={<NowPage />} />
            <Route path="/week" element={<WeekPage />} />
            <Route path="/ptbeta" element={<PTBetaPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;


