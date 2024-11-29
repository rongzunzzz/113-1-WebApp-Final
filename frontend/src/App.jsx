import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateTest from './pages/CreateTest';
import TakeTest from './pages/TakeTest';
import TestResults from './pages/TestResults';
import TestResult from './pages/TestResult';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import Home from './pages/Home';

const PsychologyTestApp = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-custom-primary">
          <Navbar />
          <main className="flex-1 w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/create"
                element={
                  <ProtectedRoute>
                    <CreateTest />
                  </ProtectedRoute>
                }
              />
              <Route path="/tests" element={<TakeTest />} />
              <Route
                path="/results"
                element={
                  <ProtectedRoute>
                    <TestResults />
                  </ProtectedRoute>
                }
              />
              <Route path="/test/:id" element={<TakeTest />} />
              <Route path="/test/:id/result" element={<TestResult />} />
            </Routes>
          </main>

          <footer className="w-full bg-custom-primary py-8 border-t border-gray-200">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-center text-gray-600">
                © {new Date().getFullYear()} Moniclassroom. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default PsychologyTestApp;
