import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FirstPage = () => {
  const [serialNumber, setserialNumber] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (serialNumber.trim() === "") {
      toast.warn("Please enter a serial number.", { position: "top-center" });
      return;
    }

    try {
      

      const response = await axios.get(
        `http://localhost:8080/api/equipment/check/${serialNumber}`
      );

      if (response.data.exists) {
        toast.success("Serial number found! Redirecting...", { position: "top-center" });
        setTimeout(() => {
          navigate(`/second/${serialNumber}`);
        }, 1000);
      } else {
        toast.error("Serial number does not exist.", { position: "top-center" });
      }
    } catch (error) {
      console.error("Error checking serial number:", error);
      toast.error("Something went wrong. Please try again.", { position: "top-center" });
    }

    console.log("Form submitted with reference:", serialNumber);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
   
      
      <div className="w-full bg-bluecustom max-w-md p-6 border-2 border-bluecustom rounded-lg shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-4">Enter equipment ref</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Numéro d’immobilisation
            </label>
            <input 
              type="text"
              required
              value={serialNumber}
              onChange={(e) => setserialNumber(e.target.value)}
              className="w-full px-3 py-2 bg-bluecustom border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-900 font-bold text-white placeholder:text-gray-500" 
              placeholder="Enter reference"
            />  
          </div>
          <button className="w-full text-white font-bold py-2 px-4 rounded shadow bg-blue-900 hover:bg-blue-700 transition-all">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default FirstPage;
