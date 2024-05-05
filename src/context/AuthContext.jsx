import React, { useState, useEffect } from "react";
import axios from "axios";
const API_URL = "http://localhost:3000";

const AuthContext = React.createContext();

function AuthProviderWrapper({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    function storeToken(token) {
        localStorage.setItem('authToken', token);
    }

    function authenticateUser() {
        const storedToken = localStorage.getItem('authToken');

        if (storedToken) {
            console.log(storedToken)
            axios.get(
                `${API_URL}/auth/verify`,
                { headers: { Authorization: `Bearer ${storedToken}` } }
            )
                .then((response) => {
                    console.log(response)
                    setIsLoggedIn(true);
                    setIsLoading(false);
                    setUser(response.data);
                })
                .catch((error) => {
                    console.log(error)
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
