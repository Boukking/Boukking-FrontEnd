//module
import { useState } from 'react';
import axios from 'axios';
import { useContext } from "react";
import { AuthContext } from "./../../context/AuthContext";

//style
import s from './AuthForm.module.css';

//constance
const API_URL = "http://localhost:3000";

export default function AuthForm({ authType, setDisplayRegisterPage, setDisplayLoginPage }) {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState(null);

    const { storeToken, authenticateUser } = useContext(AuthContext);

    function handleAuthForm(e) {
        e.preventDefault();
        if (!username || !password || username === "" || password === "") return setErrorMessage("Both fields are required");
        const requestBody = { username, password };
        authType === "Register" ? sendRegister(requestBody) : sendLogin(requestBody);
    }

    function sendRegister(requestBody) {
        if (password.length < 3) return setErrorMessage("Password must be at least 3 characters long");
        axios.post(`${API_URL}/auth/signup`, requestBody)
            .then((response) => {
                sendLogin(requestBody);
            })
            .catch((error) => {
                const errorDescription = error.response.data.message;
                setErrorMessage(errorDescription);
            })
    }

    function sendLogin(requestBody) {
        axios.post(`${API_URL}/auth/login`, requestBody)
            .then((response) => {
                closeForm();
                storeToken(response.data.authToken);
                authenticateUser();
            })
            .catch((error) => {
                console.log(error)
                const errorDescription = error.response.data.message;
                setErrorMessage(errorDescription);
            })
    }

    function closeForm() {
        authType === "Register" ? setDisplayRegisterPage(false) : setDisplayLoginPage(false);
    }

    return (
        <form onSubmit={handleAuthForm} className={s.form}>
            <span onClick={closeForm}>×</span>
            <h3>{authType}</h3>
            <p>Username</p>
            <input type="text" value={username} onChange={(e) => setUserName(e.target.value)} />
            <p>Password</p>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button>Submit</button>
            {errorMessage && <p className={s.error_message}>{errorMessage}</p>}
        </form>
    )
}