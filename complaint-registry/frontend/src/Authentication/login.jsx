import React, { useState, useEffect } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from '../Context'
function Login() {
  const {username,setUsername}=useUser()
  const [email, setEmail] = useState(""); // Renamed to email
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      try {
        const res = await fetch('http://localhost:3000/api/protected-route', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          navigate('/dashboard');  // User is logged in
        } else {
          localStorage.removeItem('authToken');  // Token expired or invalid
        }
      } catch (err) {
        console.error('Token verification failed:', err);
      }
    };

    verifyToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true while submitting
  
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // ✅ Save token and username to localStorage
        localStorage.setItem("authToken", result.token);
        localStorage.setItem("username", result.username);
        setUsername(result.username); // store username
        navigate("/dashboard");
      } else {
        setError(result.message); // Show error message if login fails
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false); // Reset loading state after request
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto bg-gray-700 border rounded-lg shadow-md p-8">
      <div className="mb-6 text-center">
        <h2 className="text-2xl text-white font-bold">Login to ComplaintChain</h2>
        <p className="text-white mt-1">Enter your credentials to access your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md p-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full flex justify-center items-center gap-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
          {!loading && <LogIn size={18} />}
        </button>
      </form>

      <div className="mt-6 flex flex-col items-center space-y-2 text-sm text-white">
        <p>
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
        <p>
          <a href="/forgot-password" className="text-blue-500 hover:underline">
            Forgot your password?
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
