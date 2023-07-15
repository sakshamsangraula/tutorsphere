import { useEffect, useState } from 'react';
import ScheduleSelector from 'react-schedule-selector';
import useFirestore from '../../firestore';
import { useAuthContext } from '../context/UserAuthContext';
import Button from 'react-bootstrap/Button';
import { Alert } from 'react-bootstrap';

function AvailabilityPicker({ handleSaveSchedule }) {

    const { user } = useAuthContext();
    const { data, updateDocument } = useFirestore();

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

    useEffect(() => {
        if (data?.reactLibrarySchedule?.length > 0) {
            const reactLibraryScheduleDates = data?.reactLibrarySchedule?.map(time => new Date(time));
            setSchedule(reactLibraryScheduleDates);
        } else {
            setSchedule([]);
        }
    }, [data]);

    useEffect(() => {
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
                if (!updatedAppointments.includes(hour)) {
                    updatedAppointments.push(hour);
                }
                return { ...prevWeekSchedule, [dayName]: updatedAppointments };
            });
        });
    }, [schedule]);

    const handleChange = newSchedule => {
        setSchedule([...newSchedule]);
    }

    async function prepareWeeklySchedule() {
        const noAvailabilitySelected = Object.values(weekSchedule).every(value => Array.isArray(value) && value.length === 0);
        if (noAvailabilitySelected) {
            window.alert("You have not selected any availability. You must select at least one availability.");
            return;
        }

        try {
            if (user && data.userRole === TUTOR) {

                await updateDocument(USERS, user.uid, { schedule: weekSchedule });
                const stringSchedule = schedule.map(date => date.toString());
                await updateDocument(USERS, user.uid, { reactLibrarySchedule: stringSchedule });

                // save schedule so setup profile can show the submit button
                handleSaveSchedule();

                setAlert({
                    alertType: "success",
                    message: "Availability saved!"
                });
                setShowAlert(true)
                setTimeout(() => {
                    setShowAlert(false);
                }, 3000);
            } else {
                alert("Only Tutors can provide availability!", user);
                setAlert({
                    alertType: "danger",
                    message: "Only Tutors can provide availability"
                });
                setTimeout(() => {
                    setShowAlert(true);
                }, 5000);
            }
        } catch (err) {
            setAlert({
                alertType: "danger",
                message: "Error saving tutor availability"
            });
        }
    }
    return (
        <div>
            <p>You can click on a block below and drag your cursor to select multiple blocks at one time</p>
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