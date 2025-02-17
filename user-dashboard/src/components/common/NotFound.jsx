import React from 'react'; 
import { Link } from 'react-router-dom'; // If you're using React Router for navigation

const NotFound = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen text-center">
      {/* Logo positioned at the top right */}
      <h1 className="absolute top-4 right-4 text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-white">
        LEONI
      </h1>

      {/* Main content */}
      <div className="bg-bluecustom p-8 rounded-lg shadow-lg max-w-md">
        <h1 className="text-4xl font-bold text-black mb-4">404</h1>
        <p className="text-lg font-bold text-black mb-6">Oops! The page you're looking for doesn't exist.</p>
        <Link
          to="/" // Link back to home or any other page
          className="text-white hover:underline"
        >
          Go back to the homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
