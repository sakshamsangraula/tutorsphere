const express = require("express");
const sgMail = require("@sendgrid/mail");
const cors = require("cors");
require('dotenv').config();


const app = express();
app.use(express.json());
app.use(cors());


const SENDGRID_API_KEY = process.env.SEND_GRID_API_KEY;
sgMail.setApiKey(SENDGRID_API_KEY);

app.post("/send-email", async (req, res) => {
  const { to, subject, text } = req.body;
  // TODO: put this in environment variable
  const from = process.env.SENDER_EMAIL; 

  const msg = {
    to,
    from,
    subject,
    text,
  };

  try {
    await sgMail.send(msg);
    res.status(200).send({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send({ success: false, error: error.toString() });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
