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
    const [image, setImage] = useState("");
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
    const handleImageChange = (e) => {
        if (e.target.files[0]){ // if the file name exists -- then set it as the image (using file since that is input type)
            setImage(e.target.files[0])
        }
    }

    const handleImageSubmit = () => {
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

    };

    useEffect(() => {

        if(user && data){
            if(data.userRole === "tutors"){
                //setShowSetupProfile(true);

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

            {!displayPickAvailabilityMsg ? <div className={"alert alert-success"} role={"alert"}>Profile is set up!</div>:

                <div>
                    <div className={"alert alert-warning"} role={"alert"} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>Please set up tutor profile
                        {data?.userRole === "tutors" && <div className="btn pull-right">
                            <SetupProfile/>
                        </div>}
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
                            <div className="card mb-4" style={{paddingRight: "70px", paddingLeft: "70px"}}>
                                <div className="card-body text-center">
                                    <img
                                        src={data?.url ? data.url : url}
                                        alt="avatar"
                                        className="rounded-circle img-fluid avatar-image mb-2"/>

                                    <input type={"file"} onChange={handleImageChange}/>
                                    <button type="submit" className="btn btn-secondary btn-sm mt-2" onClick={handleImageSubmit}>Submit</button>

                                <h5 className="my-3">{data?.firstName} {data?.lastName}</h5>
                                <p className="text-muted mb-1">{data?.userRole}</p>
                                <p className="text-muted mb-4">{user?.email}</p>
                                <div className="d-flex justify-content-center mb-2">
                                    <button type="button" className="btn btn-primary" onClick={handleLogout}>Logout</button>
                                    <button type="button" className="btn btn-outline-primary ms-1" onClick={() => navigate("/reservations")}>Appointments</button>
                                    {data?.userRole === "tutors" &&
                                        <SetupProfile/>
                                    }
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


                                {data?.aboutMe &&
                                    <>
                                        <hr/>
                                        <div className="row">
                                            <div className="col-sm-3">
                                                <p className="mb-0">About Me</p>
                                            </div>
                                            <div className="col-sm-9">
                                                <p className="text-muted mb-0">{data?.aboutMe}</p>
                                            </div>
                                        </div>
                                    </>
                                }

                            </div>
                        </div>
                    </div>

                    </div>
                            </div>
        </div>









    )
}


export default ProfilePage;
