import React from 'react';
import { ScheduleMeeting } from 'react-schedule-meeting';

export default function MeetingScheduler() {

    const schedule = {
        sunday: [9, 10, 11],
        monday: [8, 17, 18],
        tuesday: [10],
        wednesday: [13, 14, 17],
        thursday: [9],
        friday: [12],
        saturday: [8, 17, 18],
        sunday: [9, 10, 11],
    }

    const daysOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  // this generates basic available timeslots for the next 6 days
//   const availableTimeslots = [0, 1, 2, 3, 4, 5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29].map((id) => {
//     Object.keys(schedule).forEach(key => console.log("key is", schedule[key]))
//     return {
//       startTime: new Date(new Date(new Date().setDate(new Date().getDate() + id)).setHours(9, 0, 0, 0)),
//       endTime: new Date(new Date(new Date().setDate(new Date().getDate() + id)).setHours(10, 0, 0, 0)),
//     };
//   });

console.log("Object.keys(schedule)", Object.keys(schedule))
  const availabilitySlots = Object.keys(schedule).map((day) => {
    const dayIdx = daysOrder.indexOf(day);
    console.log("----------------DAY AND IDX ------------------", day, dayIdx)
        return schedule[day].map(availableTime => {
            console.log("new Date(new Date(new Date().setDate(new Date().getDate() + idx)).setHours(availableTime, 0, 0, 0))", new Date(new Date(new Date().setDate(new Date().getDate() + dayIdx)).setHours(availableTime, 0, 0, 0)))

            console.log("availableTime", availableTime)
            return {
                // TODO: can add minutes to sethours function in index 1 to set time
                // that also has minutes
                startTime: new Date(new Date(new Date().setDate(new Date().getDate() + dayIdx)).setHours(availableTime, 0, 0, 0)),
                endTime: new Date(new Date(new Date().setDate(new Date().getDate() + dayIdx)).setHours(availableTime+1, 0, 0, 0)),
            }
        });
        // return ...availabilitiesForADay
    }
  )

  console.log("availabilitySlots", availabilitySlots.flat())
  

  return (
    <ScheduleMeeting
      borderRadius={10}
      primaryColor="#3f5b85"
      availableTimeslots={availabilitySlots.flat()}
      // TODO: right now, appointments can only be made for 1 hour but try to see if dynamic duration can work by updating approach
      eventDurationInMinutes={60}
      onStartTimeSelect={console.log}
    />
  );
}

// {
//     monday: [9, 10, 11, 12, 13, 14],
//     tuesday: [10, 11, 12]
// }