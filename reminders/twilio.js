import pkg from "twilio";
import dotenv from "dotenv";
dotenv.config();

const client = pkg(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export function sendReminderMessage(to, body) {
  client.messages
    .create({
      body,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${to}`,
    })
    .then((msg) => console.log("📩 Reminder sent:", msg.sid))
    .catch((err) => console.error("❌ Reminder failed:", err.message));
}
