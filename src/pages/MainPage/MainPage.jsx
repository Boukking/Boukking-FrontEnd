// module
import { useState } from 'react';

// style
import s from './MainPage.module.css';

export default function MainPage() {
    const [errorMessage, setErrorMessage] = useState(null);
    const [searchBar, setSearchBar] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [numberOfPersons, setNumberOfPersons] = useState("");
    const [offers, setOffers] = useState([]);

    function handleSearchForm(e) {
        e.preventDefault();
        if (!searchBar) return setErrorMessage("Fill the place to visit");
        if (!fromDate || !toDate) return setErrorMessage("Fill the date");
        if (new Date(toDate) <= new Date(fromDate)) return setErrorMessage("Error, please view the date");
        if (!numberOfPersons) setNumberOfPersons(1);
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