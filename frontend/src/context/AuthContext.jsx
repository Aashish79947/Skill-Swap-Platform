import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

/**
 * @component AuthProvider
 * @description Manages global authentication state, token storage, and decoding.
 * Wraps the entire application to provide 'user' and 'token' access.
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    // Initialize Auth State on Mount
    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);

                // Auto logout if token is expired
                const currentTime = Date.now() / 1000;
                if (decoded.exp < currentTime) {
                    logout();
                } else {
                    setUser(decoded);
                }
            } catch (err) {
                console.error("Invalid token:", err);
                logout();
            }
        }
        setLoading(false);
    }, [token]);

    const login = (newToken, userData = null) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
        
        // If userData is provided (Google auth), set it directly
        if (userData) {
            setUser(userData);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        toast.success("Logged out successfully");
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

/**
 * @hook useAuth
 * @description Custom hook to access auth context.
 * @returns {Object} { user, token, login, logout, loading }
 */
export const useAuth = () => {
    return useContext(AuthContext);
};
