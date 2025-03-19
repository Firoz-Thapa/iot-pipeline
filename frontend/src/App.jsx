import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import NowPage from "./components/NowPage";
import WeekPage from "./components/WeekPage";
import PTBetaPage from "./components/PTBetaPage";
// import MoisturePage from "./components/MoisturePage";

const App = () => {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <nav className="bg-blue-500 p-4 text-white flex justify-around">
          <Link to="/" className="font-bold">
            Now
          </Link>
          <Link to="/week" className="font-bold">
            Week
          </Link>
          <Link to="/ptbeta" className="font-bold">
            I PT Beta
          </Link>
          {/* <Link to="/moisture" className="font-bold">Moisture</Link> */}
        </nav>
        <div className="p-4">
          <Routes>
            <Route path="/" element={<NowPage />} />
            <Route path="/week" element={<WeekPage />} />
            <Route path="/ptbeta" element={<PTBetaPage />} />
            {/* <Route path="/moisture" element={<MoisturePage />} /> */}
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
