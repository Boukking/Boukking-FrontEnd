// module
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// style
import s from './MainPage.module.css';

// constance
const API_URL = "http://localhost:3000";

// asset
import noImageLogo from "./../../assets/icon/no-image.jpg";

export default function MainPage() {
    const [errorMessage, setErrorMessage] = useState(null);
    const [searchBar, setSearchBar] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [numberOfPersons, setNumberOfPersons] = useState("");
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        axios.get(`${API_URL}/dwelling`)
            .then(res => setOffers(res.data))
            .catch(err => console.log(err))
    }, [])

    function handleSearchForm(e) {
        e.preventDefault();
        if (!searchBar) return setErrorMessage("Fill the place to visit");
        if (!fromDate || !toDate) return setErrorMessage("Fill the date");
        if (new Date(toDate) <= new Date(fromDate)) return setErrorMessage("Error, please view the date");
        if (!numberOfPersons) setNumberOfPersons(1);
    }

    function getDateFormat(dateStr) {
        const date = new Date(dateStr);
        const day = String(date.getUTCDate()).padStart(2, '0');
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${day}/${month}/${year}`;
    }

    return (
        <>
            <header className={s.header}>
                <div className={`page`}>
                    <h2>Find out your next journey</h2>
                    <p>Search for deals on hotels, self-catering accommodations and more...</p>
                </div>
                {errorMessage && <p className='page' id={s.error_message}>{errorMessage}</p>}
                <form onSubmit={handleSearchForm} className='page'>
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
                                offers.sort((a, b) => new Date(b.published) - new Date(a.published)).map((offer, index) => {
                                    return (
                                        <Link to={`/dwelling/${offer._id}`} className={s.offer} key={index}>
                                            <div>
                                                <div>
                                                    <img src={offer.image.length ? offer.image[0] : noImageLogo} alt="Dwellling image" />
                                                </div>
                                            </div>
                                            <div>
                                                <div>
                                                    <div><h1>{offer.title}</h1> ({offer.type})</div>
                                                    <p>{

                                                        offer.rating.length
                                                    }/5</p>
                                                </div>
                                                <div>
                                                    <p className={s.description}>{offer.description}</p>
                                                </div>
                                                <div>
                                                    <p>For {offer.maxPersonNumber} person{offer.maxPersonNumber > 1 && "s"}</p>
                                                    <p>{offer.city}📍</p>
                                                    <p>Added {getDateFormat(offer.published)}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    )
                                })
                        }
                    </article>
                </div>
            </footer>
        </>
    )
}