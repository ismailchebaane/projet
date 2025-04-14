import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Paperclip } from "lucide-react";
import EditEquipmentForm from "./EditEquipmentForm";

const EquipmentDetails = () => {
  const { id } = useParams();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEquipment = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`http://localhost:8080/api/equipment/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch equipment");
        const data = await response.json();
        setEquipment(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, [id]);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:8080/api/equipment/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to refetch equipment");
      const data = await response.json();
      setEquipment(data);
      setEditing(false);
    } catch (err) {
      console.error("Update refetch failed:", err);
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-gray-600">Loading...</div>;
  }

  if (!equipment) {
    return <div className="text-center mt-20 text-red-600">Equipment not found</div>;
  }

  return (
    <div className="min-h-screen bg-white flex justify-center pt-20">
      <div className="w-full max-w-4xl border-l border-r border-gray-300">
        <div className="flex items-center justify-between px-4">
          <button onClick={() => navigate(-1)} className="text-blue-700 underline text-sm">
            Return
          </button>
          {!editing && (
            <button
              className="border border-gray-400 px-4 py-1 rounded text-gray-700 hover:bg-gray-100"
              onClick={() => setEditing(true)}
            >
              Edit
            </button>
          )}
        </div>

        <div className="px-4 mt-2">
          <h1 className="text-5xl font-bold text-blue-900">LEONI</h1>
        </div>

        <hr className="mt-4 border-gray-300" />

        {editing ? (
          <EditEquipmentForm
            equipment={equipment}
            onSave={handleSave}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <div className="px-4 divide-y divide-gray-300 mt-2">
            <DetailRow label="Equipment Name" value={equipment.name} />
            <DetailRow label="Serial Number" value={equipment.serialNumber} />
            <DetailRow label="Immobilization Number" value={equipment.immobilizationNumber} />
            <DetailRow label="Plant" value={equipment.plant} />
            <DetailRow label="Process" value={equipment.process} />
            <div className="py-4">
              <div className="text-gray-600 font-semibold">Description</div>
              <div className="mt-2 border border-gray-300 rounded-xl p-2 space-y-2">
                {equipment.description}
              </div>
            </div>

            <div className="py-4">
              <div className="text-gray-600 font-semibold">Read/write docs</div>
              <div className="mt-2 border border-gray-300 rounded-xl w-fit p-2 space-y-2">
                {equipment.documents?.map((doc, index) => (
                  <DocLink key={index} name={doc.name} url={doc.filePath} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-3">
    <div className="text-gray-600 font-semibold">{label}</div>
    <div>{value}</div>
  </div>
);

const DocLink = ({ name, url }) => (
  <a
    href={url || "#"}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center space-x-2 hover:underline cursor-pointer"
  >
    <Paperclip className="w-4 h-4 text-gray-600" />
    <span>{name}</span>
  </a>
);

export default EquipmentDetails;
