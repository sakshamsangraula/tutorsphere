import React, { useCallback, useEffect, useState } from 'react';
import { ScheduleMeeting } from 'react-schedule-meeting';
import useFirestore from '../../firestore';
import { useAuthContext } from '../context/UserAuthContext';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Navigate, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import SendGridApi from '../utils/SendGridApi';
import axios from "axios";
import { renderToStaticMarkup } from 'react-dom/server';
import { Alert } from 'react-bootstrap';
import AlertWithCloseButton from '../utils/AlertWithCloseButton';


export default function MeetingSchedulerFinal({allTutors, filteredTutors, selectedSubjects, firstShow}) {

    // TODO: use environment variable instead of a constant here
    const APPOINTMENTS_COLLECTION = "appointments";
    const {user} = useAuthContext();
    const {data, appointmentsData, getAllTutors, addDocumentToCollectionWithDefaultId, fetchDocumentById} = useFirestore();
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

  const emailConfirmationSubject = "Confirmation of Tutoring Appointment With Tutorsphere";
  
  const [tutorSchedule, setTutorSchedule] = useState({});
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [appointmentDescription, setAppointmentDescription] = useState("");
  const [appointmentData, setAppointmentData] = useState({});
  const [selectedTutorExistingAppointments, setSelectedTutorExistingAppointments] = useState([]);
  const [selectedSubjectsForTutor, setSelectedSubjectsForTutor] = useState([]);
  const [showSubjects, setShowSubjects] = useState(false);
  const [alert, setAlert] = useState({
    variant: "success",
    message: "",
    show: false,
  });

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
      return response.data;
    } catch (error) {
      throw new Error("Error sending email " + error.message);
      console.log("Error sending email " + error.message)
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

const resetSelectedSubjects = useCallback(() => {
  setSelectedSubjectsForTutor([]);
}, [selectedTutor])

useEffect(() => {
  resetSelectedSubjects()
}, [resetSelectedSubjects])


console.log("tutorSchedule", tutorSchedule)
// const availabilitySlots = tutorSchedule && Object.keys(tutorSchedule)?.map((day) => {
//     const dayIdx = daysOrder.indexOf(day);
//     console.log("DAYANDIDX", day, dayIdx);
//     return tutorSchedule[day].map(availableTime => {
//         const date = new Date();

//         const dayOfWeek = date.getDay();
//         const daysUntilNextMatchingDay = (7 - dayOfWeek + daysInWeekMap[day]) % 7;
//         date.setDate(date.getDate() + daysUntilNextMatchingDay);

//         const matchingDates = [];

//         // Generate all matching dates in the next 4 weeks
//         // for (let i = 0; i < 4; i++) {
//           const matchingDate = new Date(date);
//           matchingDate.setDate(date.getDate() + 0 * 7);
//         //   matchingDates.push(matchingDate.toISOString().slice(0, 10));
//         // }

//       const startEndObj =  {
//         // startTime: new Date(new Date(new Date().setDate(new Date().getDate() + dayIdx)) 
//         //                   .setHours(availableTime, 0, 0, 0)),
//         // endTime: new Date(new Date(new Date().setDate(new Date().getDate() + dayIdx))
//         //                   .setHours(availableTime + 1, 0, 0, 0)),
//         startTime: matchingDate.setHours(availableTime, 0, 0, 0),
//         endTime: matchingDate.setHours(availableTime + 1, 0, 0, 0),
//       }

      // TODO: do not add the date if it exists on the appointments collection for the specific selected tutor
      // can return null in those cases and then filter the null values using filter function
      // have selected tutor as a dependency in useeffect and set already created appointments for the tutor in state and loop over the list here so that each start time we're adding doesn't already exist in the appointments collection

//       const startDate = new Date(startEndObj.startTime);
//       for(let i=0; i< selectedTutorExistingAppointments.length; i++){
//         const appointment = selectedTutorExistingAppointments[i];
//         const appointmentStartDate = new Date(appointment.startTime);
//         if(startDate.getTime() === appointmentStartDate.getTime()){
//           return null;
//         }
//       }

//       return startEndObj;
//     });
//   })

//   const finalAvailabilitySlots = availabilitySlots?.flat()?.filter(slot => slot !== null);

// const availabilitySlots = tutorSchedule && Object.keys(tutorSchedule)?.map((day) => {
//   const dayIdx = daysOrder.indexOf(day);
//   console.log("DAYANDIDX", day, dayIdx);
//   return tutorSchedule[day].map(availableTime => {
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

//     return matchingDates.map(matchingDate => {
//       const startEndObj = {
//         startTime: new Date(matchingDate).setHours(availableTime, 0, 0, 0),
//         endTime: new Date(matchingDate).setHours(availableTime + 1, 0, 0, 0),
//       }

//       // TODO: do not add the date if it exists on the appointments collection for the specific selected tutor
//       // can return null in those cases and then filter the null values using filter function
//       // have selected tutor as a dependency in useeffect and set already created appointments for the tutor in state and loop over the list here so that each start time we're adding doesn't already exist in the appointments collection

//       const startDate = new Date(startEndObj.startTime);
//       for(let i=0; i< selectedTutorExistingAppointments.length; i++){
//         const appointment = selectedTutorExistingAppointments[i];
//         const appointmentStartDate = new Date(appointment.startTime);
//         if(startDate.getTime() === appointmentStartDate.getTime()){
//           return null;
//         }
//       }

//       return startEndObj;
//     });
//   })
// })

const availabilitySlots = tutorSchedule && Object.keys(tutorSchedule)?.map((day) => {
  const dayIdx = daysOrder.indexOf(day);
  console.log("DAYANDIDX", day, dayIdx);
  return tutorSchedule[day].map(availableTime => {
    const date = new Date();

    const dayOfWeek = date.getDay();
    const daysUntilNextMatchingDay = (7 - dayOfWeek + daysInWeekMap[day]) % 7;
    date.setDate(date.getDate() + daysUntilNextMatchingDay);

    const matchingDates = [];

    // Calculate the number of weeks in a year (52 or 53)
    const weeksInYear = date.getFullYear() % 4 === 0 && (date.getFullYear() % 100 !== 0 || date.getFullYear() % 400 === 0) ? 53 : 52;

    // Generate all matching dates in the next year
    for (let i = 0; i < weeksInYear; i++) {
      const matchingDate = new Date(date);
      matchingDate.setDate(date.getDate() + i * 7);
      matchingDates.push(matchingDate.toISOString().slice(0, 10));
    }

    return matchingDates.map(matchingDate => {
      const startEndObj = {
        startTime: new Date(matchingDate).setHours(availableTime, 0, 0, 0),
        endTime: new Date(matchingDate).setHours(availableTime + 1, 0, 0, 0),
      }

//       // TODO: do not add the date if it exists on the appointments collection for the specific selected tutor
//       // can return null in those cases and then filter the null values using filter function
//       // have selected tutor as a dependency in useeffect and set already created appointments for the tutor in state and loop over the list here so that each start time we're adding doesn't already exist in the appointments collection

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
})

const finalAvailabilitySlots = availabilitySlots?.flat()?.flat()?.filter(slot => slot !== null);
  
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

function EmailContent() {
  // Inline styles for the email content
  // const containerStyle = {
  //   backgroundColor: '#f0f0f0',
  //   padding: '20px',
  //   fontFamily: 'Arial, sans-serif',
  //   fontSize: '14px',
  //   lineHeight: '1.5',
  //   color: '#333',
  // };

  // const headingStyle = {
  //   fontSize: '20px',
  //   fontWeight: 'bold',
  //   marginBottom: '10px',
  // };

  // const paragraphStyle = {
  //   marginBottom: '15px',
  // };

  // const linkStyle = {
  //   color: '#1a73e8',
  //   textDecoration: 'none',
  // };

  // // Render the email content with inline styles
  // return (
  //   <div style={containerStyle}>
  //     <h1 style={headingStyle}>Hello, John Doe!</h1>
  //     <p style={paragraphStyle}>We're glad to have you as a member of our community.</p>
  //     <p style={paragraphStyle}>Please take a moment to <a href="#" style={linkStyle}>verify your email address</a>.</p>
  //     <p style={paragraphStyle}>If you have any questions, feel free to <a href="#" style={linkStyle}>contact us</a>.</p>
  //     <p style={paragraphStyle}>Thank you!</p>
  //   </div>
  // );

  return (
    `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Template</title>
  </head>
  <body>
    <div style="background-color:#f0f0f0; padding:20px; font-family:Arial, sans-serif; font-size:14px; line-height:1.5; color:#333;">
      <div style="max-width:600px; margin:0 auto; background-color:#ffffff; padding:30px; border-radius:5px; box-shadow:0 3px 6px rgba(0, 0, 0, 0.1);">
        <h1 style="font-size:20px; font-weight:bold; margin-bottom:10px;">Hello, John Doe!</h1>
        <p style="margin-bottom:15px;">We're glad to have you as a member of our community.</p>
        <p style="margin-bottom:15px;">Please take a moment to <a href="#" style="color:#1a73e8; text-decoration:none;">verify your email address</a>.</p>
        <p style="margin-bottom:15px;">If you have any questions, feel free to <a href="#" style="color:#1a73e8; text-decoration:none;">contact us</a>.</p>
        <p style="margin-bottom:15px;">Thank you!</p>
      </div>
    </div>
  </body>
</html>`

  )
}

function getEmailContent(emailReceiverName, appointmentPersonName, startTime, endTime, subjects, appointmentDescription){
  return `        <!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Tutorsphere Appointment Confirmation </title>
    </head>
    <body>
      <div style="background-color:#f0f0f0; padding:20px; font-family:Arial, sans-serif; font-size:14px; line-height:1.5; color:#333;">
        <div style="max-width:600px; margin:0 auto; background-color:#ffffff; padding:30px; border-radius:5px; box-shadow:0 3px 6px rgba(0, 0, 0, 0.1);">
          <h1 style="font-size:20px; font-weight:bold; margin-bottom:10px;">Hello, ${emailReceiverName}!</h1>
          <p style="margin-bottom:15px;">This is a confirmation of your appointment with ${appointmentPersonName}</p>
          <p style="margin-bottom:15px;">The meeting starts on ${startTime} and end on ${endTime}</p>
          <p style="margin-bottom:15px;">The meeting will cover the following subjects: ${subjects.join(",")}</p>
          <p style="margin-bottom:15px;">${appointmentDescription && `Appointment Note is: ${appointmentDescription}`}</p>
          <p style="margin-bottom:15px;">Thank you! Feel free to contact us through email if you have any questions!</p>
        </div>
      </div>
    </body>
  </html>`;
    
}

async function getUserDetails(userId) {
  try {
    const tutorData = await fetchDocumentById("users", userId);
    return tutorData;
  } catch (error) {
    console.error("Error getting user by id", error);
    throw new Error("Error getting user by id " + error.message)
  }
}


        // TODO: show a success create appointment message when appointment is created (use state to store message)
  async function createAppointment(){
    // save appointment data along with appointment description to firestore
    try{


      // // Create a google meets link
      // try{
      //     const startTime = appointmentData.startTime;
      //     const endTime = appointmentData.endTime;
      //     const response = await axios.get('http://localhost:5000/create-meet-link', {
      //       params: { startTime, endTime },
      //     });
      //     const meetingLink = response?.data?.meetLink;
      // } catch (error) {
      //   console.error('Error creating Google Meet link:', error);
      // }


      const docRef = await addDocumentToCollectionWithDefaultId(APPOINTMENTS_COLLECTION, {...appointmentData, appointmentDescription});
      // TODO: show a success create appointment message when appointment is created (use state to store message)
      setShowModal(false);
      setAlert(prevAlert => {return {...prevAlert, variant: "success", message: "Appointment Created Successfully", show: true}});




      // send email with appointment data
      // TODO: send email to student and tutor saying that appointment was created

      try{
        let emailContent = `Appointment with ${appointmentData?.studentName} and ${appointmentData?.tutorName}
        \n. The meeting will start on ${appointmentData?.startTime} and end on ${appointmentData?.endTime}. The meeting will cover the following subjects: ${appointmentData?.subjects.join(",")}`;

        const emailHtml = renderToStaticMarkup(<EmailContent />);

        const emailContentToStudent = getEmailContent(appointmentData?.studentName, appointmentData?.tutorName, appointmentData?.startTime, appointmentData?.endTime, appointmentData?.subjects, appointmentDescription);
        const emailContentToTutor = getEmailContent(appointmentData?.tutorName, appointmentData?.studentName, appointmentData?.startTime, appointmentData?.endTime, appointmentData?.subjects, appointmentDescription);
  
        try{
          const studentData = await getUserDetails(appointmentData?.studentId);
          const tutorData = await getUserDetails(appointmentData?.tutorId);

          await sendEmail(studentData?.email, emailConfirmationSubject, emailContentToStudent);
          await sendEmail(tutorData?.email, emailConfirmationSubject, emailContentToTutor);

          setAlert(prevAlert => {return {...prevAlert, variant: "success", message: `Email sent with Appointment Details. Check your email for confirmation`, show: true}});

        }catch(err){
          setAlert(prevAlert => {return {...prevAlert, variant: "danger", message: "Error sending email: " + err.message, show: true}});
        }
        // setTimeout(() => {
        //   setAlert(prevAlert => {return {...prevAlert, show: false}})
        // }, 8000);
  
      }catch(err){
        console.log("Error sending email via sendgrid", err);
        setAlert(prevAlert => {return {...prevAlert, variant: "danger",  message: "Error senidng email via sendgrid " + err.message, show: true}});
        // setTimeout(() => {
        //   setAlert(prevAlert => {return {...prevAlert, variant: "danger", show: false}})
        // }, 3000);
      }
      
      // reload the window once appointment is created
      // window.location.reload();
      // navigate("/appointments");
      // setReloadPage(true);


      // return <Navigate to="/appointments" />

      // window.history.pushState({}, "", '/appointments');
    


    }catch(err){
      setAlert(prevAlert => {return {...prevAlert, variant: "danger",  message: "Error creating Appointment " + err.message, show: true}});
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


{alert.show && <Alert variant={alert.variant} onClose={() => setAlert(prevAlert => {return {...prevAlert, show: false}})} dismissible>
                            {alert.message}
                    </Alert>}


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

      {/* {firstShow === "subjectsFirst" ? 

      <div>
      {data?.userRole === "students" && selectedSubjects?.length > 0 && <div className="mt-4 d-flex justify-content-start custom-gap align-items-center">
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
      :  */}
        {data?.userRole === "students" && <div>
          <div className="mt-4 d-flex justify-content-start custom-gap align-items-center">
            <p>Step 1: Select a tutor </p>
            <Select
              name="tutors"
              value={selectedTutor ? {
                label: selectedTutor?.firstName + " " + selectedTutor?.lastName,
                value: selectedTutor
              } : null}
              options={allTutorsOptions}
              classNamePrefix="select"
              onChange={handleTutorSelect}
              menuPortalTarget={document.body} 
              styles={{ 
                menuPortal: (base) => ({ ...base, zIndex: 9999 })
              }} // make sure the list of options is not blocked by the calendar
            />
            {selectedTutor && <a onClick={() => window.open(`/tutors/${selectedTutor?.id}`, "_blank")} className="link-primary" style={{color: "blue", cursor: "pointer"}}>Learn more about {selectedTutor?.firstName + " " + selectedTutor?.lastName}</a>}
          </div>

          {selectedTutor && <div className="mt-4 d-flex justify-content-start custom-gap align-items-center">
            <p>Step 2: Select subject(s) </p>
            <Select
              isMulti
              options={getLabelAndValue(selectedTutor?.subjects)}
              value={getLabelAndValue(selectedSubjectsForTutor)}
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
        </div>}
    </div>
  );
}
