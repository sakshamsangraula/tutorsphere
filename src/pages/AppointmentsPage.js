import MeetingScheduler from "../components/MeetingScheduler";
import AvailabilityPicker from "../components/profile/AvailabilityPicker";
import WeekSchedule from "../components/profile/WeekSchedule";
import useFirestore from "../firestore";


export default function AppointmentsPage(){

    const {data} = useFirestore();
    console.log("DATA IN APPOINTMENTS PAGE", data?.isProfileSetup);
    return (
        <div>
            Appointments Page
            {/* {!data?.isProfileSetup &&   <div> <ProfileSetup /> </div>} */}


            <AvailabilityPicker />

            <MeetingScheduler />



            {/* <WeekSchedule /> */}


            {/* {data?.isProfileSetup && <div>profile setup </div>}  */}
        </div>
    )
}