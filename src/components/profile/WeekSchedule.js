import React, { useState } from 'react';

const WeekSchedule = () => {
  // Initialize an array with 7 empty objects representing each day of the week
  const [weekSchedule, setWeekSchedule] = useState([{}, {}, {}, {}, {}, {}, {}]);

  // Handle updating the schedule for a specific day
  const handleDayScheduleUpdate = (index, newSchedule) => {
    setWeekSchedule(prevState => {
      const newState = [...prevState];
      newState[index] = newSchedule;
      return newState;
    });
  };

  return (
    <div>
      {weekSchedule.map((daySchedule, index) => (
        <div key={index}>
          <h3>Day {index + 1}</h3>
          <DaySchedule
            initialSchedule={daySchedule}
            onScheduleUpdate={newSchedule => handleDayScheduleUpdate(index, newSchedule)}
          />
        </div>
      ))}
    </div>
  );
};

const DaySchedule = ({ initialSchedule, onScheduleUpdate }) => {
  const [schedule, setSchedule] = useState(initialSchedule);

  const handleScheduleUpdate = (newSchedule) => {
    setSchedule(newSchedule);
    onScheduleUpdate(newSchedule);
  };

  return (
    <div>
      {/* Display the schedule for the day */}
      {Object.entries(schedule).map(([time, isAvailable]) => (
        <div key={time}>
          <span>{time}</span>
          <input
            type="checkbox"
            checked={isAvailable}
            onChange={event => {
              const newSchedule = { ...schedule, [time]: event.target.checked };
              handleScheduleUpdate(newSchedule);
            }}
          />
        </div>
      ))}
    </div>
  );
};

export default WeekSchedule;
