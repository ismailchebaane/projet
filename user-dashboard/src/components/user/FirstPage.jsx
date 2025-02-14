import React from 'react'

const FirstPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
    <h1 className="text-4xl items-start mr-[600px] font-bold text-blue-900 mb-12">LEONI</h1>

<div className="w-full max-w-md p-6 border-2 border-blue-900 rounded-lg shadow-md">
{/* Leoni Logo */}

{/* Form Title */}
<h2 className="text-xl font-bold text-blue-900 mb-4">Enter equipement refs</h2>

{/* Input Field */}
<div className="mb-6">
<label className="block text-sm font-medium text-gray-700 mb-2">
Numéro d’immobilisation
</label>
<input 
type="text" 
className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-900"
placeholder="Enter reference"
/>
</div>

{/* Submit Button */}
<button className="w-full bg-blue-900 text-white font-bold py-2 px-4 rounded shadow hover:bg-blue-700 transition-all">
Submit
</button>
</div>
</div>
  )
}

export default FirstPage
