import { useLocation, Link } from "react-router-dom"

const Navbar = () => {
  const location = useLocation()

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-gray-800 dark:text-white">ComplaintChain</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/register-complaint"
              className={`text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === "/register-complaint" ? "bg-gray-100 dark:bg-gray-700" : ""
              }`}
            >
              Register Complaint
            </Link>
            <Link
              to="/my-complaints"
              className={`text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === "/my-complaints" ? "bg-gray-100 dark:bg-gray-700" : ""
              }`}
            >
              My Complaints
            </Link>
            {/* <Link
              to="/admin"
              className={`text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === "/admin" ? "bg-gray-100 dark:bg-gray-700" : ""
              }`}
            >
              Admin Panel
            </Link> */}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
