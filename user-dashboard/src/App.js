
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FirstPage from "./components/user/FirstPage";
import SecondPage from "./components/user/SecondPage";
import ReadOnlyPage from "./components/documents/ReadOnlyPage";
import ReadWritePage from "./components/documents/ReadWritePage";
import LoginForm from "./components/auth/LoginForm";
import SignupForm from "./components/auth/SignupForm";
import PrivateRoute from "./components/auth/PrivateRoute";
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import NotFound from "./components/common/NotFound";

function App() {
  return (
    <Router>
        <Navbar />
      <Routes>
        <Route path="/" element={<FirstPage />} />
        <Route path="/second/:id" element={<SecondPage />} />
        <Route path="/read-only/:id" element={<ReadOnlyPage />} />
   {  <Route path="/read-write/:id" element={<PrivateRoute><ReadWritePage /></PrivateRoute>} /> }
  
        <Route path="/login" element={<LoginForm />} />
      
        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
