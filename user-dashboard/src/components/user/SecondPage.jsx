import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const SecondPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 

  return (
    <div className="flex flex-col text-white items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-md bg-bluecustom p-6 border-2 border-bluecustom rounded-lg shadow-2xl text-center">
        {/* Display dynamic equipment reference */}
        <h2 className="text-2xl font-bold underline text-white">Equipement name:</h2>
        <h2>Schleuniger CC 64</h2>

        <h3 className="text-xl font-semibold mt-2 text-white underline">Equipement identifiant:</h3>
        <h2>{id}</h2> {/* Use the entered equipment reference here */}

        <h3 className="text-lg font-semibold text-white underline">Numéro de série:</h3>
        <h2>271</h2>

        <div className="mt-6 space-y-4">
          
          <button
            className="bg-blue-900 text-white py-2 px-6 rounded-lg text-lg w-full hover:bg-blue-700 transition"
            onClick={() => navigate(`/read-only/${id}`)}
          >
            Read-only
          </button>

          {/* Read/Write button navigates to /read-write/:id */}
          <button
            className="bg-blue-900 text-white py-2 px-6 rounded-lg text-lg w-full hover:bg-blue-700 transition"
            onClick={() => navigate(`/read-write/${id}`)}
          >
            Read/Write
          </button>
        </div>

       
        <button
          className="mt-6 text-white underline hover:text-blue-700"
          onClick={() => navigate(-1)}
        >
          Return
        </button>
      </div>
    </div>
  );
};

export default SecondPage;
