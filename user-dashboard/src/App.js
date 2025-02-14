
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
        <Route path="/second" element={<SecondPage />} />
        <Route path="/read-only" element={<ReadOnlyPage />} />
   {/*  <Route path="/read-write" element={<PrivateRoute><ReadWritePage /></PrivateRoute>} />  */}
    <Route path="/read-write" element={<ReadWritePage />} /> 
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
