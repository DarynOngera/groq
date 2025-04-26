import Groq from "groq-sdk";
import dotenv from "dotenv";
import readlineSync from "readline-sync";
import chalk from "chalk"; // Pretty CLI formatting
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

function getUserData() {
  const skillLevel = readlineSync.question("What is your current skill level (e.g., beginner, intermediate, advanced)? ");
  const learningGoal = readlineSync.question("What's your main learning goal? ");
  const learningMethod = readlineSync.question("Preferred learning method (e.g., videos, articles, interactive)? ");
  const topicsInput = readlineSync.question("Topics you're most interested in (comma separated): ");
  const topics = topicsInput.split(",").map(t => t.trim());

  return { skillLevel, learningGoal, learningMethod, topics };
}

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

async function getPersonalizedResources(prompt) {
  return groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.1-8b-instant",
  });
}

export async function getGroqChatCompletion(userPrompt) {
  const basePrompt = `You are a personalized AI learning assistant.
Your job is to help users learn topics clearly, guide them through understanding concepts, and recommend relevant learning resources.
Always reply with kindness, encouragement, and clear steps or explanations.`;

  const fullPrompt = `${basePrompt}\n\nUser: ${userPrompt}`;

  return groq.chat.completions.create({
    messages: [{ role: "user", content: fullPrompt }],
    model: "compound-beta-mini",
  });
}


function displayResources(rawOutput) {
  console.log(chalk.bold.green("\n🎓 Curated Learning Path:\n"));
  const lines = rawOutput.split("\n");
  lines.forEach(line => {
    if (line.startsWith("-")) {
      console.log(chalk.cyan(line));
    } else {
      console.log(line);
    }
  });
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  // CLI mode
  (async () => {
    const userData = getUserData();
    const personalizedPrompt = createStructuredPrompt(userData);
    const chatCompletion = await getPersonalizedResources(personalizedPrompt);
    displayResources(chatCompletion.choices[0]?.message?.content || "No response.");
  })();
}
