const express = require("express");
const sgMail = require("@sendgrid/mail");
const cors = require("cors");
require('dotenv').config();
const {GoogleAuth} = require('google-auth-library');

const app = express();
app.use(express.json());
app.use(cors());


const SENDGRID_API_KEY = process.env.SEND_GRID_API_KEY;
sgMail.setApiKey(SENDGRID_API_KEY);

const emailHtml = `
<!DOCTYPE html>
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
</html>
`;

app.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;
  // TODO: put this in environment variable
  const from = process.env.SENDER_EMAIL; 

  const msg = {
    to,
    from,
    subject,
    html: text
  };

  try {
    await sgMail.send(msg);
    res.status(200).send({ success: true });
  } catch (error) {
    console.error("Error sending email:", error.toString());

    res.status(500).send({ success: false, error: error.toString() });
  }
});

// API for creating google meets link

// // Load the service account key JSON file.
// const SERVICE_ACCOUNT_KEY = require('./draft-tutorsphere-14a7754c7b72.json');

// // Initialize the GoogleAuth client with the service account credentials.
// const authClient = new GoogleAuth({
//   credentials: SERVICE_ACCOUNT_KEY,
//   scopes: ['https://www.googleapis.com/auth/calendar'],
// });

// app.get('/create-meet-link', async (req, res) => {
//   const { startTime, endTime } = req.query;

//   const calendar = google.calendar({version: 'v3', auth: authClient});

//   // Replace with the email address of the calendar where you want to create the event.
//   // TODO: replace email
//   const calendarId = 'sakshamsangraula45@gmail.com';

//   // Define the event details.
//   const event = {
//     summary: 'Example Google Meet Event',
//     start: {
//       dateTime: startTime,
//       timeZone: 'America/Chicago',
//     },
//     end: {
//       dateTime: endTime,
//       timeZone: 'America/Chicago',
//     },
//     conferenceData: {
//       createRequest: {
//         requestId: 'sample-request-id', // Generate a unique ID for the request
//         conferenceSolutionKey: {
//           type: 'hangoutsMeet',
//         },
//       },
//     },
//   };

//   try {
//     // Create the event in the specified calendar with conference data.
//     const response = await calendar.events.insert({
//       calendarId: calendarId,
//       resource: event,
//       conferenceDataVersion: 1,
//     });

//     // Extract the Google Meet link.
//     const meetLink = response.data.conferenceData.entryPoints[0].uri;

//     res.json({meetLink});
//   } catch (error) {
//     console.error('Error creating Google Meet link:', error);
//     res.status(500).json({error: 'Failed to create Google Meet link'});
//   }
// });


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
