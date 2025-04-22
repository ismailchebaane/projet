import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const SecondPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // id = serialNumber
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:8080/api/equipment/${id}`);

        setEquipment(response.data);
        toast.success("Equipment data loaded successfully!", { position: "top-center" });
      } catch (error) {
        console.error("Failed to fetch equipment:", error);
        toast.error("Failed to load equipment. Please try again.", { position: "top-center" });
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [id]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 ">
      <ToastContainer />
      <div className="w-full max-w-2xl bg-bluecustom p-8 border-2 border-bluecustom rounded-2xl shadow-2xl text-white">
        {loading ? (
          <div className="text-center text-lg">Loading...</div>
        ) : equipment ? (
          <>
            <h2 className="text-3xl font-bold underline mb-4">Equipment Details</h2>

            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <h3 className="font-semibold underline">Name:</h3>
                <p>{equipment.name}</p>
              </div>
              <div>
                <h3 className="font-semibold underline">Serial Number:</h3>
                <p>{equipment.serialNumber}</p>
              </div>
              <div>
                <h3 className="font-semibold underline">Plant:</h3>
                <p>{equipment.plant}</p>
              </div>
              <div>
                <h3 className="font-semibold underline">Process:</h3>
                <p>{equipment.process}</p>
              </div>
              <div>
                <h3 className="font-semibold underline">State:</h3>
                <p>{equipment.state}</p>
              </div>
              <div className="col-span-2">
                <h3 className="font-semibold underline">Description:</h3>
                <p>{equipment.description}</p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <button
                className="bg-blue-900 text-white py-2 px-6 rounded-lg text-lg w-full hover:bg-blue-700 transition"
                onClick={() => navigate(`/read-only/${id}`)}
              >
                Read-only
              </button>
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
          </>
        ) : (
          <div className="text-center text-red-200 font-bold">
            Equipment not found.
          </div>
        )}
      </div>
    </div>
  );
};

export default SecondPage;
