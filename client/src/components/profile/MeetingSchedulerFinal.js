
import React, { useCallback, useEffect, useState } from 'react';
import { ScheduleMeeting } from 'react-schedule-meeting';
import useFirestore from '../../firestore';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';
import axios from "axios";
import { Alert } from 'react-bootstrap';

export default function MeetingSchedulerFinal({ allTutors, filteredTutors, selectedSubjects }) {

  const APPOINTMENTS_COLLECTION = "appointments";
  const { data, appointmentsData, addDocumentToCollectionWithDefaultId, fetchDocumentById } = useFirestore();

  const daysInWeekMap = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  const emailConfirmationSubject = "Confirmation of a Tutoring Appointment With Tutorsphere";

  const [tutorSchedule, setTutorSchedule] = useState({});
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [appointmentDescription, setAppointmentDescription] = useState("");
  const [appointmentData, setAppointmentData] = useState({});
  const [selectedTutorExistingAppointments, setSelectedTutorExistingAppointments] = useState([]);
  const [selectedSubjectsForTutor, setSelectedSubjectsForTutor] = useState([]);
  const [alert, setAlert] = useState({
    variant: "success",
    message: "",
    show: false,
  });

  const sendEmail = async (to, subject, text) => {
    const data = {
      to,
      subject,
      text,
    };

    try {
      const response = await axios.post("http://localhost:3001/send-email", data);
      return response.data;
    } catch (error) {
      throw new Error("Error sending email " + error.message);
    }
  };


  useEffect(() => {
    if (selectedTutor) {
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

  const availabilitySlots = tutorSchedule && Object.keys(tutorSchedule)?.map((day) => {
    return tutorSchedule[day].map(availableTime => {
      const date = new Date();

      const dayOfWeek = date.getDay();
      const daysUntilNextMatchingDay = (7 - dayOfWeek + daysInWeekMap[day]) % 7;
      date.setDate(date.getDate() + daysUntilNextMatchingDay);

      const matchingDates = [];

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

        const startDate = new Date(startEndObj.startTime);
        for (let i = 0; i < selectedTutorExistingAppointments.length; i++) {
          const appointment = selectedTutorExistingAppointments[i];
          const appointmentStartDate = new Date(appointment.startTime);
          if (startDate.getTime() === appointmentStartDate.getTime()) {
            return null;
          }
        }

        return startEndObj;
      });
    })
  })

  const finalAvailabilitySlots = availabilitySlots?.flat()?.flat()?.filter(slot => slot !== null);

  function convertTimeStampToCDTDate(timeStamp) {
    const unixTimestamp = timeStamp;
    const date = new Date(unixTimestamp);
    const options = { timeZone: 'America/Chicago' };
    const cstDateTimeString = date.toLocaleString('en-US', options);
    return cstDateTimeString;
  }

  function prepareAppointmentData(appointmentSelection, passedInSubjects) {
    setAppointmentDescription("");

    const appointmentData = {
      studentId: data?.id,
      studentName: data?.firstName + " " + data?.lastName,
      tutorId: selectedTutor?.id,
      tutorName: selectedTutor?.firstName + " " + selectedTutor?.lastName,
      startTime: convertTimeStampToCDTDate(appointmentSelection.availableTimeslot.startTime),
      endTime: convertTimeStampToCDTDate(appointmentSelection.availableTimeslot.endTime),
      subjects: passedInSubjects
    }

    setShowModal(true);
    setAppointmentData(appointmentData);
  }

  function getEmailContent(emailReceiverName, appointmentPersonName, startTime, endTime, subjects, appointmentDescription) {
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
  async function createAppointment() {
    // save appointment data along with appointment description to firestore
    try {
      await addDocumentToCollectionWithDefaultId(APPOINTMENTS_COLLECTION, { ...appointmentData, appointmentDescription });
      setShowModal(false);
      setAlert(prevAlert => { return { ...prevAlert, variant: "success", message: "Appointment Created Successfully", show: true } });

      try {
        const emailContentToStudent = getEmailContent(appointmentData?.studentName, appointmentData?.tutorName, appointmentData?.startTime, appointmentData?.endTime, appointmentData?.subjects, appointmentDescription);
        const emailContentToTutor = getEmailContent(appointmentData?.tutorName, appointmentData?.studentName, appointmentData?.startTime, appointmentData?.endTime, appointmentData?.subjects, appointmentDescription);

        try {
          const studentData = await getUserDetails(appointmentData?.studentId);
          const tutorData = await getUserDetails(appointmentData?.tutorId);

          await sendEmail(studentData?.email, emailConfirmationSubject, emailContentToStudent);
          await sendEmail(tutorData?.email, emailConfirmationSubject, emailContentToTutor);

          setAlert(prevAlert => { return { ...prevAlert, variant: "success", message: `Email sent with Appointment Details. Check your email for confirmation`, show: true } });

        } catch (err) {
          setAlert(prevAlert => { return { ...prevAlert, variant: "danger", message: "Error sending email: " + err.message, show: true } });
        }

      } catch (err) {
        setAlert(prevAlert => { return { ...prevAlert, variant: "danger", message: "Error senidng email via sendgrid " + err.message, show: true } });
      }

    } catch (err) {
      setAlert(prevAlert => { return { ...prevAlert, variant: "danger", message: "Error creating Appointment " + err.message, show: true } });
    }

  }

  const allTutorsOptions = allTutors?.map(tutor => {
    return {
      label: tutor.firstName + " " + tutor.lastName,
      value: tutor
    }
  })

  function handleTutorSelect(selectedOption, actionMeta) {
    const userSelectedTutor = selectedOption?.value
    if (userSelectedTutor) {
      setSelectedTutor(userSelectedTutor);
      if (userSelectedTutor?.schedule) {
        setTutorSchedule(userSelectedTutor.schedule);
      }
    }
  }

  function getLabelAndValue(listOfValues) {
    return listOfValues?.map(listElement => {
      return {
        label: listElement,
        value: listElement
      }
    })
  }


  return (
    <div>
      {alert.show && <Alert variant={alert.variant} onClose={() => setAlert(prevAlert => { return { ...prevAlert, show: false } })} dismissible>
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
          {selectedTutor && <a onClick={() => window.open(`/tutors/${selectedTutor?.id}`, "_blank")} className="link-primary" style={{ color: "blue", cursor: "pointer" }}>Learn more about {selectedTutor?.firstName + " " + selectedTutor?.lastName}</a>}
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
            eventDurationInMinutes={60}
            onStartTimeSelect={(appointmentSelection) => prepareAppointmentData(appointmentSelection, selectedSubjectsForTutor)}
          />
        }
      </div>}
    </div>
  );
}
