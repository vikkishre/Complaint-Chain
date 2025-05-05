import { useState, useEffect } from "react"

const statusOptions = [
  { value: 0, label: "Pending" },
  { value: 1, label: "In Progress" },
  { value: 2, label: "Resolved" }
]

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Resolved: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
}

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString()
}

const AdminPanel = () => {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => {
    fetchAllComplaints()
  }, [])

  const fetchAllComplaints = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:3000/complaints?isAdmin=true", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      if (!response.ok) throw new Error("Failed to fetch complaints")

      const data = await response.json()

      const formatted = data.map((c) => ({
        id: c.id,
        description: c.description,
        location: c.location,
        statusString: c.status,
        status: statusOptions.find((s) => s.label === c.status)?.value ?? 0,
        timestamp: parseInt(c.timestamp) * 1000,
        owner: c.createdBy,
      }))

      formatted.sort((a, b) => b.timestamp - a.timestamp)
      setComplaints(formatted)
    } catch (error) {
      console.error(error)
      alert("Failed to load complaints")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id, newStatusValue) => {
    try {
      const newStatus = statusOptions.find((s) => s.value === newStatusValue)?.label
  
      const response = await fetch(`http://localhost:3000/complaint/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newStatus }),
      })
  
      if (!response.ok) {
        throw new Error("Failed to update complaint")
      }
  
      // Refresh complaints or update state
      setComplaints(
        complaints.map((comp) =>
          comp.id === id ? { ...comp, statusString: newStatus, status: newStatusValue } : comp
        )
      )
    } catch (err) {
      console.error("Error updating complaint:", err)
    }
  }
  

  if (loading) return <div className="text-center mt-10">Loading complaints...</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Admin Panel</h1>
      {complaints.length === 0 ? (
        <div className="text-center text-gray-600">No complaints found.</div>
      ) : (
        <div className="space-y-4">
          {complaints.map((c) => (
            <div key={c.id} className="bg-white rounded shadow p-6">
              <div className="flex flex-wrap justify-between items-center mb-3">
                <div>
                  <h2 className="font-semibold text-lg text-gray-800">Complaint #{c.id}</h2>
                  <p className="text-sm text-gray-500">{formatDate(c.timestamp)}</p>
                  <p className="text-sm text-gray-600">Submitted by: {c.owner}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[c.statusString]}`}>
                    {c.statusString}
                  </span>
                  <select
                    value={c.status}
                    onChange={(e) => handleStatusChange(c.id, parseInt(e.target.value))}
                    disabled={updatingId === c.id}
                    className="ml-2 px-2 py-1 border rounded text-sm"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  {updatingId === c.id && <div className="animate-spin h-4 w-4 border-t-2 border-blue-500 rounded-full" />}
                </div>
              </div>
              <div className="mt-2">
                <h4 className="text-sm font-medium text-gray-700">Description</h4>
                <p className="text-gray-600">{c.description}</p>
              </div>
              <div className="mt-2">
                <h4 className="text-sm font-medium text-gray-700">Location</h4>
                <p className="text-gray-600">{c.location}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminPanel
