import React, { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import AvailabilityPicker from './AvailabilityPicker';
import CreatableSelect from 'react-select/creatable';
import useFirestore from '../../firestore';
import { useAuthContext } from '../context/UserAuthContext';
import { Alert } from 'react-bootstrap';
import "../../styles/App.css";
import { storage } from "../../firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

function SetupProfile() {
    const [image, setImage] = useState("");
    const [url, setUrl] = useState("https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp");

    const { user } = useAuthContext();
    const { data, updateDocument } = useFirestore();
    const [show, setShow] = useState(false);
    const [didSaveSchedule, setDidSaveSchedule] = useState(false);
    const USERS = "users";
    const [aboutMe, setAboutMe] = useState("");

    const subjectOptions = [
        {
            label: "science",
            value: "science"
        },
        {
            label: "math",
            value: "math"
        },
        {
            label: "english",
            value: "english"
        },
        {
            label: "coding",
            value: "coding"
        }
    ]

    const [selectedOptions, setSelectedOptions] = useState([]);
    function handleSelectChange(newValue, actionMeta) {
        setSelectedOptions(newValue);
    }

    const prevScheduleRef = useRef();
    const prevSubjectsRef = useRef();
    const prevAboutMeRef = useRef();
    const prevUrlRef = useRef();


    useEffect(() => {
        if (data?.userRole === "tutors" && data?.url) {
            setUrl(data.url);
        }
    }, [data]);

    useEffect(() => {
        if (data?.userRole === "tutors" && data?.subjects?.length > 0) {
            if (!prevSubjectsRef.current || prevSubjectsRef.current.toString() !== data?.subjects.toString()) {
                setSelectedOptions(getLabelAndValue(data?.subjects));
            }
        }

        prevSubjectsRef.current = data?.subjects;
    }, [data?.userRole, data?.subjects]);

    useEffect(() => {
        if (data?.userRole === "tutors" && data?.aboutMe) {
            if (!prevAboutMeRef.current || prevAboutMeRef.current !== data?.aboutMe) {
                setAboutMe(data?.aboutMe);
            }
        }

        prevAboutMeRef.current = data?.aboutMe;
    }, [data?.userRole, data?.aboutMe]);

    useEffect(() => {
        if (data?.userRole === "tutors" && data?.schedule) {
            if (!prevScheduleRef.current || JSON.stringify(prevScheduleRef.current) !== JSON.stringify(data?.schedule)) {
                setDidSaveSchedule(true);
            }
        }

        prevScheduleRef.current = data?.schedule;
    }, [data?.userRole, data?.schedule]);


    useEffect(() => {
        if (data?.userRole === "tutors" && data?.url) {
            if (!prevUrlRef.current || prevUrlRef.current !== data?.url) {
                setUrl(data?.url);
            }
        }

        prevUrlRef.current = data?.url;
    }, [data?.userRole, data?.url]);



    function getLabelAndValue(listOfValues) {
        return listOfValues?.map(listElement => {
            return {
                label: listElement,
                value: listElement
            }
        })
    }

    const handleSubmit = async () => {

        const subjectTitles = selectedOptions.map(subject => subject.value);
        try {
            await updateDocument(USERS, user.uid, { subjects: subjectTitles });
            await updateDocument(USERS, user.uid, { isProfileSetup: true });
            await updateDocument(USERS, user.uid, { aboutMe: aboutMe });
            setShow(false);
        } catch (err) {
            alert("Error submitting subjects to firestore", err);
        }
    }

    // future deletes -- temporary
    const handleImageChange = (e) => {
        if (e.target.files[0]) { // if the file name exists -- then set it as the image (using file since that is input type)
            setImage(e.target.files[0])
        }
    }

    const handleImageSubmit = () => {
        try {
            if (image) {
                const imageRef = ref(storage, `users/${user?.uid}/profilePic`);
                uploadBytes(imageRef, image)
                    .then(() => {
                        getDownloadURL(imageRef)
                            .then((url) => {
                                setUrl(url);
                                updateDocument("users", user?.uid, { url: url });
                            });
                    })
            }

        } catch (error) {
            window.alert("error in submitting pic: " + error.message)
        }

    };


    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleSaveSchedule = () => {
        setDidSaveSchedule(true);
    }

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
                    <p>* Indicates a required field</p>
                    <div className={"center"}>
                        <img
                            src={url}
                            alt="avatar"
                            className="rounded-circle img-fluid avatar-image" />
                        <div></div>
                        <input type={"file"} onChange={handleImageChange} />
                        <div></div>
                        <button type="submit" className="btn btn-secondary btn-sm" onClick={handleImageSubmit}>Add Profile Picture</button>
                    </div>

                    <br />
                    <div className="form-group">
                        <label htmlFor="exampleFormControlTextarea1">Enter an About Me (Up to 250 charcters) * </label>
                        <textarea value={aboutMe} onChange={(e) => setAboutMe(e.target.value)} className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                    </div>

                    <br />

                    <div>
                        <p>Select subjects you would like to teach *</p>
                        <CreatableSelect
                            isMulti
                            options={subjectOptions}
                            onChange={handleSelectChange}
                            value={selectedOptions}

                        />
                        <br />
                        <div>Select your availability (Save availability to persist your changes) *</div>
                        <AvailabilityPicker handleSaveSchedule={handleSaveSchedule} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    {didSaveSchedule && aboutMe && selectedOptions?.length > 0 && <Button variant="primary" onClick={handleSubmit}>
                        Submit
                    </Button>}
                    {(didSaveSchedule && aboutMe && selectedOptions?.length > 0) || <Alert>
                        Please fill in the required fields. </Alert>}
                </Modal.Footer>
            </Modal>
        </>
    );




}

export default SetupProfile;