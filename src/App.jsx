import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { PrivateRoute, AdminRoute } from './components/auth/RouteGuards';

import Login from './pages/Login';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Governance from './pages/Governance';
import NeedsAssessment from './pages/NeedsAssessment';
import Tasks from './pages/Tasks';
import Volunteers from './pages/Volunteers';
import Analytics from './pages/Analytics';
import Insights from './pages/Insights';

import './styles/globals.css';



export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/dashboard" element={
            <PrivateRoute><Dashboard /></PrivateRoute>
          } />
          
          <Route path="/governance" element={
            <AdminRoute><Governance /></AdminRoute>
          } />
          
          <Route path="/needs" element={
            <PrivateRoute><NeedsAssessment /></PrivateRoute>
          } />
          
          <Route path="/tasks" element={
            <PrivateRoute><Tasks /></PrivateRoute>
          } />
          
          <Route path="/volunteers" element={
            <PrivateRoute><Volunteers /></PrivateRoute>
          } />
          
          <Route path="/analytics" element={
            <PrivateRoute><Analytics /></PrivateRoute>
          } />
          
          <Route path="/insights" element={
            <PrivateRoute><Insights /></PrivateRoute>
          } />

          <Route path="/" element={<Landing />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="bottom-right" toastOptions={{
          className: 'font-manrope text-sm',
          duration: 3000,
        }} />
      </BrowserRouter>
    </AuthProvider>
  );
}
