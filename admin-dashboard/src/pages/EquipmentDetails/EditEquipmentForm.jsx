import React, { useState, useEffect } from "react";
import axios from "axios";
import { UploadCloud } from "lucide-react";
import toast from "react-hot-toast";

const EditEquipmentForm = ({ equipment, onSave, onCancel }) => {
  const token = localStorage.getItem("token");

  const [formValues, setFormValues] = useState({
    name: "",
    serialNumber: "",
    immobilizationNumber: "",
    plant: "",
    process: "",
    state: "",
    description: "",
    type: "",
    newFiles: [],
    existingDocs: [],
  });

  useEffect(() => {
    if (equipment) {
      setFormValues({
        ...equipment,
        newFiles: [],
        existingDocs: equipment.documents || [],
        
      });
    }
  }, [equipment]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    setFormValues((prev) => ({
      ...prev,
      newFiles: [...prev.newFiles, ...newFiles],
    }));
  };

  const handleRemoveNewFile = (fileToRemove) => {
    setFormValues((prev) => ({
      ...prev,
      newFiles: prev.newFiles.filter((file) => file !== fileToRemove),
    }));
  };

  const handleRemoveExistingDoc = async (docToRemove) => {
    console.log(docToRemove.id)
    try {
      const response = await axios.delete(
        `http://localhost:8080/api/documents/${docToRemove.id}`, // Assuming doc has an `id` field
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        toast.success(`🗑️ Deleted ${docToRemove.name}`);
        setFormValues((prev) => ({
          ...prev,
          existingDocs: prev.existingDocs.filter((doc) => doc.id !== docToRemove.id),
        }));
      } else {
        throw new Error("Deletion failed");
      }
    } catch (error) {
      toast.error(`❌ Failed to delete ${docToRemove.name}`);
      console.error("Error deleting document:", error);
    }
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
      newFiles: [],
      existingDocs: [],
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formDataToSend = new FormData();
  
    // Add basic fields
    Object.entries(formValues).forEach(([key, value]) => {
      if (["newFiles", "existingDocs"].includes(key)) return;
      formDataToSend.append(key, value);
    });
  
    // Include equipment ID if not already part of formValues
    if (equipment?.id) {
      formDataToSend.append("id", equipment.id);
    }
  
    // Add retained existing document names or IDs
    formDataToSend.append(
      "retainedDocs",
      JSON.stringify(formValues.existingDocs.map(doc => doc.name)) // or doc.id
    );
  
    // Add new files
    formValues.newFiles.forEach((file) => {
      formDataToSend.append("documents", file);
    });
  console.log(formValues)
    try {
      const response = await axios.post(
       "http://localhost:8080/api/equipment/update/"+formValues.id,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        toast.success("✅ Equipment updated successfully!");
        onSave?.(); // ✅ this triggers refetch in parent
      }
    } catch (error) {
      const msg =
        error.response?.data?.message || "❌ Failed to update equipment.";
      toast.error(msg);
    }
  };

  
  

  return (
    <form onSubmit={handleSubmit} className="px-4 rounded-xl" encType="multipart/form-data">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input label="Equipment Name" name="name" value={formValues.name} onChange={handleInputChange} />
        <Input label="Serial Number" name="serialNumber" value={formValues.serialNumber} onChange={handleInputChange} />
        <Input label="Immobilization Number" name="immobilizationNumber" value={formValues.immobilizationNumber} onChange={handleInputChange} />
        <Select label="Plant" name="plant" value={formValues.plant} onChange={handleInputChange} options={["MN", "MS1", "MS2", "MS3", "SB", "LTN3_A", "LTN3_B", "LTN3_C", "LTN3_D", "LTN1", "PLTN4", "LTN2", "MH_1", "MH_2"]} />
        <Select label="Process" name="process" value={formValues.process} onChange={handleInputChange} options={["Cutting", "USS", "Taping", "Crimping", "Striping", "Soldering", "Shrinking", "Assembly", "Testing", "Foaming"]} />
        <Select label="State" name="state" value={formValues.state} onChange={handleInputChange} options={['Validated', 'Pending']} />
        <Input label="Type" name="type" value={formValues.type} onChange={handleInputChange} />
        <TextArea label="Description" name="description" value={formValues.description} onChange={handleInputChange} />
      </div>

      <div className="mt-6">
        <FileUpload
          label="Upload a file"
          onChange={handleFileUpload}
          files={formValues.newFiles}
          onRemove={handleRemoveNewFile}
        />

        {/* Existing Documents */}
        {formValues.existingDocs.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-semibold text-gray-600 mb-2">Existing Documents:</p>
            <ul className="space-y-1 text-sm text-gray-800">
              {formValues.existingDocs.map((doc, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 px-3 py-1 rounded border">
                  <a href={doc.filePath} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">
                    {doc.name}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingDoc(doc)}
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

      <div className="flex justify-end gap-4 mt-6">
        <button   type="submit" className="px-6 py-2 border border-green-600 text-green-700 rounded hover:bg-green-50">
          Save
        </button>
        <button type="button" onClick={handleClear} className="px-6 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50">
          Clear
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-6 py-2 border border-gray-400 text-gray-600 rounded hover:bg-gray-100">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

// Reusable components remain the same
const Input = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-gray-600 mb-1" htmlFor={name}>{label}</label>
    <input id={name} name={name} value={value} onChange={onChange} type="text"
      className="w-full px-4 py-2 border rounded-full text-gray-700 focus:ring focus:outline-none" />
  </div>
);

const Select = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-gray-600 mb-1" htmlFor={name}>{label}</label>
    <select id={name} name={name} value={value} onChange={onChange}
      className="w-full px-4 py-2 border rounded-full text-gray-700 appearance-none focus:ring focus:outline-none">
      <option value="">Select {label}</option>
      {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

const TextArea = ({ label, name, value, onChange }) => (
  <div className="md:col-span-3">
    <label className="block text-gray-600 mb-1" htmlFor={name}>{label}</label>
    <textarea id={name} name={name} value={value} onChange={onChange} rows="4"
      className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring focus:outline-none" />
  </div>
);

const FileUpload = ({ label, onChange, files = [], onRemove }) => (
  <div className="border-2 border-dashed border-gray-400 p-4 rounded-lg">
    <div className="flex flex-col items-center justify-center text-center min-h-[100px]">
      <UploadCloud className="w-8 h-8 text-blue-700" />
      <p className="mt-2 text-sm font-medium text-gray-700">{label}</p>
      <label className="text-blue-700 underline cursor-pointer mt-2">
        Upload a file
        <input type="file" onChange={onChange} className="hidden" multiple />
      </label>
    </div>

    {files.length > 0 && (
      <div className="mt-4">
        <p className="text-sm font-semibold text-gray-600 mb-2">New Files:</p>
        <ul className="space-y-1 text-sm text-gray-800">
          {files.map((file, index) => (
            <li key={index} className="flex items-center justify-between bg-gray-50 px-3 py-1 rounded border">
              <span>{file.name}</span>
              <button type="button" onClick={() => onRemove(file)}
                className="text-red-500 hover:text-red-700 text-xs font-medium">Remove</button>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

export default EditEquipmentForm;
