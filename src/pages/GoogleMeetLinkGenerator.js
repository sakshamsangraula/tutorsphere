import React, { useState } from "react";
import axios from "axios";
import moment from "moment";

const GoogleMeetLinkGenerator = () => {
  const [apiKey, setApiKey] = useState("");
  const [meetLink, setMeetLink] = useState("");

  const createMeetLink = async () => {
    const eventStartTime = moment().toISOString();
    const eventEndTime = moment().add(1, "hours").toISOString();

    const calendarEvent = {
      summary: "Generated Google Meet",
      start: {
        dateTime: eventStartTime,
        timeZone: "UTC",
      },
      end: {
        dateTime: eventEndTime,
        timeZone: "UTC",
      },
      conferenceData: {
        createRequest: {
          requestId: Math.random().toString(36).substring(2),
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
    };

    const result = await axios.post(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&key=${apiKey}`,
      calendarEvent,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    setMeetLink(result.data.hangoutLink);
  };

  return (
    <div>
      <h2>Google Meet Link Generator</h2>
      <input
        type="text"
        placeholder="Enter API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />
      <button onClick={createMeetLink}>Generate Link</button>
      {meetLink && (
        <div>
          <h3>Google Meet Link:</h3>
          <a href={meetLink} target="_blank" rel="noopener noreferrer">
            {meetLink}
          </a>
        </div>
      )}
    </div>
  );
};

export default GoogleMeetLinkGenerator;
