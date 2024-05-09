// module
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "./../../context/AuthContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

//component
import AuthForm from '../../components/AuthForm/AuthForm';

// style
import s from './NavBar.module.css';

//asset
import profilePicture from './../../assets/icon/user_black.png';

export default function NavBar() {
    const [displayRegisterPage, setDisplayRegisterPage] = useState(false);
    const [displayLoginPage, setDisplayLoginPage] = useState(false);
    const [redirect, setRedirect] = useState("");

    const { isLoggedIn, user, disconnectUser } = useContext(AuthContext);

    const location = useLocation();
    const navigate = useNavigate();

    function showAuthForm(authType) {
        setDisplayRegisterPage(false);
        setDisplayLoginPage(false);
        authType === "Register" ? setDisplayRegisterPage(true) : setDisplayLoginPage(true)
    }

    function closeAuthForm() {
        setDisplayRegisterPage(false);
        setDisplayLoginPage(false);
        setRedirect("");
    }

    useEffect(() => {
        if (isLoggedIn) {
            if (redirect) navigate(redirect);
            closeAuthForm();
        }
    }, [isLoggedIn])

    return (
        <nav className={`full-page`}>
            <div className="page">
                <Link to='/'><h1>Boukking</h1></Link>
                <div>
                    {
                        location.pathname !== '/add' &&
                        <Link
                            to={isLoggedIn && '/add'}
                            onClick={() => {
                                if (!isLoggedIn) {
                                    setDisplayRegisterPage(false);
                                    setDisplayLoginPage(true);
                                }
                                setRedirect("/add");
                            }}
                        >
                            Add your dwelling
                        </Link>}
                    {
                        isLoggedIn ?
                            <>
                                <button id={s.user}>{user.username}<img src={profilePicture} alt="Profile" /></button>
                                <p onClick={disconnectUser}>Log out</p>
                            </>
                            : isLoggedIn === null ?
                                <div className="loader1" />
                                : (<>
                                    <button onClick={() => showAuthForm("Register")}>Register</button>
                                    {displayRegisterPage && <AuthForm authType={"Register"} setDisplayRegisterPage={setDisplayRegisterPage} closeAuthForm={closeAuthForm} />}
                                    <button onClick={() => showAuthForm("Login")}>Sign in</button>
                                    {displayLoginPage && <AuthForm authType={"Login"} setDisplayLoginPage={setDisplayLoginPage} closeAuthForm={closeAuthForm} />}
                                </>)
                    }
                </div>
            </div>
        </nav>
    )
}