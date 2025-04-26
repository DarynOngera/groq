import Groq from "groq-sdk";
import readlineSync from "readline-sync"; // Make sure to install this dependency using `npm install readline-sync`

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
  // Get user input
  const userData = getUserData();

  // Create a personalized prompt based on the user data
  const personalizedPrompt = createPersonalizedPrompt(userData);

  // Fetch personalized resources from Groq
  const chatCompletion = await getPersonalizedResources(personalizedPrompt);

  // Print the completion (suggested resources)
  console.log(chatCompletion.choices[0]?.message?.content || "No content returned");
}

function getUserData() {
  // Collect user information
  const skillLevel = readlineSync.question("What is your current skill level? (Beginner, Intermediate, Advanced): ");
  const learningGoal = readlineSync.question("What is your main learning goal? (Data Science, Machine Learning, Deep Learning, etc.): ");
  const learningMethod = readlineSync.question("How do you prefer to learn? (Videos, Articles, Hands-on Projects): ");
  const topicsInput = readlineSync.question("What topics are you most interested in? (Separate with commas): ");
  const topics = topicsInput.split(",").map(topic => topic.trim());

  return {
    skillLevel,
    learningGoal,
    learningMethod,
    topics
  };
}

function createPersonalizedPrompt(userData) {
  const { skillLevel, learningGoal, learningMethod, topics } = userData;

  let prompt = `I am a ${skillLevel} data science learner.`;
  
  // Add learning goal and preferred topics
  prompt += ` I want to learn about ${learningGoal}.`;
  
  if (topics && topics.length > 0) {
    prompt += ` My main interests are in ${topics.join(', ')}.`;
  }
  
  // Add learning method
  prompt += ` I prefer learning through ${learningMethod}.`;

  return prompt;
}

async function getPersonalizedResources(prompt) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt
      },
    ],
    model: "llama-3.3-70b-versatile",  // Use the appropriate model here
  });
}

// Run the main function to start the process
main();
