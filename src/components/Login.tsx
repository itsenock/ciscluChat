import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!name.trim() || !id.trim())
      return alert("Please enter both name and ID");
    localStorage.setItem("chat-user", JSON.stringify({ name, id }));
    navigate("/chat");
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#f0f8ff] dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-80 space-y-4">
        <h2 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-100">
          Join Chat
        </h2>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 rounded border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
        />
        <input
          type="text"
          placeholder="Username"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="w-full px-3 py-2 rounded border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Enter Chat
        </button>
      </div>
    </div>
  );
};
