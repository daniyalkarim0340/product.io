import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Register from "../components/register";
import Login from "../components/login";
import Dashboard from "../components/dashbaord";
import Product from "../components/product";
import Chat from "../components/chat";
import GoogleAuth from "../components/googleAuth";
import ProtectedRoute from "../authication";

import Home from "../components/homepage/homepage";

const Routing = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth" element={<GoogleAuth />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Product />} />
          <Route path="/chat" element={<Chat />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>
    </Router>
  );
};

export default Routing;