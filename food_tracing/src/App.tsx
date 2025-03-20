import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ProductRegistration from "./pages/ProductRegistration";
import ProducerRegistration from "./pages/ProducerRegistration";
import BorderCrossing from "./pages/BorderCrossing";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("userRole");
    setIsAuthenticated(!!user); // Set true if user exists
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Prevent rendering until auth check is done
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/login" replace />} />
          
          <Route
            path="product-registration"
            element={
              <ProtectedRoute>
                <ProductRegistration />
              </ProtectedRoute>
            }
          />
          <Route
            path="producer-registration"
            element={
              <ProtectedRoute>
                <ProducerRegistration />
              </ProtectedRoute>
            }
          />
          <Route
            path="border-crossing"
            element={
              <ProtectedRoute>
                <BorderCrossing />
              </ProtectedRoute>
            }
          />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
