import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../components/context/UserAuthContext";
import useFirestore from "../firestore";

function ProfilePage(){

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
        <div>
            {!displayPickAvailabilityMsg ? "Profile setup completed ✅" : 
                <p>
                All tutors should pick their availability.            
                <Link className="navbar-brand" to="/appointments">Click here to pick your availability</Link>
                </p>
            }
            <p>First Name: {data?.firstName}</p>
            <p>Last Name: {data?.lastName}</p>
            {/* TODO: also include email in firestore document for each user so we can do data?.email instead of user?.email */}
            <p>Email: {user?.email}</p>
        </div>
    )
}

export default ProfilePage;