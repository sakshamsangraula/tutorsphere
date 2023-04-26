import axios from "axios";
const SENDGRID_API_KEY = "your_sendgrid_api_key";
const SENDGRID_URL = "https://api.sendgrid.com/v3/mail/send";

export default function SendGridApi(){

const sendEmail = async (to, subject, text) => {
    const data = {
      personalizations: [
        {
          to: [
            {
              email: to,
            },
          ],
          subject: subject,
        },
      ],
      from: {
        email: "example@example.com",
      },
      content: [
        {
          type: "text/plain",
          value: text,
        },
      ],
    };
  
    try {
      const response = await axios.post(SENDGRID_URL, data, {
        headers: {
          "Content-Type": "application/json",
        //   Authorization: `Bearer ${SENDGRID_API_KEY}`,
          Authorization: `Bearer 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`
        },
      });
  
      console.log("Email sent:", response.data);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };
  return {sendEmail};  
}
