import React from "react";
import { useNavigate } from "react-router-dom";

const ReadOnlyPage = () => {
  const navigate = useNavigate();

  const documents = [
    { id: 1, name: "document1.pdf" },
    { id: 2, name: "document2.pdf" },
    { id: 3, name: "document3.pdf" },
    { id: 4, name: "document4.pdf" },
    { id: 5, name: "document5.pdf" },
    { id: 6, name: "document6.pdf" },
    { id: 7, name: "document7.pdf" },
    { id: 8, name: "document8.pdf" },
  ];

  return (
    <div className="max-w-3xl mx-auto bg-white border p-6 shadow-md font-sans">
      <button onClick={() => navigate(-1)} className="text-blue-600 underline mb-4">Return</button>
      <h1 className="text-3xl font-bold text-blue-900">LEONI</h1>
      <h2 className="text-xl font-bold text-blue-900 mt-2">Read_only</h2>
      <hr className="border-gray-300 my-2" />
      <h3 className="text-lg font-bold text-blue-900 mt-4">Equipement name</h3>
      <p className="text-gray-700 mt-2">Documents</p>
      <div className="border-t mt-2">
        {documents.map((doc, index) => (
          <div
            key={doc.id}
            className={`flex justify-between items-center p-3 border-b ${index % 2 === 0 ? 'bg-blue-100' : 'bg-white'}`}
          >
            <a href="#" className="text-blue-700 font-bold underline">{doc.name}</a>
            <button className="bg-green-600 text-white px-4 py-1 rounded">View</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReadOnlyPage;