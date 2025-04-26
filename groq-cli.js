import Groq from "groq-sdk";
import readlineSync from "readline-sync";

// Initialize Groq client
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// User Profile Data (temporary placeholder)
const resources = {
  Python: {
    Beginner: [
      { title: "Python for Beginners", link: "https://coursera.org/xyz" },
      { title: "Intro to Python - YouTube", link: "https://youtube.com/xyz" },
    ],
    Intermediate: [
      { title: "Intermediate Python", link: "https://coursera.org/abc" },
    ],
  },
  DataScience: {
    Beginner: [
      { title: "Data Science with Python", link: "https://coursera.org/xyz" },
      { title: "Data Science Overview - YouTube", link: "https://youtube.com/xyz" },
    ],
  },
};

// Main Function
async function main() {
  const userProfile = await getUserProfile();

  // Get Personalized Study Path
  const studyPath = getStudyPath(userProfile);

  // Output Study Path
  console.log("\nHere is your personalized study path:\n");
  studyPath.forEach((goal) => {
    console.log(`Goal: ${goal.goal}`);
    goal.resources.forEach((resource) => {
      console.log(`- ${resource.title}: ${resource.link}`);
    });
    console.log("\n");
  });
  
  // Example of generating a chat completion (Groq API)
  const chatCompletion = await getGroqChatCompletion();
  console.log("\nGroq Chat Completion: ");
  console.log(chatCompletion.choices[0]?.message?.content || "");
}

// Function to get user profile details
async function getUserProfile() {
  const name = readlineSync.question("What is your name? ");
  const skillLevel = readlineSync.question("What is your skill level? (Beginner, Intermediate, Advanced): ");
  const goals = readlineSync.question("What are your goals? (comma separated): ").split(",").map((goal) => goal.trim());
  const interests = readlineSync.question("What are your interests? (comma separated): ").split(",").map((interest) => interest.trim());

  return {
    name,
    skillLevel,
    goals,
    interests,
  };
}

// Function to generate study path based on user profile
function getStudyPath(userProfile) {
  const studyPath = [];

  userProfile.goals.forEach((goal) => {
    const goalResources = resources[goal];
    if (goalResources) {
      studyPath.push({
        goal,
        resources: goalResources[userProfile.skillLevel] || [],
      });
    }
  });

  return studyPath;
}

// Function to get a chat completion from Groq API (simulated example)
async function getGroqChatCompletion() {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: "What are the most important trends in Data Science?",
      },
    ],
    model: "llama-3.3-70b-versatile",
  });
}

// Run the main function
main().catch((err) => {
  console.error("Error: ", err);
});
