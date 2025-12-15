import { useState } from "react";
import { fetchUpdateVacation } from "../../Api/ClientApi";
import type { Vacationpropstoedit } from "../../types";
import { IMG_URL } from "../../config";
import './EditVacation.css'
import "../Errors/Errors.css"

interface EditVacationProps {
    vacation: Vacationpropstoedit;
    onClose: (updatedVacation?: Vacationpropstoedit) => void;
}
function formatDateForInput(dateString: string) {
    const d = new Date(dateString);
    return d.toISOString().split("T")[0]; 
}

function EditVacation({ vacation, onClose }: EditVacationProps) {
    const [vacationData, setVacationData] = useState<Vacationpropstoedit>({
        id: vacation.id,
        destination: vacation.destination,
        description: vacation.description,
        start_date: formatDateForInput(vacation.start_date),
        end_date: formatDateForInput(vacation.end_date),
        price: vacation.price,
        image_fileName: vacation.image_fileName,
        followers: vacation.followers
    });

    const [success, setSuccess] = useState<boolean>(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);


    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setSuccess(false)
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

        const formData = new FormData();
        formData.append("id", vacationData.id.toString()); 
        console.log(vacationData.id);
        formData.append("destination", vacationData.destination);
        formData.append("description", vacationData.description);
        formData.append("start_date", vacationData.start_date);
        formData.append("end_date", vacationData.end_date);
        formData.append("price", vacationData.price.toString());
        formData.append("followers", vacationData.followers.toString()); 
        console.log(imageFile);
        console.log(vacationData.image_fileName);
        
        if (imageFile) {
            formData.append("image_fileName", imageFile);
        } else {
            formData.append("image_fileName", vacationData.image_fileName);
        }

        try {
            console.log(formData);
            
            const res = await fetchUpdateVacation(formData);
            console.log(res);
            if (res) {
                const updatedVacation: Vacationpropstoedit = {
                    ...vacationData,
                    image_fileName: res.data
                };
                setVacationData(updatedVacation);
                onClose(updatedVacation);
            }
        } catch (error) {
            setError("error update vacation. please try again.")
        }
    }

    return (
        <div className="modal-inner">
            <h2 className="edit-title">Edit Vacation</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <label htmlFor="destination">Destination</label>
                <input
                    name="destination"
                    value={vacationData.destination}
                    onChange={handleChange}
                    required
                    maxLength={50}
                />

                <label htmlFor="description">Description</label>
                <textarea
                    name="description"
                    value={vacationData.description}
                    onChange={handleChange}
                    required
                    maxLength={250}
                ></textarea>

                <label htmlFor="start_date">Start</label>
                <input
                    name="start_date"
                    type="date"
                    value={vacationData.start_date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="end_date">End</label>
                <input
                    name="end_date"
                    type="date"
                    value={vacationData.end_date}
                     min={vacationData.start_date || new Date().toISOString().split('T')[0]}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="price">Price ($)</label>
                <input
                    name="price"
                    type="number"
                    min={1}
                    max={10000}
                    value={vacationData.price}
                    onChange={handleChange}
                    required
                />
                <label id="imglabel">Current Image</label>
                <img className="vimg"
                      src={imageFile ? URL.createObjectURL(imageFile) : IMG_URL + vacationData.image_fileName}
                    alt={vacationData.destination}
                    width={215}
                />

                <label htmlFor="image" className="file-upload">Upload New Image  🗁</label>
                <input
                    className="custom-upload-btn"
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
                {error? <p className="error-message">{error}</p> : ''}
                <div className="modal-buttons">
                    <button type="submit">Update</button>
                    <button type="button" onClick={() => onClose()}>Cancel</button>
                </div>
            </form>

            {success && <p>Vacation updated successfully!</p>}
        </div>
    );
}

export default EditVacation;

