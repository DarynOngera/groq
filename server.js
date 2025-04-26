import express from "express";
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

// Utility to build structured prompt
function createStructuredPrompt({ skillLevel, learningGoal, learningMethod, topics }) {
  return `You are a personalized AI tutor for a ${skillLevel} learner.
The user wants to learn about ${learningGoal}, especially these topics: ${topics.join(", ")}.
They prefer learning through ${learningMethod}.

Please suggest a curated list of up to 5 learning resources. For each, include:
- Title
- Resource Type (Video, Course, Article, etc.)
- Platform (e.g., YouTube, Coursera)
- A 1-line description
- A direct link (if possible)

Respond in clear bullet points.`;
}

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

// UI test page (GET)
app.get("/", (req, res) => {
  res.render("index", { reply: null, userPrompt: null });
});

// UI POST route with CLI-like structure
app.post("/", async (req, res) => {
  const { skillLevel, learningGoal, learningMethod, topics } = req.body;
  const topicsArray = topics.split(",").map(t => t.trim());

  const userPrompt = createStructuredPrompt({
    skillLevel,
    learningGoal,
    learningMethod,
    topics: topicsArray
  });

  try {
    const groqResponse = await getGroqChatCompletion(userPrompt);
    const reply = groqResponse.choices[0]?.message?.content || "No response.";
    res.render("index", { reply, userPrompt });
  } catch (error) {
    res.render("index", { reply: "Error: " + error.message, userPrompt });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
