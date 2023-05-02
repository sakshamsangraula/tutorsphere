import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import AvailabilityPicker from './AvailabilityPicker';
import CreatableSelect from 'react-select/creatable';
import useFirestore from '../../firestore';
import { useAuthContext } from '../context/UserAuthContext';
import "../../styles/App.css";

import { useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {storage} from "../../firebase"
import {ref, uploadBytes, getDownloadURL} from "firebase/storage"



function SetupProfile() {
    const [image, setImage] = useState();
    const [url, setUrl] = useState("https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp");

    const {user} = useAuthContext();
    const {data} = useFirestore();
    const {updateDocument} = useFirestore();
    const [show, setShow] = useState(false);
    const[aboutMe, setAboutMe] = useState("");
    const USERS = "users";

    const subjectOptions = [
        {
            label: "Science",
            value: "science"
        },
        {
            label: "Math",
            value: "math"
        }
    ]

    const [selectedOptions, setSelectedOptions] = useState([]);
    console.log("selectedoptions", selectedOptions)
    function handleSelectChange(newValue, actionMeta) {
        setSelectedOptions(newValue);
    }

    const handleSubmit = async () => {

        // add list of subjects to firestore
        const subjectTitles = selectedOptions.map(subject => subject.value);
        try{
            // TODO: make sure at least one subject is selected by the tutor before saving data to the database. Also, try to get the selected values from firestore if it exists and show them by default
            const subjectAddResponse = await updateDocument(USERS, user.uid, {subjects: subjectTitles});
            // set profile setup to true TODO: also need to add about me description (maybe wrap this around form (about me, other values, and picking availability))
            const updatedProfileSetupValue = await updateDocument(USERS, user.uid, {isProfileSetup: true});
            const updatedProfileAboutMe = await updateDocument(USERS, user.uid, {aboutMe: aboutMe});
            setShow(false);
        }catch(err){
            alert("Error submitting subjects to firestore", err);
        }
    }

    // future deletes -- temporary
    const handleImageChange = (e) => {
        if (e.target.files[0]){ // if the file name exists -- then set it as the image (using file since that is input type)
            setImage(e.target.files[0])
        }
    }

    const handleImageSubmit = () => {
        try{
            if (image){
                const imageRef = ref(storage, `users/${user.uid}/profilePic`);
                uploadBytes(imageRef, image)
                    .then(() => {
                        getDownloadURL(imageRef)
                            .then((url) => {
                                setUrl(url);
                                updateDocument("users", user.uid, { url: url });
                            });
                    })
            }

        }catch(error){
            console.log("error in submitting pic: ", error)
        }

    };

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

// TODO: reuse modal in setupProfile (here) and MeetingSchedulerFinal modal
    return (
        <>
            <button className={"btn btn-danger"} onClick={handleShow}>
                Setup Profile
            </button>

            <Modal show={show} onHide={handleClose} size="xl" animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Setup Tutor Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div className={"center"}>
                            <img
                                src={data?.url}
                                alt="avatar"
                                className="rounded-circle img-fluid avatar-image"/>
                            <div></div>
                            <input type={"file"} onChange={handleImageChange}/>
                            <div></div>
                            <button type="submit" className="btn btn-secondary btn-sm" onClick={handleImageSubmit}>Add Profile Picture</button>
                        </div>

                        <br/>
                        <div className="form-group">
                            <label htmlFor="exampleFormControlTextarea1">Enter an About Me (250 charcters): </label>
                            <textarea onChange={(e) => setAboutMe(e.target.value)} className="form-control" id="exampleFormControlTextarea1" rows="3" max></textarea>
                        </div>


                        <p>Select subjects you would like to teach: </p>
                        {/*<p>selection box</p>*/}

                        <CreatableSelect
                            isMulti
                            options={subjectOptions}
                            onChange={handleSelectChange}

                        />

                        <br/>
                        <p>Select your availability: </p>
                        <AvailabilityPicker />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default SetupProfile;