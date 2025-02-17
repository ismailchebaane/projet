import React from 'react'

const FirstPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen  p-6">
   

<div className="w-full bg-bluecustom max-w-md p-6 border-2 border-bluecustom rounded-lg shadow-2xl">

{/* Form Title */}
<h2 className="text-xl font-bold text-white mb-4">Enter equipement refs</h2>

{/* Input Field */}
<div className="mb-6">
<label className="block text-sm font-medium text-gray-300 mb-2">
Numéro d’immobilisation
</label>
<input 
  type="text" 
  className="w-full px-3 py-2 bg-bluecustom border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-900 font-bold text-white placeholder:text-gray-500" 
  placeholder="Enter reference"
/>  
</div>

{/* Submit Button */}
<button className="w-full text-white font-bold py-2 px-4 rounded shadow  bg-blue-900 hover:bg-blue-700 transition-all">
Submit
</button>
</div>
</div>
  )
}

export default FirstPage
