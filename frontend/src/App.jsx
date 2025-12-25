import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./context/AuthContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import Navbar from "./components/Navbar.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Requests from "./pages/Requests.jsx";
import Search from "./pages/Search.jsx";
import MyProfile from "./pages/MyProfile.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import Matches from "./pages/Matches.jsx";

import MessagesList from "./pages/MessagesList.jsx";
import ChatWindow from "./pages/ChatWindow.jsx";

import { useLocation } from "react-router-dom";

function Layout({ children }) {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/register"];
  const showNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" reverseOrder={false} />
      {showNavbar && <Navbar />}
      {children}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Layout>
            <Routes>
              {/* ... routes ... */}
              {/* PUBLIC ROUTES */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* PROTECTED ROUTES */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />

              <Route
                path="/requests"
                element={
                  <PrivateRoute>
                    <Requests />
                  </PrivateRoute>
                }
              />

              <Route
                path="/search"
                element={
                  <PrivateRoute>
                    <Search />
                  </PrivateRoute>
                }
              />

              <Route
                path="/matches"
                element={
                  <PrivateRoute>
                    <Matches />
                  </PrivateRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <MyProfile />
                  </PrivateRoute>
                }
              />

              <Route
                path="/profile/:id"
                element={
                  <PrivateRoute>
                    <UserProfile />
                  </PrivateRoute>
                }
              />

              {/* CHAT ROUTES */}
              <Route
                path="/messages"
                element={
                  <PrivateRoute>
                    <MessagesList />
                  </PrivateRoute>
                }
              />

              <Route
                path="/messages/:tradeId"
                element={<ChatWindow />}
              />

              {/* 404 */}
              <Route
                path="*"
                element={
                  <div className="p-6 text-center text-gray-600">
                    404 | Page Not Found
                  </div>
                }
              />
            </Routes>
          </Layout>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
