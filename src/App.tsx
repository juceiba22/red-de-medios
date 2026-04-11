import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MockDBProvider, useMockDB } from './lib/store';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Checkout from './pages/Checkout';
import Validator from './pages/Validator';
import Layout from './components/Layout';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useMockDB();
  if (!currentUser) return <Navigate to="/" />;
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="validator" element={<Validator />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <MockDBProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </MockDBProvider>
  );
}
