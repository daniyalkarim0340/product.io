import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Register from "../components/register/index";
import Login from "../components/login/index";
import Dashboard from "../components/dashbaord/index";
import Product from "../components/product/index";
import ProtectedRoute from "../authication/index";
import Home from "../components/homepage/homepage";
import Chat from "../components/chat";
import GoogleAuth from "../components/googleAuth";

const Routing = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/google" element={<GoogleAuth/>} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Product />} />
          <Route path="/chat" element={<Chat />} />

        </Route>
      </Routes>
    </Router>
  );
};

export default Routing;
