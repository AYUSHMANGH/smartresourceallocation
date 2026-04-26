import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { PrivateRoute, AdminRoute } from './components/auth/RouteGuards';
import { AnimatePresence, motion } from 'framer-motion';

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

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } }
};

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
    >
      {children}
    </motion.div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={
          <PageWrapper><Login /></PageWrapper>
        } />

        <Route path="/dashboard" element={
          <PrivateRoute><PageWrapper><Dashboard /></PageWrapper></PrivateRoute>
        } />

        <Route path="/governance/*" element={
          <AdminRoute><PageWrapper><Governance /></PageWrapper></AdminRoute>
        } />

        <Route path="/needs" element={
          <PrivateRoute><PageWrapper><NeedsAssessment /></PageWrapper></PrivateRoute>
        } />

        <Route path="/tasks" element={
          <PrivateRoute><PageWrapper><Tasks /></PageWrapper></PrivateRoute>
        } />

        <Route path="/volunteers" element={
          <PrivateRoute><PageWrapper><Volunteers /></PageWrapper></PrivateRoute>
        } />

        <Route path="/analytics" element={
          <PrivateRoute><PageWrapper><Analytics /></PageWrapper></PrivateRoute>
        } />

        <Route path="/insights" element={
          <PrivateRoute><PageWrapper><Insights /></PageWrapper></PrivateRoute>
        } />

        <Route path="/" element={
          <PageWrapper><Landing /></PageWrapper>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AnimatedRoutes />
        <Toaster position="bottom-right" toastOptions={{
          className: 'font-manrope text-sm',
          duration: 3000,
        }} />
      </BrowserRouter>
    </AuthProvider>
  );
}
