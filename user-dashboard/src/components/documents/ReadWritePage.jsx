import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";
import { FileText, Download } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const ReadWritePage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Serial number from route
  const [equipment, setEquipment] = useState(null);
  const [documents, setDocuments] = useState([]);
  const fileInputRefs = useRef({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eqRes = await axios.get(`http://localhost:8080/api/equipment/${id}`);
        setEquipment(eqRes.data);
        setDocuments(eqRes.data.documents);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to fetch equipment or documents");
      }
    };

    fetchData();
  }, [id]);

  const handleDownload = (filename) => {
    window.open(`http://localhost:8080/api/documents/download/${filename}`, "_blank");
  };

  const handleUploadClick = (docId) => {
    if (fileInputRefs.current[docId]) {
      fileInputRefs.current[docId].click();
    }
  };

  const handleFileChange = async (event, oldDoc) => {
    const file = event.target.files[0];
    const token = localStorage.getItem("token"); 
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("oldDocName", oldDoc.name);

      const res = await axios.post(
        `http://localhost:8080/api/equipment/${id}/replace-document/${oldDoc.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh updated documents
      setDocuments(res.data.documents);
      toast.success("Document replaced and archived successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload and replace document");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-3xl bg-bluedark text-white shadow-lg rounded-lg p-6">
        <button onClick={() => navigate(-1)} className="hover:underline mb-4">Return</button>
        <h2 className="text-2xl font-bold mt-2">Sign Document :</h2>
        <hr className="border-gray-300 my-2" />

        <div className="flex justify-between">
          <div className="flex mt-4 items-center">
            <h3 className="text-lg font-bold mr-4 underline">Equipement Name:</h3>
            <h2>{equipment?.name || "Loading..."}</h2>
          </div>
          <div className="flex mt-4 items-center justify-end text-white text-sm">
            <FaTimesCircle className="text-red-600 mr-1" />
            <span className="underline">Not Homologated</span>
          </div>
        </div>

        {/* Document List */}
        <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 mt-4 bg-white text-gray-800 rounded-lg shadow-md">
          {documents.length === 0 ? (
            <p className="p-4 text-center text-gray-500">No documents available.</p>
          ) : (
            documents.map((doc, index) => (
              <div
                key={doc.id}
                className={`flex items-center justify-between p-4 border-b ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100 transition`}
              >
                <div className="flex items-center gap-3">
                  <FileText className="text-blue-500" />
                  <span className="font-medium">{doc.name}</span>
                </div>
                <div className="flex gap-3 items-center">
                  <button
                    onClick={() => handleDownload(doc.name)}
                    className="p-2 flex items-center gap-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                  >
                    <Download size={18} /> Download
                  </button>

                  <button
                    onClick={() => handleUploadClick(doc.id)}
                    className="p-2 flex items-center gap-2 bg-blue-900 text-white rounded hover:bg-blue-800 transition"
                  >
                    Upload Signed doc
                  </button>

                  <input
                    type="file"
                    className="hidden"
                    ref={(el) => (fileInputRefs.current[doc.id] = el)}
                    onChange={(e) => handleFileChange(e, doc)}
                  />

                  <span
                    className={`w-3 h-3 rounded-full ${
                      doc.status === "green" ? "bg-green-500" : "bg-gray-400"
                    }`}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReadWritePage;
