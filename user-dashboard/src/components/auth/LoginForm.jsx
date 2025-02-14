import { useState } from "react";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    // Dummy authentication check
    if (username !== "admin" || password !== "password") {
      setError(true);
    } else {
      setError(false);
      alert("Login successful!");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="bg-blue-900 p-8 rounded-lg shadow-lg text-white w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Who are you?</h2>
        <form onSubmit={handleLogin}>
          <label className="block mb-2">User Name</label>
          <input
            type="text"
            placeholder="Enter User Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 mb-4 text-black rounded"
          />

          <label className="block mb-2">Password/ matricule</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-4 text-black rounded"
          />

          {error && (
            <p className=" underline text-center font-bold mb-4">
              Sorry, your User Name or Password was incorrect. Please try again!
            </p>
          )}

          <button className="w-full bg-green-600 py-2 text-white font-bold rounded hover:bg-green-700">
            login
          </button>
        </form>

        <p className="text-center mt-4">
          <a href="/signup" className="text-white underline">
            You don’t have an account? Sign Up
          </a>
        </p>
        <p className="text-center mt-2">
          <a href="/" className="text-white underline">
            Return
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
