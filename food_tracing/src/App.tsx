import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProducerRegistration from './pages/ProducerRegistration';
import BorderCrossing from './pages/BorderCrossing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Layout from './components/Layout';
import ProductRegistration from './pages/ProductRegistration';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="producer-registration" element={<ProducerRegistration />} />
          <Route path="product-registration" element={<ProductRegistration />} />
          <Route path="border-crossing" element={<BorderCrossing />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;