
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Signup from "./components/Signup";
import Home from "./components/Home";
import Usersignup from "./components/Usersignup"; 
import Driversignup from "./components/Driversignup";
import UserLogin from "./components/UserLogin";
function App() {
  return (
    <Router>
      <Navbar />
      <div className="mt-20">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/services" element={<div>Services Page</div>} />
          <Route path="/contact" element={<div>Contact Page</div>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<UserLogin/>} />
          <Route path="/user" element={<Usersignup />} />
          <Route path="/driver" element={<Driversignup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
