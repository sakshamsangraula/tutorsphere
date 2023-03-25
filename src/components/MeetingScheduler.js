import React, { useEffect, useState } from 'react';
import { ScheduleMeeting } from 'react-schedule-meeting';
import useFirestore from '../firestore';

export default function MeetingScheduler() {

  // TODO: get schedule from firestore and show availability based on tutor select
  // maybe like a dropdown of tutors and everytime a new tutor is selected, their 
  // individual tutor schedule is shown to user
    const {data, getAllTutors} = useFirestore();
    const schedule = {
      sunday: [9, 10, 11],
      monday: [8, 17, 18],
      tuesday: [10],
      wednesday: [13, 14, 17],
      thursday: [9],
      friday: [12],
      saturday: [8, 17, 18],
      // sunday: [9, 10, 11],
  }

    // const [userSchedule, setUserSchedule] = useState({});

    // TODO: get all tutors from the firestore database (userRole of tutors) and show the first tutor's schedule and have the tutor selected + their bio and subjects and the student can click on the dropdown and select another tutor then show schedule for that tutor and also their bio + subjects taught in the side like last time

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
    
    // TODO: complicated feature to do later can be to have all tutors selected (dropdown) has all tutors selected

    // useEffect(() => {
    //   if(data?.schedule){
    //     setUserSchedule(data.schedule);
    //   }else{
    //     setUserSchedule([]);
    //   }
    // }, [data]);

  // this generates basic available timeslots for the next 6 days
//   const availableTimeslots = [0, 1, 2, 3, 4, 5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29].map((id) => {
//     Object.keys(schedule).forEach(key => console.log("key is", schedule[key]))
//     return {
//       startTime: new Date(new Date(new Date().setDate(new Date().getDate() + id)).setHours(9, 0, 0, 0)),
//       endTime: new Date(new Date(new Date().setDate(new Date().getDate() + id)).setHours(10, 0, 0, 0)),
//     };
//   });

  // const daysSorter = {
  //   "sunday": 0, 
  //   "monday": 1,
  //   "tuesday": 2,
  //   "wednesday": 3,
  //   "thursday": 4,
  //   "friday": 5,
  //   "saturday": 6,
  // }

  // tutorSchedule.sort(function sortByDay(a, b) {
  //   let day1 = a.day.toLowerCase();
  //   let day2 = b.day.toLowerCase();
  //   return daysSorter[day1] - daysSorter[day2];
  // });
  console.log("tutorSchedule before", tutorSchedule);
  const daysOrder = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

  // const obj = { sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6 };
 
  // const map = {'sunday': 0, 'monday': 1,'tuesday': 2,'wednesday': 3,'thursday': 4,'friday': 5,'saturday': 6 };
  // tutorSchedule.sort((a, b) => {
  //     return map[a.day] - map[b.day];
  // });

  // console.log("tutorSchedule after", tutorSchedule);


  // console.log("sortedTutorSchedule", tutorSchedule)

  const availabilitySlots = Object.keys(schedule).map((day) => {
    const dayIdx = daysOrder?.indexOf(day);
        return schedule[day].map(availableTime => {
            return {
                // TODO: can add minutes to sethours function in index 1 to set time
                // that also has minutes
                startTime: new Date(new Date(new Date().setDate(new Date().getDate() + dayIdx)).setHours(availableTime, 0, 0, 0)),
                endTime: new Date(new Date(new Date().setDate(new Date().getDate() + dayIdx)).setHours(availableTime+1, 0, 0, 0)),
            }
        });
    }
  )


  console.log("availabilitySlots", availabilitySlots)

  const handleTutorClick = (tutor) => {
    // sort the tutor schedule
    console.log("tutorscheduleinhandletutorclick", tutor.schedule);

    const tutorScheduleHere = tutor.schedule;
    // const map = {'sunday': 0, 'monday': 1,'tuesday': 2,'wednesday': 3,'thursday': 4,'friday': 5,'saturday': 6 };
    // tutorScheduleHere.sort((a, b) => {
    //     return map[a.day] - map[b.day];
    // });

    const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    // const tutorScheduleHere = { Monday: 2, Friday: 5, Wednesday: 3, Sunday: 1, Thursday: 4 };

    // Convert object to array
    const tutorScheduleArray = Object.entries(tutorScheduleHere);

    // Sort the array based on the order of the days of the week
    tutorScheduleArray.sort((a, b) => daysOfWeek.indexOf(a[0]) - daysOfWeek.indexOf(b[0]));

    // Convert array back to object
    const sortedTutorSchedule = Object.fromEntries(tutorScheduleArray);

    // console.log(sortedTutorSchedule); // { Sunday: 1, Monday: 2, Wednesday: 3, Thursday: 4, Friday: 5 }


    console.log("tutorscheduleinhandletutorclickafter", sortedTutorSchedule);

    setTutorSchedule(sortedTutorSchedule);
  };

  const allTutorElements = allTutors.map(tutor => {
    return (

      <button type="button" onClick={() => handleTutorClick(tutor)} class="btn btn-primary">
        <p>{tutor.firstName} {tutor.lastName}</p>
      </button>
      // <div class="card">
      //   <div class="card-body">
      //     <p>{tutor.firstName} {tutor.lastName}</p>
      //   </div>
      // </div>
    )
  })

  return (
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

// {
//     monday: [9, 10, 11, 12, 13, 14],
//     tuesday: [10, 11, 12]
// }