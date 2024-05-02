//module
import { Link } from 'react-router-dom';

// style
import s from './MainPage.module.css';

export default function MainPage() {
    return (
        <>
            <header className={s.header}>
                <div className={`page`}>
                    <h1>Boukking</h1>
                    <div>
                        <Link>Add your dwelling</Link>
                        <button>Register</button>
                        <button>Sign in</button>
                    </div>
                </div>
                <div className={`page`}>
                    <h2>
                        Find out your next journey
                    </h2>
                </div>
            </header>
            <footer className={s.footer}>
                <div className={`page`}>
                    <h1>1</h1>
                </div>
            </footer>
        </>
    )
}