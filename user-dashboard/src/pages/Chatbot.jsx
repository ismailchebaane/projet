import React, { useState } from "react";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);  // New state for loading

  const sendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);  // Start loading

    const res = await fetch("http://localhost:8080/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ query: input }),
    });

    const data = await res.json();
    console.log(data);  // Check what data contains
    setChat([...chat, { user: input, bot: data.answer }]);  // Use data.answer
    setInput("");  // Clear input after sending
    setLoading(false);  // Stop loading
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white border border-gray-300 rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 h-96 overflow-y-auto space-y-3">
        {/* Chat history */}
        {chat.map((msg, i) => (
          <div key={i} className="flex flex-col gap-2">
            {/* User message */}
            {msg.user && (
              <div className="flex justify-end w-full">
                <div className="bg-blue-600 text-white text-sm p-3 rounded-lg max-w-[80%] break-words shadow-md">
                  {msg.user}
                </div>
              </div>
            )}
            {/* Bot message */}
            {msg.bot && (
              <div className="flex justify-start w-full">
                <div className="bg-gray-100 text-gray-700 text-sm p-3 rounded-lg max-w-[80%] break-words shadow-md">
                  {msg.bot}
                </div>
              </div>
            )}
          </div>
        ))}
        
        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center mt-2">
            <div className="animate-spin h-5 w-5 border-4 border-blue-600 border-t-transparent rounded-full"></div>  {/* Spinner */}
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="p-4 flex gap-3 border-t border-gray-300 bg-gray-50">
        <input
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400 transition duration-200"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about equipment..."
          disabled={loading}  // Disable input while loading
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg transition duration-300 ease-in-out transform hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}  // Disable button while loading
        >
          Send
        </button>
      </div>
    </div>
  );
}
