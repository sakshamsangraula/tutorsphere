import { useEffect, useState } from "react";
import { useAuthContext } from "../components/context/UserAuthContext";
import MeetingSchedulerFinal from "../components/profile/MeetingSchedulerFinal";
import useFirestore from "../firestore";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import "./appointments.css"
import { useNavigate } from "react-router-dom";

export default function AppointmentsPage(){

    const {data, getAllTutors, futureAppointments, cancelAppointment} = useFirestore();
    const [allTutors, setAllTutors] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [filteredTutors, setFilteredTutors] = useState([]);
    const [showUpcomingAppointments, setShowUpcomingAppointments] = useState(false);
    const [userFutureAppointments, setUserFutureAppointments] = useState([]);
    const navigate = useNavigate();


    const selectedSubjectsList = selectedSubjects.map(subject => subject.value);

    useEffect(() => {
        async function getAndSetTutors(){
          const allTutors = await getAllTutors();
          setAllTutors(allTutors);
        }
        getAndSetTutors();

        async function getAndSetFutureAppointments(){
            setUserFutureAppointments(futureAppointments);
        }
        getAndSetFutureAppointments();

      }, [data, futureAppointments]);

     
    async function cancelThisAppointment(cancelAppointmentId){
        await cancelAppointment(cancelAppointmentId);
    }

      useEffect(() => {

        const selectedTutors = allTutors.filter(tutor => {
            for(let i=0; i < selectedSubjects.length; i++){
                const subject = selectedSubjects[i]
                if(tutor.hasOwnProperty("subjects")){
                    if(!tutor.subjects.includes(subject.value)){
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
    
    return (
        <div>

            <div className="d-flex justify-content-center mt-2">
                <Button variant="success" onClick={() => setShowUpcomingAppointments(true)} className="mx-auto">
                    Show Upcoming Appointments
                </Button>
            </div>

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
                            <th scope="col">Appointment ID</th>
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
                                            <td onClick={() => navigate(`/reservations/${appointment?.id}`)}>
                                            <p className="link-primary" style={{cursor: "pointer"}}>                                               {appointment?.id}</p>
                                            </td>
                                            <td>{appointment?.studentName}</td>
                                            <td>{appointment?.tutorName}</td>
                                            <td>{appointment?.startTime}</td>
                                            <td>{appointment?.endTime}</td>
                                            <td>{appointment?.subjects?.join(", ")}</td>
                                            <td>{appointment?.appointmentDescription}</td>
                                            <td>
                                            <Button variant="secondary" onClick={() => cancelThisAppointment(appointment?.id)}>
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

                </Modal.Footer>
            </Modal>

            <MeetingSchedulerFinal filteredTutors={filteredTutors.length === 0 ? allTutors : filteredTutors} allTutors={allTutors} selectedSubjects={selectedSubjectsList}
                />
        </div>
    )
}