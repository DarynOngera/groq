import fs from "fs";
import path from "path";
import cron from "node-cron";
import { sendReminderMessage } from "./twilio.js";

const storePath = path.resolve("reminders", "reminderStore.json");

// Load all reminders from JSON
function loadReminders() {
  const data = fs.readFileSync(storePath, "utf-8");
  return JSON.parse(data);
}

// Save all reminders to file
function saveReminders(reminders) {
  fs.writeFileSync(storePath, JSON.stringify(reminders, null, 2));
}

// Add new reminder to the store
export function scheduleReminder({ user, phone, message, delayInHours }) {
  const remindAt = Date.now() + delayInHours * 60 * 60 * 1000;

  const reminder = {
    user,
    phone,
    message,
    remindAt,
    sent: false,
  };

  const reminders = loadReminders();
  reminders.push(reminder);
  saveReminders(reminders);
}

// Cron job: check every minute
cron.schedule("* * * * *", () => {
  const reminders = loadReminders();
  const now = Date.now();

  const updated = reminders.map((reminder) => {
    if (!reminder.sent && reminder.remindAt <= now) {
      sendReminderMessage(reminder.phone, reminder.message);
      reminder.sent = true;
    }
    return reminder;
  });

  saveReminders(updated);
});
