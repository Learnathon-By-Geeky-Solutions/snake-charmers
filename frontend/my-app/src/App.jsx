import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import OverallSignup from "./components/OverallSignup";
import Home from "./components/Home";
import UserLogin from "./components/UserLogin";

function App() {
  return (
    <Router>
      <Navbar />
      <div >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<div>Services Page</div>} />
          <Route path="/contact" element={<div>Contact Page</div>} />
          <Route path="/signup" element={<OverallSignup />} />
          <Route path="/login" element={<UserLogin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
