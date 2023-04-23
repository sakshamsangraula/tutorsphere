import { useEffect, useState } from "react";
import { useAuthContext } from "../components/context/UserAuthContext";
import MeetingScheduler from "../components/MeetingScheduler";
import AvailabilityPicker from "../components/profile/AvailabilityPicker";
import MeetingSchedulerFinal from "../components/profile/MeetingSchedulerFinal";
import WeekSchedule from "../components/profile/WeekSchedule";
import useFirestore  from "../firestore";
import { doc, deleteDoc } from "firebase/firestore";
import { firestore} from "../firebase";

import Select from 'react-select';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function AppointmentsPage(){

    const {user} = useAuthContext();
    const {data, appointmentsData, getAllSubjects, getAllTutors, futureAppointments} = useFirestore();
    const [showAvailabilityPicker, setShowAvailabilityPicker] = useState(false);
    const [showMeetingSchedule, setMeetingSchedule] = useState(false);
    const [allSubjects, setAllSubjects] = useState([]);
    const [allTutors, setAllTutors] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [filteredTutors, setFilteredTutors] = useState([]);
    const [showUpcomingAppointments, setShowUpcomingAppointments] = useState(false);
    const [cancelAppointment, setCancelAppointment] = useState();
    const [userFutureAppointments, setUserFutureAppointments] = useState([]);

    console.log("userFutureAppointments",userFutureAppointments); 

    const selectedSubjectsList = selectedSubjects.map(subject => subject.value);

    function handleSubjectSelect(newValue, actionMeta) {
        setSelectedSubjects(newValue);
      }

    useEffect(() => {

        if(user && data){
            if(data.userRole === "tutors" && !data.isProfileSetup){
                setShowAvailabilityPicker(true);
            }

            if(data.userRole === "students"){
                setMeetingSchedule(true);
            }
        }

        

        async function getSubjects(){
            const subjects = await getAllSubjects();
            console.log("subjects", subjects);
            const subjectOptions = subjects.map(subject => {
                return {
                    // TODO: convert label to camelcase
                    label: subject,
                    value: subject
                }
            });
            console.log("subjectOptions", subjectOptions)
            setAllSubjects(subjectOptions);
        }

        getSubjects();

    }, [user, data]);

    useEffect(() => {
        async function getAndSetTutors(){
          const allTutors = await getAllTutors();
          console.log("allTutors", allTutors)
          setAllTutors(allTutors);
        }
        getAndSetTutors();

        async function getAndSetFutureAppointments(){
            // const currentUserFutureAppointments = await futureAppointments();
            // console.log("insidegetAndSetFutureAppointments and user id is", currentUserFutureAppointments, user?.uid);
            // setUserFutureAppointments(currentUserFutureAppointments);
            setUserFutureAppointments(futureAppointments);
        }
        getAndSetFutureAppointments();
      }, [data, futureAppointments]);


      useEffect(() => {
        function cancelThisAppointment(){
          const allTutors = userFutureAppointments.map(appointment=>{
            if(appointment?.id === cancelAppointment){
                deleteDoc(doc(firestore, 'appointments', appointment.id));

            }
          })
        }
        cancelThisAppointment();

      }, [cancelAppointment]);

    //   useEffect(() => {
    //     async function getAndSetFutureAppointments(){
    //         const currentUserFutureAppointments = await futureAppointments();
    //         setUserFutureAppointments(currentUserFutureAppointments);
    //     }
    //     getAndSetFutureAppointments();
    //   }, []);


      useEffect(() => {

        const selectedTutors = allTutors.filter(tutor => {
            for(let i=0; i < selectedSubjects.length; i++){
                // select the tutor if it has a subjects property and has all the subjects chosen by the user
                const subject = selectedSubjects[i]
                if(tutor.hasOwnProperty("subjects")){
                    if(!tutor.subjects.includes(subject.value)){
                        console.log("subject not in tutor", subject, tutor)
                        return false;
                    }
                }else{
                    return false;
                }
            }
           
            return true;
        });

        console.log("selectedTutors", selectedTutors)
        // const found = arr1.some(r=> arr2.includes(r))
        setFilteredTutors(selectedTutors);

      }, [selectedSubjects]);


      console.log("filteredTutors", filteredTutors)

    return (
        <div>
           <p> Appointments Page </p>
            {/* {!data?.isProfileSetup &&   <div> <ProfileSetup /> </div>} */}


            {data?.userRole === "tutors" && <button onClick={() => setShowAvailabilityPicker(prevValue => !prevValue)}>Toggle Availability</button>}
            {showAvailabilityPicker && <AvailabilityPicker />}


            {/* only show meeting schedule if the user is a student */}
            {/* {showMeetingSchedule && <MeetingSchedulerFinal />} */}

            {/* show modal for upcoming appointments TODO: try to reuse the modal component */}

            <Button variant="primary" onClick={() => setShowUpcomingAppointments(true)}>
                Show Upcoming Appointments
            </Button>

            <Modal show={showUpcomingAppointments} onHide={() => setShowUpcomingAppointments(false)} size="xl" animation={false}>
                <Modal.Header closeButton>
                <Modal.Title>Upcoming Appointments</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <table className="table">
                        <thead>
                            <tr>
                            <th scope="col">Student Name</th>
                            <th scope="col">Tutor Name</th>
                            <th scope="col">Start Date and Time</th>
                            <th scope="col">End Date and Time</th>
                            <th scope="col">Subjects</th>
                            <th scope="col">Notes/Description</th>
                            <th scope="col">Cancel Appointment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                userFutureAppointments.map(appointment => {
                                    return (
                                        <tr key={appointment?.id}>
                                            <td>{appointment?.studentName}</td>
                                            <td>{appointment?.tutorName}</td>
                                            <td>{appointment?.startTime}</td>
                                            <td>{appointment?.endTime}</td>
                                            <td>{appointment?.subjects?.join(", ")}</td>
                                            <td>{appointment?.appointmentDescription}</td>
                                            <td>
                                            <Button variant="secondary" onClick={() => setCancelAppointment(appointment?.id)}>
                                                Cancel Appointment
                                                
                                            </Button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowUpcomingAppointments(false)}>
                    Close
                </Button>
                
                {/* <Button variant="primary" onClick={handleSubmit}>
                    Submit
                </Button> */}
                </Modal.Footer>
            </Modal>

            {/* ask the user to select subjects first */}
            <p>Select a subject</p>
            <Select
                isMulti
                name="subjects"
                options={allSubjects}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleSubjectSelect}
            />

            <MeetingSchedulerFinal allTutors={filteredTutors.length === 0 ? allTutors : filteredTutors} selectedSubjects={selectedSubjectsList}/>



            {/* <WeekSchedule /> */}


            {/* {data?.isProfileSetup && <div>profile setup </div>}  */}
        </div>
    )
}