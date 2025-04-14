import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import CloseIcon from '@mui/icons-material/Close';
export default function Allusers() {
  const [formValues, setFormValues] = useState({
    id: "",
    username: "",
    email: "",
    matricule: "",
    fullName: "",
    role: "",
    enabled: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userid, setUserid] = useState(null);
  const [isDone, setIsDone] = useState(false);
  const [isUpdateDone, setUpdateIsDone] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State for handling errors
  const [accessDenied, setAccessDenied] = useState(false); // State for access denied
  const token = localStorage.getItem('token');

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };



  const handleUpdate = (user) => {
    setUserid(user.username);
    setFormValues({
      
      username: user.username,
      
      matricule: user.matricule,
      fullName: user.fullName,
      role: user.role,
      work: user.work || '', // default to empty if not present

    });
    setIsEditing(true);
    setSelectedUser(user);
    
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log(formValues);
    try {
      const response = await axios.put(`http://localhost:8080/update/user/${userid}`, formValues, axiosConfig);
      console.log("Update success:", response);
      setUpdateIsDone(true);
      setIsEditing(false);
      setUserid(null);
    } catch (error) {
      console.error("Update error:", error);
      setError('Failed to update user. Please try again.');
    }
  };
    
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };


  // Fetch users and handle errors
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null); // Reset any previous errors
      try {
        const response = await axios.get('http://localhost:8080/api/user', axiosConfig);
        setUsers(response.data);
      }  catch (err) {
        // Handle error based on the status code
        console.error('Error fetching users:', err);

        // Check for 403 Forbidden error and set accessDenied state
        if (err.response && err.response.status === 403) {
          setAccessDenied(true);
          setError('Access Denied: You do not have permission to view this data.');
        } else {
          setError('An error occurred while fetching user data. Please try again later.');
        }
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    fetchUsers();
  }, []); // Only run once when the component mounts

  

  const handleDelete = async (event, item) => {
    event.preventDefault();
  
    console.log('Attempting to delete:', item.username);
  
  
    try {
      const response = await axios.delete(`http://localhost:8080/delete/user/${item.username}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Delete response:', response);
      alert(`User ${item.username} deleted successfully.`);
      window.location.reload();
    } catch (error) {
      if (error.response) {
        console.error('Server error:', error.response.status, error.response.data);
      } else {
        console.error('Network or CORS error:', error.message);
      }
    }
  };


  

  return (
    <div>
      {/* Success messages */}
      {isEditing && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <form
      onSubmit={handleFormSubmit}
      className="bg-white rounded-xl p-8 w-[90%] max-w-3xl shadow-lg relative"
    >
      <h2 className="text-3xl font-bold text-blue-900 mb-4">LEONI</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-gray-500">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formValues.fullName}
            onChange={handleInputChange}
            className="w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label className="text-gray-500">User Name</label>
          <input
            type="text"
            name="username"
            value={formValues.username}
            onChange={handleInputChange}
            className="w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label className="text-gray-500">Matricule</label>
          <input
            type="text"
            name="matricule"
            value={formValues.matricule}
            onChange={handleInputChange}
            className="w-full border rounded-md p-2"
          />
        </div>

        <div>
          <label className="text-gray-500">Work</label>
          <select
            name="work"
            value={formValues.work}
            onChange={handleInputChange}
            className="w-full border rounded-md p-2"
          > 
            <option value="">Select work</option>
            <option value="PPE">PPE</option>
            <option value="QM">QM</option>
            <option value="IM">IM</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-4">
        <button
          type="submit"
          className="px-6 py-2 bg-green-100 text-green-700 border border-green-300 rounded hover:bg-green-200"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="px-6 py-2 bg-red-100 text-red-700 border border-red-300 rounded hover:bg-red-200"
        >
          Clear
        </button>
      </div>
    </form>
  </div>
)}

      { error&&(
              
              <div
              className={`${
                error ? 'alert alert-error flex justify-between absolute top-1/5 left-1/2 z-[999] max-w-sm shadow-lg px-4 py-3 rounded-lg transition-all transform -translate-x-1/2 -translate-y-1/2' : 'hidden'
              } bg-red-500 text-white text-sm font-semibold`}
              style={{
                transition: 'all 0.3s ease-out',
                opacity: error ? 1 : 0,
                transform: error ? 'translateY(0)' : 'translateY(-50px)',
              }}
            >
              <div className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current flex-shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
              <CloseIcon
                onClick={() => setError(null)}
                className="cursor-pointer text-white ml-4"
              />
            </div> )}

      {isDone && (
        <div className="bg-teal-100 flex items-center justify-center border-t-4 w-[360px] md:w-[480px] lg:w-[600px] absolute z-50 top-[50%] left-[25%] border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
          <div className="flex justify-center items-center">
            <div className="py-1">
              <svg className="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
              </svg>
            </div>
            <p className="font-bold">Account has been Deleted Successfully</p>
          </div>
        </div>
      )}

      {isUpdateDone && (
        <div className="bg-teal-100 flex items-center justify-center border-t-4 w-[360px] md:w-[480px] lg:w-[600px] absolute z-50 top-[50%] left-[25%] border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md" role="alert">
          <div className="flex justify-center items-center">
            <div className="py-1">
              <svg className="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
              </svg>
            </div>
            <p className="font-bold">Account has been Updated Successfully</p>
          </div>
          <CloseIcon
                onClick={() => setUpdateIsDone(false)}
                className="cursor-pointer text-white ml-4"
              />
        </div>
      )}

      {/* Main content */}
      <div className="max-w-full mt-20 px-10">
        {loading ? (
          <div className="flex justify-center items-center text-lg font-medium text-gray-700 mt-20">
            <span className="animate-pulse">Loading</span>
            <span className="animate-ping inline-block w-2 h-2 bg-blue-500 rounded-full mx-1"></span>
            <span className="animate-ping inline-block w-2 h-2 bg-blue-500 rounded-full mx-1 delay-150"></span>
            <span className="animate-ping inline-block w-2 h-2 bg-blue-500 rounded-full mx-1 delay-300"></span>
          </div>
        ) : (
          <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <div className="p-4 flex justify-end">
              <input
                type="text"
                id="table-search"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-80 pl-4 p-2.5"
                placeholder="Search for items"
              />
            </div>
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
               
                  <th className="px-6 py-3 text-center">Full Name</th>
                  <th className="px-6 py-3 text-center">Username</th>
                  <th className="px-6 py-3 text-center">Work</th>
                  <th className="px-6 py-3 text-center">Matricule</th>
                  <th className="px-6 py-3 text-center">Role</th>
                  <th className="px-6 py-3 text-center">Enabled</th>
                  <th className="px-6 py-3 text-center">Edit</th>
                  <th className="px-6 py-3 text-center">Delete</th>
                </tr>
              </thead>


           

              <tbody>
                {users.reverse().map((item) => (
                  
                  <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                   
                    <td className="px-6 py-4 text-center">{item.fullName}</td>
                    <td className="px-6 py-4 text-center">{item.username}</td>
                    <td className="px-6 py-4 text-center">{item.work}</td>
                    <td className="px-6 py-4 text-center">{item.matricule}</td>
                    <td className="px-6 py-4 text-center">{item.role}</td>
                    
                    <td className="px-6 py-4 text-center">{item.enabled ? "Enabled" : "Disabled"}</td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => handleUpdate(item)} className="text-blue-500 hover:text-blue-700">Edit</button>
                    </td>
                    <td className="px-6 py-4 text-center">
                    <button onClick={(e) => handleDelete(e,item)} className="text-red-500 hover:text-red-700">Delete</button>
                   
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}