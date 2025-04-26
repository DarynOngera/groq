import dotenv from "dotenv";
dotenv.config();
import twilio from "twilio";

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
  console.error("ERROR: Missing Twilio credentials in environment variables. Please set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in your .env file.");
  process.exit(1);
}

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const reminders = [];
const TEST_DELAY_MS = 60 * 1000;

export function addReminder(userId, message, delayInMs = TEST_DELAY_MS) {
  const timestamp = Date.now();
  reminders.push({ userId, message, timestamp });

  setTimeout(() => {
    sendReminder(userId, message);
  }, delayInMs);
}

function sendReminder(userId, message) {
  client.messages
    .create({
      body: `⏰ Reminder: Don't forget to revisit this resource:\n\n${message}`,
      from: "whatsapp:+14155238886",
      to: userId
    })
    .then(msg => console.log(`Reminder sent to ${userId}: ${msg.sid}`))
    .catch(err => {
      if (err.code === 63038) {
        console.warn("Twilio daily WhatsApp message limit exceeded. Reminders will be paused until the limit resets.");
      } else {
        console.error("Failed to send reminder:", err);
      }
    });
}
