import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

const ReadWritePage = () => {
  const navigate = useNavigate();

  const documents = [
    { id: 1, name: "document1.pdf", status: "green" },
    { id: 2, name: "document2.pdf", status: "green" },
    { id: 3, name: "document3.pdf", status: "gray" },
    { id: 4, name: "document3.pdf", status: "gray" },
    { id: 5, name: "document4.pdf", status: "gray" },
  ];

  return (
    <div className="max-w-3xl mx-auto bg-white border p-6 shadow-md font-sans">
      <button onClick={() => navigate(-1)} className="text-blue-600 underline mb-4">Return</button>
      <h1 className="text-3xl font-bold text-blue-900">LEONI</h1>
      <h2 className="text-xl font-bold text-blue-900 mt-2">Read/write</h2>
      <hr className="border-gray-300 my-2" />
      <div className="flex items-center justify-end text-gray-600 text-sm">
        <FaTimesCircle className="text-red-600 mr-1" />
        <span className="underline">No Homologated</span>
      </div>
      <h3 className="text-lg font-bold text-blue-900 mt-4">Equipement name</h3>
      <p className="text-gray-700 mt-2">Documents</p>
      <div className="border-t mt-2">
        {documents.map((doc, index) => (
          <div
            key={doc.id}
            className={`flex justify-between items-center p-3 border-b ${index % 2 === 0 ? 'bg-blue-100' : 'bg-white'}`}
          >
            <a href="#" className="text-blue-700 font-bold underline">{doc.name}</a>
            <div className="flex items-center space-x-8">
  <button className="bg-green-600 text-white px-4 py-1 rounded">View</button>
  <button className="bg-blue-900 text-white px-4 py-1 rounded">Sign</button>
  <span className={`w-3 h-3 rounded-full ${doc.status === 'green' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
</div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ReadWritePage;