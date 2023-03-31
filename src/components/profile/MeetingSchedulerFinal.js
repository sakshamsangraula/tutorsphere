import React, { useEffect, useState } from 'react';
import { ScheduleMeeting } from 'react-schedule-meeting';
import useFirestore from '../../firestore';
import { useAuthContext } from '../context/UserAuthContext';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

export default function MeetingSchedulerFinal({allTutors, selectedSubjects}) {

    // TODO: use environment variable instead of a constant here
    const APPOINTMENTS_COLLECTION = "appointments";
    const {user} = useAuthContext();
    const {data, appointmentsData, getAllTutors, addDocumentToCollectionWithDefaultId} = useFirestore();
    const schedule = {
      monday: [8, 17, 18],
      tuesday: [10],
      wednesday: [13, 14, 17],
      thursday: [9],
      friday: [12],
      saturday: [8, 17, 18],
      sunday: [9, 10, 11],
  }

  const daysInWeekMap = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };
  
  const [tutorSchedule, setTutorSchedule] = useState({});
  const [selectedTutor, setSelectedTutor] = useState();
  const [showModal, setShowModal] = useState(false);
  const [appointmentDescription, setAppointmentDescription] = useState("");
  const [appointmentData, setAppointmentData] = useState({});
  const [selectedTutorExistingAppointments, setSelectedTutorExistingAppointments] = useState([]);

  const daysOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

//   const availabilitySlots = Object.keys(schedule).map((day) => {
//     const dayIdx = daysOrder?.indexOf(day);
//         return schedule[day].map(availableTime => {
//             return {
//                 startTime: new Date(new Date(new Date().setDate(new Date().getDate() + dayIdx)).setHours(availableTime, 0, 0, 0)),
//                 endTime: new Date(new Date(new Date().setDate(new Date().getDate() + dayIdx)).setHours(availableTime+1, 0, 0, 0)),
//             }
//         });
//     }
//   );

useEffect(() => {
    if(selectedTutor){
      const selectedTutorsAppointments = appointmentsData?.filter(appointment => appointment.tutorId === selectedTutor.id);
      setSelectedTutorExistingAppointments(selectedTutorsAppointments);
    }
}, [appointmentsData, selectedTutor])


console.log("tutorSchedule", tutorSchedule)
const availabilitySlots = tutorSchedule && Object.keys(tutorSchedule)?.map((day) => {
    const dayIdx = daysOrder.indexOf(day);
    console.log("DAYANDIDX", day, dayIdx);
    return tutorSchedule[day].map(availableTime => {
        const date = new Date();

        const dayOfWeek = date.getDay();
        const daysUntilNextMatchingDay = (7 - dayOfWeek + daysInWeekMap[day]) % 7;
        date.setDate(date.getDate() + daysUntilNextMatchingDay);

        const matchingDates = [];

        // Generate all matching dates in the next 4 weeks
        // for (let i = 0; i < 4; i++) {
          const matchingDate = new Date(date);
          matchingDate.setDate(date.getDate() + 0 * 7);
        //   matchingDates.push(matchingDate.toISOString().slice(0, 10));
        // }

      const startEndObj =  {
        // startTime: new Date(new Date(new Date().setDate(new Date().getDate() + dayIdx)) 
        //                   .setHours(availableTime, 0, 0, 0)),
        // endTime: new Date(new Date(new Date().setDate(new Date().getDate() + dayIdx))
        //                   .setHours(availableTime + 1, 0, 0, 0)),
        startTime: matchingDate.setHours(availableTime, 0, 0, 0),
        endTime: matchingDate.setHours(availableTime + 1, 0, 0, 0),
      }

      // TODO: do not add the date if it exists on the appointments collection for the specific selected tutor
      // can return null in those cases and then filter the null values using filter function
      // have selected tutor as a dependency in useeffect and set already created appointments for the tutor in state and loop over the list here so that each start time we're adding doesn't already exist in the appointments collection

      const startDate = new Date(startEndObj.startTime);
      for(let i=0; i< selectedTutorExistingAppointments.length; i++){
        const appointment = selectedTutorExistingAppointments[i];
        const appointmentStartDate = new Date(appointment.startTime);
        if(startDate.getTime() === appointmentStartDate.getTime()){
          return null;
        }
      }

      return startEndObj;
    });
  })

  const finalAvailabilitySlots = availabilitySlots?.flat()?.filter(slot => slot !== null);
  
//   // Convert the schedule object into an array of date-time objects
//   const availableTimeSlots = Object.entries(schedule).flatMap(([day, times]) => {
//     const date = new Date();
//     const dayOfWeek = date.getDay();
//     const daysUntilNextMatchingDay = (7 - dayOfWeek + daysInWeekMap[day]) % 7;
//     date.setDate(date.getDate() + daysUntilNextMatchingDay);
//     const matchingDates = [];

//     // Generate all matching dates in the next 4 weeks
//     for (let i = 0; i < 4; i++) {
//       const matchingDate = new Date(date);
//       matchingDate.setDate(date.getDate() + i * 7);
//       matchingDates.push(matchingDate.toISOString().slice(0, 10));
//     }

//     // Map the matching dates to time slots
//     return matchingDates.flatMap(date => times.map(time => `${date} ${time}:00`));
//   });

const allTutorElements = allTutors.map(tutor => {
    return (

      <button key={tutor.id} type="button" onClick={() => handleTutorClick(tutor)} className="btn btn-primary">
        <p>{tutor.firstName} {tutor.lastName}</p>
      </button>
      // <div class="card">
      //   <div class="card-body">
      //     <p>{tutor.firstName} {tutor.lastName}</p>
      //   </div>
      // </div>
    )
  })

  function handleTutorClick(tutor){
    console.log("called handletutorclick");
    setSelectedTutor(tutor);
    setTutorSchedule(tutor.schedule);
  }

  function convertTimeStampToCDTDate(timeStamp){
    const unixTimestamp = timeStamp;
    const date = new Date(unixTimestamp);
    // date.setUTCHours(date.getUTCHours() - 5); // subtract 5 hours for CDT
    const options = { timeZone: 'America/Chicago' };
    const cstDateTimeString = date.toLocaleString('en-US', options);
    // return date.toString();
    return cstDateTimeString;
  }

  function prepareAppointmentData(appointmentSelection){
    // reset the description state so each time will have an empty description/notes section
    setAppointmentDescription("");

    // TODO: generate and add google meets link here to the appointmentData so that it can be saved in the appointments collection
    const appointmentData = {
      // student: {
      //   studentId: data?.id,
      //   studentName: data?.firstName + " " + data?.lastName
      // },
      studentId: data?.id,
      studentName: data?.firstName + " " + data?.lastName,
      tutorId: selectedTutor?.id,
      tutorName: selectedTutor?.firstName + " " + selectedTutor?.lastName,
      // tutor: {
      //   tutorId: selectedTutor?.id,
      //   tutorName: selectedTutor?.firstName + " " + selectedTutor?.lastName
      // },
      startTime: convertTimeStampToCDTDate(appointmentSelection.availableTimeslot.startTime),
      endTime: convertTimeStampToCDTDate(appointmentSelection.availableTimeslot.endTime),
      subjects: selectedSubjects
    }

    setShowModal(true);
    setAppointmentData(appointmentData);
    console.log("appointmentData", appointmentData);
  }

  async function createAppointment(){
    // save appointment data along with appointment description to firestore
    try{
      const docRef = await addDocumentToCollectionWithDefaultId(APPOINTMENTS_COLLECTION, {...appointmentData, appointmentDescription});
      // TODO: show a success create appointment message when appointment is created (use state to store message)
      setShowModal(false);
    }catch(err){
      console.log("Error adding document to appointments collection", err);
      // TODO: save error to state and show error on the screen in an error box instead of alert
      alert("Error creating an appointment!");
    }

  }

  return (
    // <div>
    //   <ScheduleMeeting
    //     borderRadius={10}
    //     primaryColor="#3f5b85"
    //     availableTimeslots={availabilitySlots.flat()}
    //     eventDurationInMinutes={60}
    //     onStartTimeSelect={console.log}
    //   />
    // </div>

    <div>

      <h1>All Tutors</h1>
      <div className="container-sm">
        {allTutorElements}
      </div>    

      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>Create your appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div>
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <th colSpan="2">Appointment Details</th>
                </tr>
                <tr>
                  <th>Student Name</th>
                  <td>{appointmentData?.studentName}</td>
                </tr> 
                <tr>
                  <th>Tutor Name</th>
                  <td>{appointmentData?.tutorName}</td>
                </tr> 
                <tr>
                  <th>Start Date and Time</th>
                  <td>{appointmentData?.startTime}</td>
                </tr>
                <tr>
                  <th>End Date and Time</th>
                  <td>{appointmentData?.endTime}</td>
                </tr>
                <tr>
                  <th>Subjects</th>
                  <td>{appointmentData?.subjects?.join(", ")}</td>
                </tr>
                <tr>
                  <th>(Optional) Share any notes or details:</th>
                  <td>
                    <textarea 
                      rows="5"
                      cols="30"
                      value={appointmentDescription} 
                      onChange={(e) => setAppointmentDescription(e.target.value)}
                    />
                  </td>
                </tr>
              </tbody>
            </table> 
            </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={createAppointment}>
            Create Appointment
          </Button>
        </Modal.Footer>
      </Modal>

      <ScheduleMeeting
        borderRadius={10}
        primaryColor="#3f5b85"
        availableTimeslots={finalAvailabilitySlots}
        // TODO: right now, appointments can only be made for 1 hour but try to see if dynamic duration can work by updating approach
        eventDurationInMinutes={60}
        onStartTimeSelect={prepareAppointmentData}
      />
    </div>
  );
}
