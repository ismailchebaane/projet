import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import 'react-toastify/dist/ReactToastify.css';
import CloseIcon from '@mui/icons-material/Close';

const Equipments = () => {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [formValues, setFormValues] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const checkAccessAndFetch = async () => {
      if (!token) {
        toast.warning('No token found. Redirecting to login...');
        navigate('/login');
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const roles = decoded.roles || [];

        if (!roles.includes('ADMIN')) {
          toast.error('Access Denied: Admins only');
        
          return;
        }
      } catch (err) {
        toast.error('Invalid token. Redirecting...');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8080/api/equipment/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEquipments(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch equipment data.');
        toast.error('Failed to fetch equipment data.');
      } finally {
        setLoading(false);
      }
    };

    checkAccessAndFetch();
  }, [token, navigate]);

  const handleDelete = async (equipmentId) => {
    if (!window.confirm("Are you sure you want to delete this equipment?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/equipment/delete/${equipmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEquipments(prev => prev.filter(eq => eq.id !== equipmentId));
      toast.success("Equipment deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete equipment.");
    }
  };


  return (
    <div className="min-h-screen bg-white flex justify-center pt-20">
          <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <div className="w-full max-w-7xl border-l border-r border-gray-300">
        <div className="flex items-center justify-between px-4">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-700 underline text-sm"
          >
            Return
          </button>
          <Link to="/form" className="border border-gray-400 px-4 py-1 rounded text-gray-700 hover:bg-gray-100">Add</Link>
        </div>

        <div className="px-4 mt-2">
          <h1 className="text-5xl font-bold text-blue-900">LEONI</h1>
          <h2 className="text-2xl font-bold text-blue-900 mt-1">Equipements list</h2>
        </div>

        <hr className="mt-4 border-gray-300" />

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white border border-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Serial Number</th>
                <th className="py-3 px-4 text-left">Immobilization Number</th>
                <th className="py-3 px-4 text-left">Plant</th>
                <th className="py-3 px-4 text-left">Process</th>
                <th className="py-3 px-4 text-left">State</th>
                <th className="py-3 px-4 text-left">Description</th>
                <th className="py-3 px-4 text-left">Type</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {equipments.map((equipment) => (
                <tr key={equipment.id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-4 text-blue-900 underline">
                    <Link to={`/equipments/${equipment.serialNumber}`}>{equipment.name}</Link>
                  </td>
                  <td className="py-3 px-4">
                    <Link to={`/equipments/${equipment.serialNumber}`}>{equipment.serialNumber}</Link>
                  </td>
                  <td className="py-3 px-4">{equipment.immobilizationNumber}</td>
                  <td className="py-3 px-4">{equipment.plant}</td>
                  <td className="py-3 px-4">{equipment.process}</td>
                  <td className="py-3 px-4 flex items-center space-x-2">
                    <span
                      className={`h-3 w-3 rounded-full ${equipment.state === 'Open' ? 'bg-green-600' : 'bg-gray-500'}`}
                    ></span>
                    <span className="text-green-700 font-medium">{equipment.state}</span>
                  </td>
                  <td className="py-3 px-4">
                    {equipment.description?.length > 20
                      ? equipment.description.substring(0, 20) + '...'
                      : equipment.description}
                  </td>
                  <td className="py-3 px-4">{equipment.type}</td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleDelete(equipment.id)}
                      className="border border-red-600 text-red-600 px-3 py-1 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Equipments;
