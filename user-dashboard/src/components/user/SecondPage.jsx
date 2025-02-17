import React from 'react';
import { useNavigate } from 'react-router-dom';

const SecondPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  p-6">
    
      
      <div className="w-full max-w-md bg-bluecustom p-6 border-2 border-bluecustom rounded-lg shadow-2xl text-center">
        {/* Equipment Name */}
        <h2 className="text-2xl font-bold text-white">Equipement name</h2>
        <h3 className="text-xl font-semibold mt-2 text-white underline">Equipement identifiant</h3>
        <h3 className="text-lg font-semibold  text-white underline">Numéro de série</h3>
        
        {/* Buttons */}
        <div className="mt-6 space-y-4">
          <button
            className="bg-blue-900 text-white py-2 px-6 rounded-lg text-lg w-full hover:bg-blue-700 transition"
            onClick={() => navigate('/read-only')}
          >
            Read_only
          </button>
          <button
            className="bg-blue-900 text-white py-2 px-6 rounded-lg text-lg w-full hover:bg-blue-700 transition"
            onClick={() => navigate('/read-write')}
          >
            Read/write
          </button>
        </div>
        
        {/* Return Link */}
        <button
          className="mt-6  text-white underline hover:text-blue-700"
          onClick={() => navigate(-1)}
        >
          Return
        </button>
      </div>
    </div>
  );
};

export default SecondPage;
