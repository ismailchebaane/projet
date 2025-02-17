import { useState } from "react";

const LoginForm = () => {
  const [adminName, setAdminName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Check if fields are empty
    if (!adminName || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch("https://your-backend-url.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminName, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Login successful!");
        // Redirect or handle successful login
      } else {
        setError(data.message || "Invalid username or password.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <h1 className="text-4xl pb-16 sm:mr-0 md:mr-0 lg:mr-100 font-bold text-blue-900 mb-6">LEONI</h1>
      <div className="bg-gray-100 border border-blue-900 p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-blue-900 mb-4 text-center">
          Admin Authentification
        </h2>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-blue-900">Admin's username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={adminName}
            onChange={(e) => setAdminName(e.target.value)}
            required
            className="w-full p-2 mb-4 rounded border border-gray-300"
          />

          <label className="block mb-2 text-blue-900">Password</label>
          <input
            type="password"
            placeholder="***********  "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 mb-4 rounded border border-gray-300"
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded shadow hover:bg-green-700 transition-all"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
