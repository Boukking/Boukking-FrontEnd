//module
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useContext } from "react";
import { AuthContext } from "./../../context/AuthContext";

//component
import AuthForm from '../../components/AuthForm/AuthForm';

// style
import s from './MainPage.module.css';

//asset
import profilePicture from './../../assets/icon/user_black.png';

export default function MainPage() {
    const [displayRegisterPage, setDisplayRegisterPage] = useState(false);
    const [displayLoginPage, setDisplayLoginPage] = useState(false);

    const [errorMessage, setErrorMessage] = useState(null);

    const [searchBar, setSearchBar] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [numberOfPersons, setNumberOfPersons] = useState("");

    const [offers, setOffers] = useState([]);

    const { isLoggedIn, user, disconnectUser } = useContext(AuthContext);

    function handleForm(e) {
        e.preventDefault();
        if (!searchBar) return setErrorMessage("Fill the place to visit");
        if (!fromDate || !toDate) return setErrorMessage("Fill the date");
        if (new Date(toDate) <= new Date(fromDate)) return setErrorMessage("Error, please view the date");
        if (!numberOfPersons) setNumberOfPersons(1);
    }

    function showAuthForm(authType) {
        setDisplayRegisterPage(false);
        setDisplayLoginPage(false);
        authType === "Register" ? setDisplayRegisterPage(true) : setDisplayLoginPage(true)
    }

    return (
        <>
            <header className={s.header}>
                <div className={`page`}>
                    <h1>Boukking</h1>
                    <div>
                        <Link>Add your dwelling</Link>
                        {
                            isLoggedIn ?
                                <>
                                    <button><img src={profilePicture} alt="Profile" />{user.username}</button>
                                    <p onClick={disconnectUser}>Log out</p>
                                </>
                                : (<>
                                    <button onClick={() => showAuthForm("Register")}>Register</button>
                                    {displayRegisterPage && <AuthForm authType={"Register"} setDisplayRegisterPage={setDisplayRegisterPage} />}
                                    <button onClick={() => showAuthForm("Login")}>Sign in</button>
                                    {displayLoginPage && <AuthForm authType={"Login"} setDisplayLoginPage={setDisplayLoginPage} />}
                                </>)
                        }
                    </div>
                </div>
                <div className={`page`}>
                    <h2>Find out your next journey</h2>
                    <p>Search for deals on hotels, self-catering accommodations and more...</p>
                </div>
                {errorMessage && <p className='page' id={s.error_message}>{errorMessage}</p>}
                <form onSubmit={handleForm} className='page'>
                    <input id={s.place_input} type="text" placeholder="The place to visit" value={searchBar} onChange={(e) => setSearchBar(e.target.value)} />
                    <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                    <p>→</p>
                    <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                    <input type="number" min="1" max="25" placeholder='1 person' value={numberOfPersons} onChange={(e) => setNumberOfPersons(e.target.value)} />
                    <button>Search</button>
                </form>
            </header>
            <footer className={s.footer}>
                <div className={`page`}>
                    <h1>Take a look at the latest offers added by users :</h1>
                    <article>
                        {
                            !offers.length ?
                                <p>No offers to show for the moment</p>
                                :
                                offers.map(offer => {
                                    console.log("offer")
                                })
                        }
                    </article>
                </div>
            </footer>
        </>
    )
}