import axios from 'axios';
import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

export default function EquipmentForm() {
  const [formValues, setFormValues] = useState({
    name: "",
    serialNumber: "",
    immobilizationNumber: "",
    plant: "",
    process: "",
    state: "",
    description: "",
    type: "",
    files: [],
  });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleFileUpload = (event) => {
    const newFiles = Array.from(event.target.files);
    setFormValues({ ...formValues, files: [...formValues.files, ...newFiles] });
  };

  const handleRemoveFile = (fileToRemove) => {
    setFormValues({
      ...formValues,
      files: formValues.files.filter((file) => file !== fileToRemove),
    });
  };

  const handleClear = () => {
    setFormValues({
      name: "",
      serialNumber: "",
      immobilizationNumber: "",
      plant: "",
      process: "",
      state: "",
      description: "",
      type: "",
      files: [],
    });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(formValues).forEach((key) => {
      if (key !== 'files') formData.append(key, formValues[key]);
    });
    formValues.files.forEach((file) => {
      formData.append('documents', file);
    });
  
    try {
      const response = await axios.post('http://localhost:8080/api/equipment/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        toast.success("✅ Equipment added successfully!");
        handleClear(); // Clear form on success
      }
    } catch (error) {
      console.error(error);
  
      // Custom error message from backend
      if (error.response && error.response.data) {
        const msg = error.response.data.message || error.response.data;
        if (msg.includes("already exists")) {
          toast.error("❌ Equipment with this serial number already exists.");
        } else {
          toast.error(`❌ ${msg}`);
        }
      } else {
        toast.error("❌ Failed to add equipment.");
      }
    }
  };
  
  return (
    <div className="max-w-6xl mx-auto p-6 mt-12 border rounded-lg shadow-lg bg-white">
     <button 
    onClick={() => navigate(-1)} 
    className="text-blue-700 underline text-sm"
  >
    Return
  </button>
      <h1 className="text-4xl font-bold text-blue-900 mt-2">LEONI</h1>
      <hr className="my-4 border-gray-300" />

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Equipment Name" name="name" value={formValues.name} onChange={handleInputChange} />
          <Input label="Serial Number" name="serialNumber" value={formValues.serialNumber} onChange={handleInputChange} />
          <Input label="Immobilization Number" name="immobilizationNumber" value={formValues.immobilizationNumber} onChange={handleInputChange} />
          
          <Select label="Plant" name="plant" value={formValues.plant} onChange={handleInputChange} options={["MN", "MS1", "MS2", "MS3", "SB",  "LTN3_A", "LTN3_B", "LTN3_C", "LTN3_D",    "LTN1", "PLTN4", "LTN2", "MH_1", "MH_2"]} />
          <Select label="Process " name="process" value={formValues.process} onChange={handleInputChange} options={[ "Cutting", "USS", "Taping", "Crimping", "Striping", 
"Soldering", "Shrinking", "Assembly", "Testing", "Foaming"]} />
          <Select label="State" name="state" value={formValues.state} onChange={handleInputChange} options={['Validated', 'Pending']} />
          
          <Input label="Type" name="type" value={formValues.type} onChange={handleInputChange} />
          <TextArea label="Description" name="description" value={formValues.description} onChange={handleInputChange} />
        </div>

        {/* File Upload Field */}
        <div className="mt-6">
          <FileUpload
            label="Upload Document"
            onChange={handleFileUpload}
            files={formValues.files}
            onRemove={handleRemoveFile}
          />
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button type="submit" className="px-6 py-2 border border-green-600 text-green-700 rounded hover:bg-green-50">
            Save
          </button>
          <button type="button" onClick={handleClear} className="px-6 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50">
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

// Reusable Input component
const Input = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-gray-600 mb-1" htmlFor={name}>{label}</label>
    <input
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      type="text"
      className="w-full px-4 py-2 border rounded-full text-gray-700 focus:ring focus:outline-none"
    />
  </div>
);

// Reusable Select component
const Select = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-gray-600 mb-1" htmlFor={name}>{label}</label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 border rounded-full text-gray-700 appearance-none focus:ring focus:outline-none"
    >
      <option value="">Select {label}</option>
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

// Reusable TextArea component
const TextArea = ({ label, name, value, onChange }) => (
  <div className="md:col-span-3">
    <label className="block text-gray-600 mb-1" htmlFor={name}>{label}</label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      rows="4"
      className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring focus:outline-none"
    />
  </div>
);

// Reusable FileUpload component
const FileUpload = ({ label, onChange, files = [], onRemove }) => (
  <div className="border-2 border-dashed border-gray-400 p-4 rounded-lg">
    <div className="flex flex-col items-center justify-center text-center min-h-[100px]">
      <UploadCloud className="w-8 h-8 text-blue-700" />
      <p className="mt-2 text-sm font-medium text-gray-700">{label}</p>
      <label className="text-blue-700 underline cursor-pointer mt-2">
        Upload a file
        <input type="file" onChange={onChange} className="hidden" />
      </label>
    </div>

    {files.length > 0 && (
      <div className="mt-4">
        <p className="text-sm font-semibold text-gray-600 mb-2">Uploaded Files:</p>
        <ul className="space-y-1 text-sm text-gray-800">
          {files.map((file, index) => (
            <li key={index} className="flex items-center justify-between bg-gray-50 px-3 py-1 rounded border">
              <span>{file.name}</span>
              <button
                type="button"
                onClick={() => onRemove(file)}
                className="text-red-500 hover:text-red-700 text-xs font-medium"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);
