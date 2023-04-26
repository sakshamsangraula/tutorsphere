import React, { useEffect, useState } from 'react';
import { ScheduleMeeting } from 'react-schedule-meeting';
import useFirestore from '../../firestore';
import { useAuthContext } from '../context/UserAuthContext';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Navigate, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import SendGridApi from '../utils/SendGridApi';
import axios from "axios"


export default function MeetingSchedulerFinal({allTutors, filteredTutors, selectedSubjects, firstShow}) {

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
  const [selectedSubjectsForTutor, setSelectedSubjectsForTutor] = useState([]);

  const daysOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const navigate = useNavigate();

  console.log("selectedSubjectsForTutor", selectedSubjectsForTutor)

  
  const sendEmail = async (to, subject, text) => {
    const data = {
      to,
      subject,
      text,
    };
  
    try {
      const response = await axios.post("http://localhost:3001/send-email", data);
      console.log("Email sent:", response.data);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };
  


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

// TODO: if the student doesn't select a subject then it'll be empty (instead have the subject as the list of subjects that the tutor has by default if the student doesn't select a subject)

// const allTutorElements = allTutors.map(tutor => {
//     return (

//       <button key={tutor.id} type="button" onClick={() => handleTutorClick(tutor)} className="btn btn-primary">
//         <p>{tutor.firstName} {tutor.lastName}</p>
//       </button>
//       // <div className="card">
//       //   <div className="card-body">
//       //     <p>{tutor.firstName} {tutor.lastName}</p>
//       //   </div>
//       // </div>
//     )
//   })

  function handleTutorClick(tutor){
    console.log("called handletutorclick TUTORIS", tutor);
    if(tutor){
      setSelectedTutor(tutor);
      // if the tutor doesn't have a schedule then it won't create maximum
      // depth exceeded recursion error because we explicitly check if
      // tutor schedule exists and only set the schedule if it exists
      if(tutor?.schedule){
        console.log("called handletutorclick schedule", tutor.schedule);
        setTutorSchedule(tutor.schedule);
      }
    }
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

  function prepareAppointmentData(appointmentSelection, passedInSubjects){
    // reset the description state so each time will have an empty description/notes section
    setAppointmentDescription("");

    console.log("passedInSubjects", passedInSubjects)

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
      subjects: passedInSubjects
    }

    setShowModal(true);
    setAppointmentData(appointmentData);
    console.log("appointmentData", appointmentData);
  }

        // TODO: show a success create appointment message when appointment is created (use state to store message)
  async function createAppointment(){
    // save appointment data along with appointment description to firestore
    try{
      const docRef = await addDocumentToCollectionWithDefaultId(APPOINTMENTS_COLLECTION, {...appointmentData, appointmentDescription});
      // TODO: show a success create appointment message when appointment is created (use state to store message)
      setShowModal(false);

      // send email with appointment data
      // TODO: send email to student and tutor saying that appointment was created

      try{
        let emailContent = `Appointment with ${appointmentData?.studentName} and ${appointmentData?.tutorName}
        \n. The meeting will start on ${appointmentData?.startTime} and end on ${appointmentData?.endTime}. The meeting will cover the following subjects: ${appointmentData?.subjects.join(",")}`;
  
        if(appointmentDescription){
          emailContent += `\nAppointment Description is: ${appointmentDescription}`
        }
  
        sendEmail("sakshamsangraula45@gmail.com", "Tutoring Appointment With Tutorsphere Confirmed", emailContent)
  
      }catch(err){
        console.log("Error sending email via sendgrid", err);
        alert("Error sending email via sendgrid")
      }
      
      // reload the window once appointment is created
      // window.location.reload();
      // navigate("/appointments");
      // setReloadPage(true);


      // return <Navigate to="/appointments" />

      // window.history.pushState({}, "", '/appointments');
    


    }catch(err){
      console.log("Error adding document to appointments collection", err);
      // TODO: save error to state and show error on the screen in an error box instead of alert
      alert("Error creating an appointment!");
    }

  }

  const allTutorsOptions = allTutors?.map(tutor => {
    return {
      label: tutor.firstName + " " + tutor.lastName,
      value: tutor
    }
  })

  const allFilteredTutorsOptions = filteredTutors.map(tutor => {
    return {
      label: tutor.firstName + " " + tutor.lastName,
      value: tutor
    }
  })

  console.log("selectedSubjectsis---", selectedSubjects);

  function handleTutorSelect(selectedOption, actionMeta){
    const userSelectedTutor = selectedOption?.value
    if(userSelectedTutor){
      setSelectedTutor(userSelectedTutor);
      // if the tutor doesn't have a schedule then it won't create maximum
      // depth exceeded recursion error because we explicitly check if
      // tutor schedule exists and only set the schedule if it exists
      if(userSelectedTutor?.schedule){
        setTutorSchedule(userSelectedTutor.schedule);
      }
    }
  }

  function getLabelAndValue(listOfValues){
    return listOfValues?.map(listElement => {
      return {
        label: listElement,
        value: listElement
      }
    })
  }

console.log("selectedTutorselectedTutor", selectedTutor)

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

      {/* <h1>All Tutors</h1> */}
      {/* <div className="container-sm">
        {allTutorElements}
      </div>     */}


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

      {/* TODO: make sure that appointment can only be created if tutor is selected and subjects are also selected and if no subject is selected then that's ok. Also, add a feature to filter based on favorite tutors so favorite tutors will be shown instead of all tutors */}

      {/* TODO: create a google meets link and add it in the appointment object in firestore so that it's saved with the appointment, update the upcoming appointments table with the google meets link */}

      {/* TODO: maybe also sort the appointments by start date if it's not already done by default */}

      {firstShow === "subjectsFirst" ? 

      <div>
      {selectedSubjects?.length > 0 && <div className="mt-4 d-flex justify-content-start custom-gap align-items-center">
            <p>Step 2: Select a tutor </p>
            <Select
              name="tutors"
              options={allFilteredTutorsOptions}
              classNamePrefix="select"
              onChange={handleTutorSelect}
              menuPortalTarget={document.body} 
              styles={{ 
                menuPortal: (base) => ({ ...base, zIndex: 9999 })
              }} // make sure the list of options is not blocked by the calendar
            />
      </div>}

      {selectedSubjects?.length > 0 && selectedTutor && <ScheduleMeeting
        borderRadius={10}
        primaryColor="#3f5b85"
        availableTimeslots={finalAvailabilitySlots}
        // TODO: right now, appointments can only be made for 1 hour but try to see if dynamic duration can work by updating approach
        eventDurationInMinutes={60}
        onStartTimeSelect={(appointmentSelection) => prepareAppointmentData(appointmentSelection, selectedSubjects)}/>}
      </div>
      : 
        <div>
          <div className="mt-4 d-flex justify-content-start custom-gap align-items-center">
            <p>Step 1: Select a tutor </p>
            <Select
              name="tutors"
              options={allTutorsOptions}
              classNamePrefix="select"
              onChange={handleTutorSelect}
              menuPortalTarget={document.body} 
              styles={{ 
                menuPortal: (base) => ({ ...base, zIndex: 9999 })
              }} // make sure the list of options is not blocked by the calendar
            />
          </div>

          {selectedTutor && <div className="mt-4 d-flex justify-content-start custom-gap align-items-center">
            <p>Step 2: Select subject(s) </p>
            <Select
              isMulti
              options={getLabelAndValue(selectedTutor?.subjects)}
              classNamePrefix="select"
              onChange={(selectedValue, actionMeta) => setSelectedSubjectsForTutor(selectedValue?.map(selected => selected.value))}
              menuPortalTarget={document.body} 
              styles={{ 
                menuPortal: (base) => ({ ...base, zIndex: 9999 })
              }} // make sure the list of options is not blocked by the calendar
            />
          </div>}

          {selectedTutor && selectedSubjectsForTutor?.length > 0 && 
            <ScheduleMeeting
            borderRadius={10}
            primaryColor="#3f5b85"
            availableTimeslots={finalAvailabilitySlots}
            // TODO: right now, appointments can only be made for 1 hour but try to see if dynamic duration can work by updating approach
            eventDurationInMinutes={60}
            onStartTimeSelect={(appointmentSelection) => prepareAppointmentData(appointmentSelection, selectedSubjectsForTutor)}
            />
          }
        </div>
      }
    </div>
  );
}
