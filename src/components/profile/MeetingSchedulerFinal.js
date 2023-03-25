import React, { useEffect, useState } from 'react';
import { ScheduleMeeting } from 'react-schedule-meeting';
import useFirestore from '../../firestore';

export default function MeetingSchedulerFinal() {
    const {data, getAllTutors} = useFirestore();
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
  
    const [allTutors, setAllTutors] = useState([]);
    const [tutorSchedule, setTutorSchedule] = useState({});

    useEffect(() => {
      async function getAndSetTutors(){
        const allTutors = await getAllTutors();
        console.log("allTutors", allTutors)
        setAllTutors(allTutors);
      }
      getAndSetTutors();
    }, [data]);
    
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

const availabilitySlots = Object.keys(tutorSchedule).map((day) => {
    const dayIdx = daysOrder.indexOf(day);
    console.log("DAYANDIDX", day, dayIdx);
    return tutorSchedule[day].map(availableTime => {
        console.log("DAYANDIDXavailableTime", availableTime)
        const date = new Date();

        const dayOfWeek = date.getDay();
        const daysUntilNextMatchingDay = (7 - dayOfWeek + daysInWeekMap[day]) % 7;
        date.setDate(date.getDate() + daysUntilNextMatchingDay);

        console.log("DAYANDIDXdaysUntilNextMatchingDay", daysUntilNextMatchingDay)

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
      console.log("DAYANDIDXstartEndObj", startEndObj)
      return startEndObj;
    });
  })
  
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
    setTutorSchedule(tutor.schedule);
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

      <ScheduleMeeting
        borderRadius={10}
        primaryColor="#3f5b85"
        availableTimeslots={availabilitySlots.flat()}
        // TODO: right now, appointments can only be made for 1 hour but try to see if dynamic duration can work by updating approach
        eventDurationInMinutes={60}
        onStartTimeSelect={console.log}
      />
    </div>
  );
}
