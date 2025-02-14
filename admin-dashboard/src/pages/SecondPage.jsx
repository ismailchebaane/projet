import { useNavigate } from "react-router-dom";


const SecondPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <h1 className="text-4xl  pb-16 sm:mr-0 md:mr-0 lg:mr-100 font-bold text-blue-900 mb-6">LEONI</h1>
      <div className="border border-blue-900 p-10 rounded-lg shadow-md w-[400px] flex flex-col items-center">
        <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">
          Admin Dashboards
        </h2>
        <button
          onClick={() => navigate("/equipments")}
          className="w-64 bg-blue-900 cursor-pointer text-white font-bold py-3 px-6 rounded-md mb-4 shadow-md hover:bg-blue-800 transition-all"
        >
          Equipements
        </button>
        <button
          onClick={() => navigate("/employees")}
          className="w-64 cursor-pointer bg-blue-900 text-white font-bold py-3 px-6 rounded-md shadow-md hover:bg-blue-800 transition-all"
        >
          Workers
        </button>
      </div>
    </div>
  );
};

export default SecondPage;
