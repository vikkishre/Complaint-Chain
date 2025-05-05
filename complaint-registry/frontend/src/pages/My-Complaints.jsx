import React, { useEffect, useState } from 'react';
import { useUser } from '../Context';

function My_Complaints() {
  const { username } = useUser();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await fetch(`http://localhost:3000/complaints?username=${username}&isAdmin=false`);
        const data = await res.json();
        setComplaints(data);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchComplaints();
    }
  }, [username]);

  if (loading) return <p>Loading complaints...</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Complaints</h2>
      {complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Location</th>
              <th className="border px-4 py-2">Type</th>
              <th className="border px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c.id}>
                <td className="border px-4 py-2">{c.id}</td>
                <td className="border px-4 py-2">{c.description}</td>
                <td className="border px-4 py-2">{c.location}</td>
                <td className="border px-4 py-2">{c.complaintType}</td>
                <td className="border px-4 py-2">{c.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default My_Complaints;
