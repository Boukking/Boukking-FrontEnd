// module
import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "./../../context/AuthContext";
import axios from "axios";

// style
import s from './AddDwelling.module.css';

// constance
const API_URL = "http://localhost:3000";
const nbOfImages = 3;

export default function AddDwelling() {
    const { isLoggedIn } = useContext(AuthContext);

    const [title, setTitle] = useState("");
    const [type, setType] = useState("House");
    const [maxPersonNumber, setmaxPersonNumber] = useState("");
    const [description, setDescription] = useState("");
    const [adress, setAdress] = useState("");
    const [city, setCity] = useState("");
    const [zip, setZip] = useState("");
    const [country, setCountry] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    const imageStateList = [];

    const navigate = useNavigate();

    useEffect(() => {
        document.querySelectorAll(`.${s.img_box}`).forEach(imgBox => {
            imgBox.style.maxWidth = `${1 / nbOfImages * 100}%`;
        });
    }, []);

    useEffect(() => {
        if (isLoggedIn === false) navigate('/');
    }, [isLoggedIn]);

    for (let i = 0; i < nbOfImages; i++) {
        imageStateList.push(useState(""));
    }

    function handleNewDwellingForm(e) {
        e.preventDefault();
        setErrorMessage("")
        if (!title || !type || !maxPersonNumber || !adress || !city || !zip || !country) return setErrorMessage("Fields with '*' are required");
        const newDwelling = { title, type, maxPersonNumber, adress, city, zip, country };
        const imgUrl = [];
        axios.post(`${API_URL}/dwelling`, newDwelling, { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } })
            .then(res => {
                newDwelling._id = res.data._id;
                const uploadPromises = imageStateList.map((imageState, index) => {
                    if (imageState[0]) {
                        const uploadData = new FormData();
                        uploadData.append("imageUrl", imageState[0].target.files[0]);
                        return axios.post(`${API_URL}/dwelling/img`, uploadData, { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } })
                            .then(res => {
                                imgUrl.push(res.data.fileUrl);
                            })
                            .catch(() => setErrorMessage(`Error while uploading the file ${index + 1}`));
                    }
                })
                return Promise.all(uploadPromises)
                    .then(() => {
                        console.log("Fini 3 image");
                        return axios.put(`${API_URL}/dwelling/${newDwelling._id}`, { image: imgUrl }, { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } })
                    })
                    .catch(() => console.log("attrape catch"));
            })
            .then(res => {
                console.log("Fini");
            })
            .catch(err => {
                console.log("erreur finale");
                setErrorMessage(err.response?.data?.message || "Error while creating a new dwelling");
            });
    }

    return (
        <div className={s.main}>
            <div className="page">
                <h1>Let's add your dwelling :</h1>
                <form className={s.form} onSubmit={handleNewDwellingForm}>
                    <div>
                        <div className={s.grow}>
                            <p>Title*</p>
                            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        <div>
                            <p>Type*</p>
                            <select value={type} onChange={(e) => setType(e.target.value)}>
                                <option value="House">House</option>
                                <option value="Apartment">Apartment</option>
                                <option value="Villa">Villa</option>
                                <option value="Condominium">Condominium</option>
                                <option value="Townhouse">Townhouse</option>
                                <option value="Cottage">Cottage</option>
                                <option value="Bungalow">Bungalow</option>
                                <option value="Duplex">Duplex</option>
                                <option value="Penthouse">Penthouse</option>
                                <option value="Loft">Loft</option>
                                <option value="Mobile Home">Mobile Home</option>
                                <option value="Mansion">Mansion</option>
                                <option value="Studio Apartment">Studio</option>
                                <option value="Chalet">Chalet</option>
                                <option value="Farmhouse">Farmhouse</option>
                            </select>
                        </div>
                        <div>
                            <p>Maximum number of persons*</p>
                            <input type="number" min="1" max="25" required value={maxPersonNumber} onChange={(e) => setmaxPersonNumber(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <div className={s.grow}>
                            <p>Description</p>
                            <textarea type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                    </div>
                    <div>
                        <div>
                            <p>Adress*</p>
                            <input type="text" required value={adress} onChange={(e) => setAdress(e.target.value)} />
                        </div>
                        <div>
                            <p>City*</p>
                            <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} />
                        </div>
                        <div>
                            <p>ZIP code*</p>
                            <input type="text" required value={zip} onChange={(e) => setZip(e.target.value)} />
                        </div>
                        <div>
                            <p>Country*</p>
                            <input type="text" required value={country} onChange={(e) => setCountry(e.target.value)} />
                        </div>
                    </div>
                    <p>Add images</p>
                    <div>
                        {
                            imageStateList.map((imageState, index) => {
                                return (
                                    <div className={s.img_box} key={index}>
                                        <input type="file" id={`files${index}`} className={s.hidden} onChange={(e) => { imageState[1](e) }} />
                                        {imageState[0] && <span onClick={() => { imageState[1](""); }} />}
                                        <label htmlFor={`files${index}`} >
                                            {imageState[0] ? <img src={URL.createObjectURL(imageState[0].target.files[0])} alt="Selected" /> : "+"}
                                        </label>
                                    </div>
                                )
                            })
                        }
                    </div>
                    {errorMessage && <p className={s.error}>{errorMessage}</p>}
                    <button>Submit</button>
                </form>
            </div>
        </div>
    )
}