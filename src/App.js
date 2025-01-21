import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import BusManagement from './components/bus/BusManagement';
import StudentManagement from './components/student/StudentManagement';
import NotificationList from './components/notification/NotificationList';
import Navigation from './components/common/Navigation';
import './App.css';

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated() && <Navigation />}
        <div className="container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/buses"
              element={
                <PrivateRoute>
                  <BusManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/students"
              element={
                <PrivateRoute>
                  <StudentManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <PrivateRoute>
                  <NotificationList />
                </PrivateRoute>
              }
            />
            <Route
              path="/"
              element={<Navigate to="/buses" />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
