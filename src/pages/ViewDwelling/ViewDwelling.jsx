// module
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from "./../../context/AuthContext";

// style
import s from './ViewDwelling.module.css';

// constance
const API_URL = "http://localhost:3000";

export default function ViewDwelling() {
    const [dwelling, setDwelling] = useState(null);

    const { dwellingId } = useParams();

    const navigate = useNavigate();

    const { isLoggedIn, user } = useContext(AuthContext);

    useEffect(() => {
        axios.get(`${API_URL}/dwelling/${dwellingId}`)
            .then(res => {
                setDwelling(res.data);
            })
            .catch(() => {
                navigate("/");
            });
    }, [])

    function deleteDwelling(dwellingId) {
        axios.delete(`${API_URL}/dwelling/${dwellingId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } })
            .then(() => {
                navigate("/");
            })
            .catch()
    }

    return (
        <div className={s.main}>
            <div className="page">
                <div>
                    <h1>{!dwelling ? <div className="loader1" /> : dwelling.title}</h1>
                    {
                        (dwelling && isLoggedIn) && (dwelling.author._id === user._id ?
                            <button id={s.delete} onClick={() => deleteDwelling(dwelling._id)}>Delete the dwelling</button>
                            :
                            <button>Get in touch with {dwelling.author.username}</button>)
                    }
                </div>
                {
                    dwelling &&
                    <>
                        <div>
                            <p>Type <b>{dwelling.type}</b></p>
                            <p>For <b>{dwelling.maxPersonNumber}</b> person{dwelling.maxPersonNumber > 1 && "s"}</p>
                            <p>rate <b>4.8/5 ★</b></p>
                            <p>Address <b>{dwelling.adress + " " + dwelling.zipCode + " " + dwelling.city + " - " + dwelling.country}</b></p>
                        </div>

                        <p><b>Description</b></p>
                        <p>{dwelling.description}</p>

                        <p><b>Image{dwelling.image.length > 1 && "s"}</b></p>
                        {
                            dwelling.image.length !== 0 ?
                            <>
                                <div className={s.imageContainer}>{dwelling.image.map((image, index) => {
                                    return (
                                        <div key={index} style={{ width: `calc(${100 / dwelling.image.length}% - ${dwelling.image.length - 1}rem)`, textAlign: "center" }}>
                                            <img
                                                src={image}
                                                alt={`Image ${index + 1}`}
                                            />
                                        </div>
                                    )
                                })}
                                </div>
                            </>
                            :
                            <p>No images available  </p>
                        }
                    </>
                }
            </div>
        </div>
    )
}