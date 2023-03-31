import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../components/context/UserAuthContext";
import useFirestore from "../firestore";
import { useNavigate } from "react-router-dom";

function ProfilePage(){
    const navigate = useNavigate();

    const navigateFavorites = () => {
      navigate('/Favorites');
    };
    const {user} = useAuthContext();
    const {data} = useFirestore(); 
    const [displayPickAvailabilityMsg, setDisplayPickAvailabilityMsg] = useState(false);

    // const changePickAvailabilityMsg = useCallback((value) => {
    //     setDisplayPickAvailabilityMsg(value);
    // }, []);

    let profileMessage = "Profile setup completed ✅";

    useEffect(() => {

        if(user && data){
            if(data.userRole === "tutors" && !data.isProfileSetup){
                setDisplayPickAvailabilityMsg(true);
            }
        }

    }, [user, data]);
    

    return (
        <div className="container py-5">

        {/*this is for the left card with the image*/}
        <div className="row">
            <div className="col-lg-4">
                <div className="card mb-4">
                    <div className="card-body text-center">
                        <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" alt="avatar"
                     className="rounded-circle img-fluid" />
                        <h5 className="my-3">{data?.firstName} {data?.lastName}</h5>
                        <p className="text-muted mb-1">{data?.userRole}</p>
                        <p className="text-muted mb-4">{user?.email}</p>
                        <div className="d-flex justify-content-center mb-2">
                            <button type="button" className="btn btn-primary">Logout</button>
                            <button href="/appointments" type="button" className="btn btn-outline-primary ms-1">Appointments</button>
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

        // <div>
        //     {!displayPickAvailabilityMsg ? "Profile setup completed ✅" :
        //         <p>
        //         All tutors should pick their availability.
        //         <Link className="navbar-brand" to="/appointments">Click here to pick your availability</Link>
        //         </p>
        //     }
        //     <p>First Name: {data?.firstName}</p>
        //     <p>Last Name: {data?.lastName}</p>
        //     {/* TODO: also include email in firestore document for each user so we can do data?.email instead of user?.email */}
        //     <p>Email: {user?.email}</p>
        //     <button type="button" class="btn btn-danger" onClick={navigateFavorites}>Tutor Favorites</button>
        //
        // </div>
    )
}

export default ProfilePage;