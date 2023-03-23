import { useState } from 'react';
import ScheduleSelector from 'react-schedule-selector';

function AvailabilityPicker(){
    // TODO: set schedule to be from firestore user?.schedule or else empty if not there
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


    // console.log("SCHEDULE IS",  schedule);
    console.log("WEEK SCHEDULE IS", weekSchedule);

    const handleChange = newSchedule => {
        setSchedule(newSchedule);
    }

    function prepareWeeklySchedule(){
        schedule.forEach(availability => {
            const dayName = dayNames[availability.getDay()];
            // const timeInHourAndMinutes = `${availability.getHours()}:${availability.getMinutes()}`;
            const hour = availability.getHours();


            setWeekSchedule(prevWeekSchedule => {
                const updatedAppointments = [...prevWeekSchedule[dayName]];
                if(!updatedAppointments.includes(hour)){
                    updatedAppointments.push(hour);
                }
                return {...prevWeekSchedule, [dayName]: updatedAppointments};
            });

            // console.log("availability is", availability)
            // console.log("dayname", dayName);
            // console.log("previouseAppointments", weekSchedule)
            // const updatedAppointments = [...weekSchedule[dayName], timeInHourAndMinutes];
            // console.log("updatedAppointments", updatedAppointments)

            // const newWeekSchedule = {...weekSchedule};
            // newWeekSchedule[dayName] = updatedAppointments;
            // console.log("newWeekSchedule", newWeekSchedule)
            // setWeekSchedule(newWeekSchedule)

        });
    }

    return (
        <div>
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
            <button onClick={prepareWeeklySchedule}>Submit Schedule</button>
        </div>
    )
      
}
export default AvailabilityPicker;