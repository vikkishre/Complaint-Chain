import React from "react";
import Navbar from "./navbar";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div className="h-screen bg-white dark:bg-gray-900 flex flex-col">
      <Navbar />

      <div className="flex justify-end px-6 pt-4">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
      </div>

      <main className="flex-1 p-6 max-w-5xl mx-auto overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Dashboard
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          Welcome to your dashboard! Use the navigation bar to register a complaint or track existing ones.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Register Complaint
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Submit a new complaint and ensure it's securely recorded.
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              View Complaints
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Track and review the status of your past complaints.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
