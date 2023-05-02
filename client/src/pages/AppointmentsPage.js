import { useEffect, useState } from "react";
import { useAuthContext } from "../components/context/UserAuthContext";
import AvailabilityPicker from "../components/profile/AvailabilityPicker";
import MeetingSchedulerFinal from "../components/profile/MeetingSchedulerFinal";
import WeekSchedule from "../components/profile/WeekSchedule";
import useFirestore from "../firestore";
import Select from 'react-select';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import "./appointments.css"
import GoogleMeetLinkGenerator from "./GoogleMeetLinkGenerator";

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
    // const [appointmentsUpdated, setAppointmentsUpdated] = useState(false);
    // const tutorsOrSubjectsOptions = [
    //     {
    //       label: "Select all tutors",
    //       value: "tutorsFirst"
    //     },
    //     {
    //       label: "Select all subjects",
    //       value: "subjectsFirst"
    //     }
    //   ]
    const [firstShow, setFirstShow] = useState("tutorsFirst");

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
            setUserFutureAppointments(futureAppointments);
        }
        getAndSetFutureAppointments();

      }, [data, futureAppointments]);

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
        setFilteredTutors(selectedTutors);
      }, [selectedSubjects]);

      useEffect(() => {
        // when firstShow changes back to subjects showing first set selected subjects to be empty
        if(firstShow === "subjectsFirst"){
            setSelectedSubjects([]);
        }

      }, [firstShow])
    
    return (
        <div>
            {/* {data?.userRole === "tutors" && <Button className="mt-2 mb-2" onClick={() => setShowAvailabilityPicker(prevValue => !prevValue)}>Toggle Availability</Button>}
            {showAvailabilityPicker && <AvailabilityPicker />} */}

            <div className="d-flex justify-content-end mt-2 mr-3">
                <Button variant="success" onClick={() => setShowUpcomingAppointments(true)}>
                    Show Upcoming Appointments
                </Button>
            </div>

            {/* TODO: move this to appointments page and pass the selected value as a prop to this component so we can show the way that the user chooses */}
{/* 
            {data?.userRole === "students" && <div className="d-flex justify-content-center align-items-center mt-2 mr-3 custom-gap">
                <div className="alert alert-primary mt-4 text-center" role="alert">
                   You can set up an appointment by first looking at the tutors or looking at the subjects and then picking the tutor
                </div> 
                <Select
                    defaultValue={  {
                        label: "Select all tutors",
                        value: "tutorsFirst"
                      } || 'Selecting'}
                    name="tutors or subjects"
                    options={tutorsOrSubjectsOptions}
                    classNamePrefix="select"
                    onChange={(selectedOption, actionMeta) => setFirstShow(selectedOption.value)}
                    menuPortalTarget={document.body} 
                    styles={{ 
                        menuPortal: (base) => ({ ...base, zIndex: 9999 })
                    }} // make sure the list of options is not blocked by the calendar
                />
            </div>} */}


            {data?.userRole === "students" && <div className="alert alert-primary mt-4 text-center" role="alert">
                   Select a tutor, then select a subject and setup an appointment based on tutor's availability!
            </div>} 

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
 
            {/* {data?.userRole === "students" && firstShow === "subjectsFirst" ? <div className="alert alert-primary mt-4 text-center" role="alert">
               Select subject(s) first, then select a tutor, and select date and time to make an appointment
            </div> : <div className="alert alert-primary mt-4 text-center" role="alert">
               Select a tutor first, then select subject(s), and select date and time to make an appointment
            </div> } */}

            {/* {data?.userRole === "students" && firstShow === "subjectsFirst" && <div className="d-flex justify-content-start custom-gap align-items-center">
                <p>Step 1: Select a subject</p>
                <Select
                    isMulti
                    name="subjects"
                    options={allSubjects}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={handleSubjectSelect}
                />
            </div>} */}

            <MeetingSchedulerFinal filteredTutors={filteredTutors.length === 0 ? allTutors : filteredTutors} allTutors={allTutors} selectedSubjects={selectedSubjectsList} firstShow={firstShow}
                />


{/* TODO: use nodejs to create the google meets link and get a new link when needed - when creating an appointment */}
                {/* <GoogleMeetLinkGenerator /> */}
        </div>
    )
}