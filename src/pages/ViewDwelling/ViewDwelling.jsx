// module
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';

// style
import s from './ViewDwelling.module.css';

// constance
const API_URL = "http://localhost:3000";

export default function ViewDwelling() {
    const [dwelling, setDwelling] = useState(null);

    const { dwellingId } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_URL}/dwelling/${dwellingId}`)
            .then(res => {
                setDwelling(res.data);
            })
            .catch(() => {
                navigate("/");
            });
    }, [])


    return (
        <div className={s.main}>
            <div className="page">
                <div>
                    <h1>{!dwelling ? <div className="loader1" /> : dwelling.title}</h1>
                    {dwelling && <button>Get in touch with {dwelling.author.username}</button>}
                </div>
                {
                    dwelling &&
                    <>
                        <div>
                            <p>Type <b>{dwelling.type}</b></p>
                            <p>For <b>{dwelling.maxPersonNumber}</b> person{dwelling.maxPersonNumber > 1 && "s"}</p>
                            <p>rate <b>4.8/5 ★</b></p>
                            <p>Adress <b>{dwelling.adress + " " + dwelling.zipCode + " " + dwelling.city + " - " + dwelling.country}</b></p>
                        </div>

                        <p><b>Description</b></p>
                        <p>{dwelling.description}</p>

                        {
                            dwelling.image.length &&
                            <>
                                <p><b>Image{dwelling.image.length > 1 && "s"}</b></p>
                                <div className={s.imageContainer}>{dwelling.image.map((image, index) => {
                                    return (
                                        <div style={{ width: `calc(${100 / dwelling.image.length}% - ${dwelling.image.length - 1}rem)` }}>
                                            <img
                                                src={image}
                                                alt={`Image ${index + 1}`}
                                                key={index}
                                            />
                                        </div>
                                    )
                                })}
                                </div>
                            </>
                        }
                    </>
                }
            </div>
        </div>
    )
}