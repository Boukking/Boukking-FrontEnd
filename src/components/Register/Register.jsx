//module
import { useState } from 'react';

//style
import s from './Register.module.css';

export default function Register({ setDisplayRegisterPage }) {
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState(null);

    function handleRegister(e) {
        e.preventDefault();
    }

    return (
        <form onSubmit={handleRegister} className={s.form}>
            <span onClick={() => setDisplayRegisterPage(false)}>×</span>
            <h3>Register</h3>
            <p>Username</p>
            <input type="text" value={username} onChange={(e) => setUserName(e.target.value)}/>
            <p>Password</p>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button>Submit</button>
            {errorMessage && <p className={s.error_message}>Error</p>}
        </form>
    )
}