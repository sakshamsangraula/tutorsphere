import { useEffect, useState } from 'react';
import ScheduleSelector from 'react-schedule-selector';
import useFirestore from '../../firestore';
import { useAuthContext } from '../context/UserAuthContext';
import Button from 'react-bootstrap/Button';
import { Alert } from 'react-bootstrap';

function AvailabilityPicker({handleSaveSchedule}){
    // TODO: set schedule to be from firestore user?.schedule or else empty if not there

    const {user} = useAuthContext();
    const {data, updateDocument} = useFirestore();

    const [schedule, setSchedule] = useState([]);
    const [weekSchedule, setWeekSchedule] = useState({
        "sunday": [],
        "monday": [],
        "tuesday": [],
        "wednesday": [],
        "thursday": [],
        "friday": [],
        "saturday": [],
    });
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const USERS = "users";
    const TUTOR = "tutors";
    const [alert, setAlert] = useState({
        alertType: "success",
        message: ""
    });
    const [showAlert, setShowAlert] = useState(false);

    // useEffect only runs once here --> get reactlibrary schedule and set schedule to it so previous tutor availability selection is shown
    useEffect(() =>{
        // console.log("data.reactLibrarySchedule", data)
        if(data?.reactLibrarySchedule?.length > 0){
            const reactLibraryScheduleDates = data?.reactLibrarySchedule?.map(time => new Date(time));
            setSchedule(reactLibraryScheduleDates);
        }else{
            setSchedule([]);
        }
    }, [data]);


    // TODO: important finding --> if the state doesn't immediately change then use USE EFFECT
    // AND ADD THE NECESSARY STATE VALUE IN THE ARRAY AND WHENEVER THAT STATE CHANGES, 
    // WE CAN ALSO UPDATE ANOTHER NEW STATE THAT DEPENDS ON THE ARRAY STATE (HERE WEEKSCHEDULE
    // DEPENDS ON SCHEDULE)

    useEffect(() => {
        
        // console.log("SCHEDULECHANGED--------------------------", schedule);

        // if schedule is empty set weekly schedule to empty (better to just reset weekly schedule to empty every time schedule changes and then readd all the schedule)
        setWeekSchedule({
            "sunday": [],
            "monday": [],
            "tuesday": [],
            "wednesday": [],
            "thursday": [],
            "friday": [],
            "saturday": [],
        });
        schedule.forEach(availability => {
            const dayName = dayNames[availability.getDay()];
            const hour = availability.getHours();
            setWeekSchedule(prevWeekSchedule => {
                const updatedAppointments = [...prevWeekSchedule[dayName]];
                if(!updatedAppointments.includes(hour)){
                    updatedAppointments.push(hour);
                }
                // console.log("weekscheduleAFTERADDING{...prevWeekSchedule, [dayName]: updatedAppointments}", {...prevWeekSchedule, [dayName]: updatedAppointments})
                return {...prevWeekSchedule, [dayName]: updatedAppointments};
            });
        });
        // updateWeeklySchedule()
    }, [schedule]);


    // console.log("SCHEDULE IS",  schedule);
    // console.log("= SCHEDULE IS", schedule);

    const handleChange = newSchedule => {
        // console.log("(((((((((((((( PREVIOUS SCHEDULE WAS", schedule);
        // console.log(")))))))))))))))) NEW Schedule is", newSchedule);
        setSchedule([...newSchedule]);
    }

    async function updateWeeklySchedule(){
        console.log("SCHEDULE IN PREPARE WEEKLY SCHEDULE IS ???????????????????", schedule)
        schedule.forEach(availability => {
            const dayName = dayNames[availability.getDay()];
            // const timeInHourAndMinutes = `${availability.getHours()}:${availability.getMinutes()}`;
            const hour = availability.getHours();
            // console.log("BEFOREEEEEEEEEEEEEEEEEEEEEE$$$$$$$$$$$$$$$WEEKLY SCHEDULE $$$$$$$$$$$$$$$$", weekSchedule);

            setWeekSchedule(prevWeekSchedule => {
                const updatedAppointments = [...prevWeekSchedule[dayName]];
                if(!updatedAppointments.includes(hour)){
                    updatedAppointments.push(hour);
                }
                return {...prevWeekSchedule, [dayName]: updatedAppointments};
            });
            // console.log("AFTERRRRRRRRRRRRRRRRRRRRR$$$$$$$$$$$$$$$WEEKLY SCHEDULE $$$$$$$$$$$$$$$$", weekSchedule);
        });

    }
    async function prepareWeeklySchedule(){
        
        // updateWeeklySchedule();
        // add schedule to firestore if user is tutor
        try{
            // console.log("$$$$$$$$$$$$$$$WEEKLY SCHEDULE $$$$$$$$$$$$$$$$", weekSchedule);
            if(user && data.userRole === TUTOR){
                const scheduleAddResponse = await updateDocument(USERS, user.uid, {schedule: weekSchedule});
                // console.log("weekScheduleAFTERADDING", weekSchedule)

                // convert each item from schedule to string so firebase doesn't convert it to
                // it's format of schedule
                const stringSchedule = schedule.map(date => date.toString());
                const reactLibraryScheduleAdded = await updateDocument(USERS, user.uid, {reactLibrarySchedule: stringSchedule});
                // console.log("scheduleAddResponse", scheduleAddResponse)

                // save schedule so setup profile can show the submit button
                handleSaveSchedule();

                setAlert({
                    alertType: "success",
                    message: "Availability saved!"
                });
                setTimeout(() => {
                    setShowAlert(true);
                }, 5000);
            }else{
                // console.log("USER ROLE IS $$$$$$$$$$$$$$$$$$$$$$$$", user.userRole)
                alert("Only Tutors can provide availability!", user);
                setAlert({
                    alertType: "danger",
                    message: "Only Tutors can provide availability"
                });
                setTimeout(() => {
                    setShowAlert(true);
                }, 5000);
            }
        }catch(err){
            console.log("error adding schedule to firestore for tutor", err);
            setAlert({
                alertType: "danger",
                message: "Error saving tutor availability"
            });
        }
    }

    // async function prepareWeeklySchedule(){
    //     const updatedWeekSchedule = schedule.map(availability => {
    //       const dayName = dayNames[availability.getDay()];
    //       const hour = availability.getHours();
      
    //       return {
    //         day: dayName,
    //         hour: hour,
    //       };
    //     });
      
    //     const updatedSchedule = {};
    //     for (const dayName of dayNames) {
    //       updatedSchedule[dayName] = updatedWeekSchedule
    //         .filter(availability => availability.day === dayName)
    //         .map(availability => availability.hour);
    //     }
      
    //     setWeekSchedule(updatedSchedule);
      
    //     // add schedule to firestore if user is tutor
    //     try{
    //       console.log("$$$$$$$$$$$$$$$WEEKLY SCHEDULE $$$$$$$$$$$$$$$$", weekSchedule);
    //       if(user && data.userRole === TUTOR){
    //         const scheduleAddResponse = await updateDocument(USERS, user.uid, {schedule: weekSchedule});
    //         console.log("scheduleAddResponse", scheduleAddResponse)
    //       }else{
    //         console.log("USER ROLE IS $$$$$$$$$$$$$$$$$$$$$$$$", user.userRole)
    //         alert("Only Tutors can provide availability!", user);
    //       }
    //     }catch(err){
    //       console.log("error adding schedule to firestore for tutor", err);
    //     }
    //   }
      

    return (
        <div>
            <h4>Availability of {data?.firstName} {data?.lastName}</h4>
            <ScheduleSelector
                        selection={schedule}
                        startDate={new Date('2023-03-19T00:00:00')}							
                        dateFormat={'dddd'}
                        timeFormat={"h:mma"}
                        selectionScheme="linear"
                        numDays={7}
                        minTime={8}
                        maxTime={18}
                        // hourlyChunks={2}
                        hourlyChunks={1}
                        onChange={handleChange}
            />
            <Button variant="success" onClick={prepareWeeklySchedule}>Save Availability</Button>
            {showAlert && <Alert>{alert.message}</Alert>}
        </div>
    )
      
}
export default AvailabilityPicker;