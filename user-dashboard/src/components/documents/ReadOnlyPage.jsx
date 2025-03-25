import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Download, Eye } from "lucide-react";

const DocumentList = () => {
  const navigate = useNavigate();

  const documents = [
    { id: 1, name: "document1.pdf" ,url:"document1.pdf"},
    { id: 2, name: "document2.pdf" },
    { id: 3, name: "document3.pdf" },
    { id: 4, name: "document4.pdf" },
    { id: 5, name: "document5.pdf" },
    { id: 6, name: "document6.pdf" },
    { id: 7, name: "document7.pdf" },
    { id: 8, name: "document8.pdf" },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-3xl bg-bluedark text-white shadow-lg rounded-lg p-6">
        
        {/* Navigation & Title */}
        <button onClick={() => navigate(-1)} className="hover:underline mb-4">Return</button>
        <h2 className="text-2xl font-bold mt-2">Read Only</h2>
        <hr className="border-gray-300 my-2" />
        <div className="flex mt-4  items-center" >
   <h3 className="text-lg  font-bold mr-4 underline ">Equipement Name : </h3> <h2>  schleuniger cc 64</h2>
     
    </div> 

      
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
                {/* Download Button */}
                <a
                  href={doc.url}
                  download
                  className="p-2 flex gap-3 cursor-pointer bg-green-500 text-white rounded hover:bg-green-600 transition"
                >
                  Download <Download size={18} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentList;
