// module
import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "./../../context/AuthContext";
import axios from "axios";

// style
import s from './AddDwelling.module.css';

// constance
const nbOfImages = 3;

export default function AddDwelling() {
    const { isLoggedIn } = useContext(AuthContext);

    const [title, setTitle] = useState("");
    const [type, setType] = useState("House");
    const [maxPersonNumber, setmaxPersonNumber] = useState("");
    const [description, setDescription] = useState("");
    const [adress, setAdress] = useState("");
    const [city, setCity] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [country, setCountry] = useState("");

    const [infoBox, setInfoBox] = useState([]);
    const [isUploading, setIsUploading] = useState(false);

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
        setInfoBox([]);
        setIsUploading(true);
        if (!title || !type || !maxPersonNumber || !adress || !city || !zipCode || !country) return setInfoBox(prevInfoBox => [...prevInfoBox, ["Fields with '*' are required"]]);
        const newDwelling = { title, description, type, maxPersonNumber, adress, city, zipCode, country };
        const imgUrl = [];
        axios.post(`${import.meta.env.VITE_API_URL}/dwelling`, newDwelling, { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } })
            .then(res => {
                setInfoBox(prevInfoBox => [...prevInfoBox, ["The dwelling has been created"]]);
                newDwelling._id = res.data._id;
                if (imageStateList.find(elm => elm[0] !== "")) {
                    const uploadPromises = imageStateList.map((imageState, index) => {
                        if (imageState[0]) {
                            const uploadData = new FormData();
                            uploadData.append("imageUrl", imageState[0].target.files[0]);
                            return axios.post(`${import.meta.env.VITE_API_URL}/dwelling/img`, uploadData, { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } })
                                .then(res => {
                                    imgUrl.push(res.data.fileUrl);
                                    setInfoBox(prevInfoBox => [...prevInfoBox, [`Image ${index + 1} successfully uploaded`]]);
                                })
                                .catch(() => setInfoBox(prevInfoBox => [...prevInfoBox, [`Error while uploading the image ${index + 1}, check the format`]]));
                        }
                    })
                    return Promise.all(uploadPromises)
                        .then(() => {
                            return axios.put(`${import.meta.env.VITE_API_URL}/dwelling/${newDwelling._id}`, { image: imgUrl }, { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } })
                        })
                        .then(() => {
                            setInfoBox(prevInfoBox => [...prevInfoBox, ["The image(s) have been added to the dwelling"]]);
                        })
                        .catch(() => setInfoBox(prevInfoBox => [...prevInfoBox, ["Error will trying to add image(s) to building"]]));
                }
                return;
            })
            .then(() => {
                setInfoBox(prevInfoBox => [...prevInfoBox, ["Redirecting to the newly created dwelling"]]);
                setTimeout(() => {
                    navigate(`/dwelling/${newDwelling._id}`);
                }, 3000);
            })
            .catch(err => {
                setInfoBox(prevInfoBox => [...prevInfoBox, [err.response?.data?.message || "Error while creating a new dwelling"]]);
                setIsUploading(false);
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
                            <p>Address*</p>
                            <input type="text" required value={adress} onChange={(e) => setAdress(e.target.value)} />
                        </div>
                        <div>
                            <p>City*</p>
                            <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} />
                        </div>
                        <div>
                            <p>ZIP code*</p>
                            <input type="text" required value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
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
                    {infoBox && infoBox.map((info, index) => <p className={s.info_box} key={index}>{info}</p>)}
                    <button disabled={isUploading} >{isUploading ? <div className="loader1" /> : "Submit"}</button>
                </form>
            </div>
        </div>
    )
}