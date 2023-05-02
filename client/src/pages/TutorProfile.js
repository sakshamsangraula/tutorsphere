import React from "react";
import {useEffect, useState} from "react";
import useFirestore from "../firestore";
import {useParams} from  "react-router-dom"
import { useAuthContext } from "../components/context/UserAuthContext";
import {useNavigate} from "react-router-dom"

export default function TutorProfile (){
    const [tutor, setTutor] = useState();
    const {getUser} = useFirestore()
    const {logout} = useAuthContext()
    const {id} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        fetchTutor()
        console.log("tutor", tutor)
    }, [])

    const fetchTutor = async () => {
        const tutorData = await getUser(id)
        console.log("tutorData", tutorData);
        setTutor(tutorData)
    }

    const handleLogout = () => {
        logout();
        navigate("/");
    };


    return(
        <div className="container py-5">

            {/*this is for the left card with the image*/}
            <div className="row">
                <div className="col-lg-4">
                    <div className="card mb-4">
                        <div className="card-body text-center">
                            <img
                                src={tutor?.url}
                                alt="avatar"
                                className="rounded-circle img-fluid avatar-image"/>


                            <h5 className="my-3">{tutor?.firstName} {tutor?.lastName}</h5>
                            <p className="text-muted mb-1">{tutor?.userRole}</p>
                            {/*<p className="text-muted mb-4">{user?.email}</p>*/}
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
                                    <p className="text-muted mb-0">{tutor?.firstName}</p>
                                </div>
                            </div>

                            <hr></hr>
                            <div className="row">
                                <div className="col-sm-3">
                                    <p className="mb-0">Last Name</p>
                                </div>
                                <div className="col-sm-9">
                                    <p className="text-muted mb-0">{tutor?.lastName}</p>
                                </div>
                            </div>

                            <hr/>
                            <div className="row">
                                <div className="col-sm-3">
                                    <p className="mb-0">Email</p>
                                </div>
                                <div className="col-sm-9">
                                    <p className="text-muted mb-0">{tutor?.email}</p>
                                </div>
                            </div>

                            <hr/>
                            <div className="row">
                                <div className="col-sm-3">
                                    <p className="mb-0">Account Type</p>
                                </div>
                                <div className="col-sm-9">
                                    <p className="text-muted mb-0">{tutor?.userRole}</p>
                                </div>
                            </div>

                            <hr/>
                            <div className="row">
                                <div className="col-sm-3">
                                    <p className="mb-0">Username</p>
                                </div>
                                <div className="col-sm-9">
                                    <p className="text-muted mb-0">{tutor?.username}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )

}