//module
import React, { useState, useEffect } from "react";
import axios from "axios";

// instance
const AuthContext = React.createContext();

function AuthProviderWrapper({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    function storeToken(token) {
        localStorage.setItem('authToken', token);
    }

    function authenticateUser() {
        const storedToken = localStorage.getItem('authToken');

        if (storedToken) {
            axios.get(
                `${import.meta.env.VITE_API_URL}/auth/verify`,
                { headers: { Authorization: `Bearer ${storedToken}` } }
            )
                .then((response) => {
                    setIsLoggedIn(true);
                    setIsLoading(false);
                    setUser(response.data);
                })
                .catch((error) => {
                    setIsLoggedIn(false);
                    setIsLoading(false);
                    setUser(null);
                });
        } else {
            setIsLoggedIn(false);
            setIsLoading(false);
            setUser(null);
        }
    }

    function disconnectUser() {
        localStorage.removeItem('authToken');
        setUser(null);
        setIsLoggedIn(false);
        setIsLoading(false);
    }

    useEffect(() => {
        authenticateUser()
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, storeToken, authenticateUser, disconnectUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export { AuthProviderWrapper, AuthContext };
