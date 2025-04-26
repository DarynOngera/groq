import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import pkg from "twilio";
const { twiml } = pkg;
const MessagingResponse = twiml.MessagingResponse;
import { getGroqChatCompletion } from "./groq3.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// WhatsApp webhook route
app.post("/webhook", async (req, res) => {
  const incomingMsg = req.body.Body;
  const from = req.body.From;

  console.log(`Incoming message from ${from}: ${incomingMsg}`);

  try {
    const groqResponse = await getGroqChatCompletion(incomingMsg);
    const reply = groqResponse.choices[0]?.message?.content || "Sorry, I didn’t understand that.";

    const twiml = new MessagingResponse();
    twiml.message(reply);
    res.type("text/xml").send(twiml.toString());
  } catch (err) {
    console.error("Error:", err.message);
    const twiml = new MessagingResponse();
    twiml.message("Oops, something went wrong. Please try again later.");
    res.type("text/xml").send(twiml.toString());
  }
});

// Optional: UI test page (CLI interface in browser)
app.get("/", (req, res) => {
  res.render("index", { response: null });
});

app.post("/", async (req, res) => {
  
  
  try {
    const prompt = req.body.prompt;
    const groqResponse = await getGroqChatCompletion(prompt);
    const reply = groqResponse.choices[0]?.message?.content || "No response.";
    
    res.render("index", { response: reply });
    
  } catch (error) {
    res.render("index", { response: "Error: " + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
