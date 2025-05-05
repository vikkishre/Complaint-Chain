import { useState } from "react"; 
import { useUser } from "../Context";
const RegisterComplaint = () => {
  const {username}=useUser()
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [complaintType, setComplaintType] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [txHash, setTxHash] = useState("");

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        setLatitude(lat);
        setLongitude(lng);
        setLocation(`Lat: ${lat}, Lng: ${lng}`);
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Could not get your location");
      }
    );
  };



const handleSubmit = async (e) => {
  e.preventDefault();

  if (!description || !location || !complaintType) {
    alert("Please fill in all fields");
    return;
  }

  try {
    setIsSubmitting(true);

    const response = await fetch("http://localhost:3000/complaint", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description,
        location,
        complaintType,
        username, // Include username here
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setTxHash(data.statusHash);
      alert(`✅ Complaint registered.\n🧾 Status Hash: ${data.statusHash}`);
      setDescription("");
      setLocation("");
      setComplaintType("");
    } else {
      alert("❌ Failed to register complaint.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("⚠️ Something went wrong.");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="w-full max-w-md mx-auto mt-[100px] bg-gray-700 border rounded-lg shadow-md p-8 ">
      <h2 className="text-2xl font-bold text-center text-white mb-6">📨 Register Complaint</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Complaint Type */}
        <div>
          <label className="block mb-1 text-sm font-medium text-white">Complaint Type</label>
          <select
            value={complaintType}
            onChange={(e) => setComplaintType(e.target.value)}
            disabled={isSubmitting}
            required
            className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select type</option>
            <option value="road">Road Issue</option>
            <option value="electricity">Electricity</option>
            <option value="water">Water Supply</option>
            <option value="crime">Crime</option>
            <option value="sanitation">Sanitation</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block mb-1 text-sm font-medium  text-white">Description</label>
          <textarea
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            required
            placeholder="Describe the issue"
            className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Location Input */}
        <div>
          <label className="block mb-1 text-sm font-medium  text-white">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={isSubmitting}
            required
            placeholder="Enter or use current location"
            className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleGetLocation}
            className="text-blue-400 text-sm mt-1 hover:underline"
          >
            📍 Use Current Location
          </button>
          {latitude && longitude && (
            <p className="text-xs text-gray-400 mt-1">Detected: {latitude}, {longitude}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 text-center font-semibold rounded-md transition ${
            isSubmitting
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit Complaint"}
        </button>
      </form>

      {/* Status Hash */}
      {txHash && (
        <div className="mt-4 text-sm text-green-400 break-words">
          ✅ Status Hash:<br />
          <code className="text-gray-200">{txHash}</code>
        </div>
      )}
    </div>
  );
};

export default RegisterComplaint;
