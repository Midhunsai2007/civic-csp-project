import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AIModulePreview } from './pages/ai/AIModulePreview';

// Citizen Pages
import { CitizenDashboard } from './pages/citizen/CitizenDashboard';
import { SubmitComplaint } from './pages/citizen/SubmitComplaint';
import { MyComplaints } from './pages/citizen/MyComplaints';
import { ComplaintDetails } from './pages/citizen/ComplaintDetails';

// Staff Pages
import { StaffDashboard } from './pages/staff/StaffDashboard';
import { AssignedComplaints } from './pages/staff/AssignedComplaints';
import { StaffComplaintDetails } from './pages/staff/StaffComplaintDetails';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminComplaints } from './pages/admin/AdminComplaints';
import { AdminDepartments } from './pages/admin/AdminDepartments';
import { AdminUsers } from './pages/admin/AdminUsers';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/ai-preview" element={<AIModulePreview />} />

          {/* Citizen Protected Routes */}
          <Route
            path="/citizen/dashboard"
            element={
              <ProtectedRoute allowedRoles={['citizen', 'admin']}>
                <CitizenDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/submit"
            element={
              <ProtectedRoute allowedRoles={['citizen', 'admin']}>
                <SubmitComplaint />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/my-complaints"
            element={
              <ProtectedRoute allowedRoles={['citizen', 'admin']}>
                <MyComplaints />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/complaints/:id"
            element={
              <ProtectedRoute allowedRoles={['citizen', 'staff', 'admin']}>
                <ComplaintDetails />
              </ProtectedRoute>
            }
          />

          {/* Staff Protected Routes */}
          <Route
            path="/staff/dashboard"
            element={
              <ProtectedRoute allowedRoles={['staff', 'admin']}>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/assigned"
            element={
              <ProtectedRoute allowedRoles={['staff', 'admin']}>
                <AssignedComplaints />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/complaints/:id"
            element={
              <ProtectedRoute allowedRoles={['staff', 'admin']}>
                <StaffComplaintDetails />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/complaints"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminComplaints />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/departments"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDepartments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminUsers />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
