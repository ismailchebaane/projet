import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";
import { FileText, Download, Eye } from "lucide-react";

const ReadWritePage = () => {
  const navigate = useNavigate();

  const documents = [
    { id: 1, name: "document1.pdf", status: "green" },
    { id: 2, name: "document2.pdf", status: "green" },
    { id: 3, name: "document3.pdf", status: "gray" },
    { id: 4, name: "document4.pdf", status: "gray" },
    { id: 5, name: "document5.pdf", status: "gray" },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-3xl bg-bluedark text-white shadow-lg rounded-lg p-6">
        
        {/* Navigation & Title */}
        <button onClick={() => navigate(-1)} className="hover:underline mb-4">Return</button>
        <h2 className="text-2xl font-bold mt-2">Read/Write</h2>
        <hr className="border-gray-300 my-2" />
       <div  className="flex  justify-between">
   <div className="flex mt-4 justify-center items-center" >
   <h3 className="text-lg  font-bold mr-4 underline ">Equipement Name : </h3> <h2>  schleuniger cc 64</h2>
     
    </div>    <div className="flex  mt-4 items-center justify-end text-white text-sm">
        <FaTimesCircle className="text-red-600 mr-1" />
        <span className="underline">Not Homologated</span>
      </div>
        </div> 

        {/* Document List */}
        <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 mt-4 bg-white text-gray-800 rounded-lg shadow-md">
          {documents.map((doc, index) => (
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
              <div className="flex gap-3">
                <button className="p-2 flex items-center gap-3 bg-green-500 text-white rounded hover:bg-green-600 transition">
                  <Eye size={18} />
                  View
                </button>
                <button className="p-2 flex items-center gap-3 bg-blue-900 text-white rounded hover:bg-blue-800 transition">
                  <span>Sign</span>
                </button>
                <div className="flex items-center justify-center">
  <span
    className={`w-3 h-3 rounded-full ${doc.status === "green" ? "bg-green-500" : "bg-gray-400"}`}
  />
</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReadWritePage;
