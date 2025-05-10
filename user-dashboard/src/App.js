import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import FirstPage from "./components/user/FirstPage";
import SecondPage from "./components/user/SecondPage";
import ReadOnlyPage from "./components/documents/ReadOnlyPage";
import ReadWritePage from "./components/documents/ReadWritePage";
import LoginForm from "./components/auth/LoginForm";
import Logout from "../src/components/auth/Logout";
import SignupForm from "./components/auth/SignupForm";
import PrivateRoute from "./components/auth/PrivateRoute";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import NotFound from "./components/common/NotFound";
import { ToastContainer } from 'react-toastify';
import { FaUserCircle } from 'react-icons/fa';
import Chatbot from "./pages/Chatbot";
function App() {
  const [showMenu, setShowMenu] = useState(false);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUsername(payload.username || payload.sub); // adjust based on how username is stored
      } catch (err) {
        console.error("Invalid token");
      }
    }
  }, []);

  

  return (
    <Router>
      {username&&
      <div className="absolute top-4 left-20 z-[999] text-white">
        <div className="relative">
          <FaUserCircle 
            size={30} 
            className="cursor-pointer" 
            onClick={() => setShowMenu(!showMenu)} 
          />
          {showMenu && (
            <div className="mt-2 w-48 p-3 bg-white text-black shadow-xl rounded-lg absolute left-0">
              <p className="pb-4 text-sm">Logged in as <strong>{username || "Unknown"}</strong></p>
              <a 
                className=" w-full bg-bluedark hover:bg-bluedark text-white py-1 px-3 rounded"
                href={"/logout"}
              >
                Logout
              </a>
            </div>
          )}
        </div>
      </div>
    }
      <ToastContainer />
      <Navbar />

      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/second/:id" element={<SecondPage />} />
        <Route path="/chat" element={<Chatbot />} />
        <Route path="/read-only/:id" element={<ReadOnlyPage />} />
        <Route path="/read-write/:id" element={<PrivateRoute><ReadWritePage /></PrivateRoute>} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
