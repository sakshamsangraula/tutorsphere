import { useEffect, useState } from "react";
import { useAuthContext } from "../components/context/UserAuthContext";
import MeetingScheduler from "../components/MeetingScheduler";
import AvailabilityPicker from "../components/profile/AvailabilityPicker";
import MeetingSchedulerFinal from "../components/profile/MeetingSchedulerFinal";
import WeekSchedule from "../components/profile/WeekSchedule";
import useFirestore from "../firestore";


export default function AppointmentsPage(){

    const {user} = useAuthContext();
    const {data} = useFirestore();
    console.log("DATA IN APPOINTMENTS PAGE", data?.isProfileSetup);
    const [showAvailabilityPicker, setShowAvailabilityPicker] = useState(false);
    const [showMeetingSchedule, setMeetingSchedule] = useState(false);

    useEffect(() => {

        if(user && data){
            if(data.userRole === "tutors" && !data.isProfileSetup){
                setShowAvailabilityPicker(true);
            }

            if(data.userRole === "students"){
                setMeetingSchedule(true);
            }
        }

    }, [user, data]);

    return (
        <div>
           <p> Appointments Page </p>
            {/* {!data?.isProfileSetup &&   <div> <ProfileSetup /> </div>} */}


            {data?.userRole === "tutors" && <button onClick={() => setShowAvailabilityPicker(prevValue => !prevValue)}>Toggle Availability</button>}
            {showAvailabilityPicker && <AvailabilityPicker />}


            {/* only show meeting schedule if the user is a student */}
            {/* {showMeetingSchedule && <MeetingSchedulerFinal />} */}

            <MeetingSchedulerFinal />



            {/* <WeekSchedule /> */}


            {/* {data?.isProfileSetup && <div>profile setup </div>}  */}
        </div>
    )
}