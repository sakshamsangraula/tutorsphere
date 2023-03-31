import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../components/context/UserAuthContext";
import SetupProfile from "../components/profile/SetupProfile";
import useFirestore from "../firestore";

function ProfilePage(){

    // TODO: allow student to update their profile by adding profile picture (and maybe description). Allow adding about-me and profile pic for tutor in their profile

    const {user} = useAuthContext();
    const {data} = useFirestore(); 
    const [displayPickAvailabilityMsg, setDisplayPickAvailabilityMsg] = useState(false);
    const [showSetupProfile, setShowSetupProfile] = useState(true);

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
            } 
            
           
        }

    }, [user, data]);
    

    return (
        <div>
            {!displayPickAvailabilityMsg ? "Profile setup completed ✅" : 
               <SetupProfile />
            }

            <button onClick={() => setShowSetupProfile(prevShow => !prevShow)}>Toggle Setup Profile</button>

            {showSetupProfile && <SetupProfile />}

            {displayPickAvailabilityMsg}
            <p>First Name: {data?.firstName}</p>
            <p>Last Name: {data?.lastName}</p>
            {/* TODO: also include email in firestore document for each user so we can do data?.email instead of user?.email */}
            <p>Email: {user?.email}</p>
        </div>
    )
}

export default ProfilePage;