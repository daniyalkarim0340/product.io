import React from "react";
import { Link } from "react-router-dom";


const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">MyApp</h1>
        <div className="space-x-4">
          <Link to="/login" className="hover:underline">Login</Link>
          <Link to="/register" className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-200">
            Register
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-20">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Welcome to Product Management System
        </h2>
        <p className="text-gray-600 max-w-xl mb-8">
          Manage your products easily. Add, edit, delete and track your inventory
          in a clean and simple dashboard.
        </p>

        <div className="space-x-4">
          <Link
            to="/dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </Link>

          <Link
            to="/register"
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-10 pb-20">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h3 className="text-xl font-semibold mb-3">Add Products</h3>
          <p className="text-gray-600">
            Easily add new products to your system.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h3 className="text-xl font-semibold mb-3">Manage Inventory</h3>
          <p className="text-gray-600">
            Keep track of stock and product updates.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h3 className="text-xl font-semibold mb-3">Secure Access</h3>
          <p className="text-gray-600">
            Protected routes ensure only logged-in users can manage products.
          </p>
        </div>
      </div>

    </div>
  );
};

export default Home;