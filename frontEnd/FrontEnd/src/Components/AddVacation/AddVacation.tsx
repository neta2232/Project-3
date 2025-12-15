import { useState } from "react"
import { fetchaddVacation } from "../../Api/ClientApi";
import React from "react";
import './AddVacation.css'
import '../Errors/Errors.css'
import type { VacationProps } from "../../types";


function AddVacation() {
    const [error, setError] = useState<string | null>(null);
    const [vacationData, setVacationData] = useState<VacationProps>({
        destination: "",
        description: "",
        start_date: "",
        end_date: "",
        price: 0,
    });
    const [success, setSuccess] = useState<boolean>(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;

        setVacationData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            setImageFile(e.target.files[0]);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!imageFile) {
            setError("you must add an image.")
            return;
        }

        const formData = new FormData();

        formData.append("destination", vacationData.destination);
        formData.append("description", vacationData.description);
        formData.append("start_date", vacationData.start_date);
        formData.append("end_date", vacationData.end_date);
        formData.append("price", vacationData.price.toString());
        formData.append("image_fileName", imageFile);

        try {
            const res = await fetchaddVacation(formData);
            if (res) {
                setSuccess(true)
            }
        } catch (error) {
            setError("error adding vacation. please try again")
        }
    }

    return (
        <>
            <div className="add-vacation-container">
                <h2 id="add-title">Add Vacation</h2>
                <form id="add-vacation-form" onSubmit={handleSubmit} encType="multipart/form-data">

                    <label htmlFor="destination">Destination</label>
                    <input name="destination" value={vacationData.destination} onChange={handleChange} required maxLength={50} />

                    <label htmlFor="description">Description</label>
                    <textarea name="description" value={vacationData.description} onChange={handleChange} required maxLength={250}></textarea>

                    <label htmlFor="start_date">Start</label>
                    <input name="start_date" type="date" value={vacationData.start_date} onChange={handleChange} min={new Date().toISOString().split('T')[0]} required />

                    <label htmlFor="end_date">End</label>
                    <input name="end_date" type="date" value={vacationData.end_date} onChange={handleChange} min={vacationData.start_date || new Date().toISOString().split('T')[0]} required />

                    <label htmlFor="price">Price ($)</label>
                    <input name="price" type="number" min={1} max={10000} value={vacationData.price} onChange={handleChange} required />
                    <label id="current">Current Image</label>
                    {imageFile ? <><img
                        src={imageFile ? URL.createObjectURL(imageFile) : ""}
                        alt={vacationData.destination}
                        width={230}
                    /> </> : <div className="image-upload-template"><img width="80" height="80" src="https://img.icons8.com/material-outlined/96/image.png" alt="image" /></div>}
                    <label htmlFor="image" className="file-upload">Upload New Image  🗁</label>
                    <input className="custom-upload-btn" id="image" name="image" type="file" accept="image/*" onChange={handleFileChange}></input>
                    {error ? <p className="error-message">{error}</p> : ""}
                    <button type="submit">Add</button>
                    {success && <p>new vacation added!</p>}

                </form>

            </div>
        </>
    );
}

export default AddVacation;