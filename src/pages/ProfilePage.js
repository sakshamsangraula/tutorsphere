import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../components/context/UserAuthContext";
import SetupProfile from "../components/profile/SetupProfile";
import useFirestore from "../firestore";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from 'react-bootstrap';
import {storage} from "../firebase"
import {ref, uploadBytes, getDownloadURL} from "firebase/storage"
import "../styles/App.css"


function ProfilePage(){
    const navigate = useNavigate();

    // TODO: allow student to update their profile by adding profile picture (and maybe description). Allow adding about-me and profile pic for tutor in their profile

    const {user, logout} = useAuthContext();
    const {data} = useFirestore(); 
    const [displayPickAvailabilityMsg, setDisplayPickAvailabilityMsg] = useState(false);
    const [showSetupProfile, setShowSetupProfile] = useState(true);
    const {addDocumentToCollection} = useFirestore();
    const {updateDocument} = useFirestore()

    // for the "tutor profile setup" popup modal
    const [show, setShow] = useState(true);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // for upload profile pic
    const [image, setImage] = useState();
    const [url, setUrl] = useState("https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp");

    // log out function
    const handleLogout = () => {
        logout();
        navigate("/");
    };
    // const changePickAvailabilityMsg = useCallback((value) => {
    //     setDisplayPickAvailabilityMsg(value);
    // }, []);

    let profileMessage = "Profile setup completed ✅";

    useEffect(() => {

        if(user && data){
            if(data.userRole === "tutors"){
                setShowSetupProfile(true);

                if(!data.isProfileSetup){
                    setDisplayPickAvailabilityMsg(true);
                }
                else{
                    setDisplayPickAvailabilityMsg(false)
                }
            }
        }
    }, [user, data]);







    // if student --- show profile and done
    // if tutor --- make them set it up (by displaying a big message saying "please set your profile with the button) and then give them a popup that its been set up instead of the text
    return (
        <div>

            {!displayPickAvailabilityMsg ? <div class={"alert alert-success"} role={"alert"}>Profile is set up!</div>:

                <div>
                    <div class={"alert alert-warning"} role={"alert"} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>Please set up tutor profile
                        <div class="btn pull-right">
                            <SetupProfile/>
                        </div>
                    </div>


                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header>
                            <Modal.Title>Profile Setup Required</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p>Please click on the following button to set up your tutor profile. Thank you!</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <SetupProfile onClick={() => handleClose()}/>

                        </Modal.Footer>
                    </Modal>
                </div>
            }

            {/*<button onClick={() => setShowSetupProfile(prevShow => !prevShow)}>Toggle Setup Profile</button>*/}

            {/*{showSetupProfile && <SetupProfile />}*/}


                <div className="container py-5">

                    {/*this is for the left card with the image*/}
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="card mb-4">
                                <div className="card-body text-center">
                                    <img
                                        src={data?.url ? data.url : url}
                                        alt="avatar"
                                        className="rounded-circle img-fluid avatar-image"/>

                                    <input type={"file"} onChange={handleImageChange}/>
                                    <button type="submit" className="btn btn-secondary btn-sm" onClick={handleImageSubmit}>Submit</button>

                                    <h5 className="my-3">{data?.firstName} {data?.lastName}</h5>
                                    <p className="text-muted mb-1">{data?.userRole}</p>
                                    <p className="text-muted mb-4">{user?.email}</p>
                                    <div className="d-flex justify-content-center mb-2">
                                        <button type="button" className="btn btn-primary" onClick={handleLogout}>Logout</button>
                                        <button type="button" className="btn btn-outline-primary ms-1" onClick={() => navigate("/appointments")}>Appointments
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/*this is for the right card section*/}
                        <div className="col-lg-8">
                            <div className="card mb-4">
                                <div className="card-body">

                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">First Name</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted mb-0">{data?.firstName}</p>
                                        </div>
                                    </div>

                                    <hr></hr>
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Last Name</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted mb-0">{data?.lastName}</p>
                                        </div>
                                    </div>

                                    <hr/>
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Email</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted mb-0">{user?.email}</p>
                                        </div>
                                    </div>

                                    <hr/>
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Account Type</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted mb-0">{data?.userRole}</p>
                                        </div>
                                    </div>

                                    <hr/>
                                    <div className="row">
                                        <div className="col-sm-3">
                                            <p className="mb-0">Username</p>
                                        </div>
                                        <div className="col-sm-9">
                                            <p className="text-muted mb-0">{data?.username}</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            {/*<p>First Name: {data?.firstName}</p>*/}
            {/*<p>Last Name: {data?.lastName}</p>*/}
            {/*/!* TODO: also include email in firestore document for each user so we can do data?.email instead of user?.email *!/*/}
            {/*<p>Email: {user?.email}</p>*/}


        </div>
    )
}

// put these functions here so they can be imported by TutorProfile.js
// profile image handling
const handleImageChange = (e, setImage) => {
    if (e.target.files[0]){ // if the file name exists -- then set it as the image (using file since that is input type)
        setImage(e.target.files[0])
    }
}

async function handleImageSubmit(setUrl, image, url, updateDocument, user) {
    const imageRef = ref(storage, "image") // inside storage you will create a field named image on submit (reference)
    uploadBytes(imageRef, image) // upload image to that reference -> then get URl -> then set URL
        .then(() => getDownloadURL(imageRef) // url is only used to store into database so we can fetch
            .then((url) => setUrl(url))
        )

    // doing a put
    const updatedProfileSetupValue = await updateDocument("users", user.uid, {url: url});
    console.log("image: ", image)
    console.log("url: ", url)
}



export default ProfilePage;
export {handleImageSubmit, handleImageChange}