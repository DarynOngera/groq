const axios = require('axios');
const readline = require('readline');

// Set up command line interface (CLI)
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Firebase function webhook URL (replace with your actual Firebase function URL)
const webhookURL = 'https://us-central1-your-project-id.cloudfunctions.net/webhook';

// Function to interact with the AI (sending messages and receiving replies)
async function interactWithAI(userInput) {
  try {
    // Send request to Firebase function webhook
    const response = await axios.post(
      webhookURL,
      {
        From: 'whatsapp:+1234567890', // Replace with actual phone number
        Body: userInput
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    // Display the AI's response
    console.log('🤖 Tutor Mtaani:', response.data.reply);
  } catch (error) {
    console.error('Error communicating with AI:', error);
  }
}

// CLI loop to ask the user for input
function promptUser() {
  rl.question('You: ', (userInput) => {
    if (userInput.toLowerCase() === 'exit') {
      console.log('Exiting Tutor Mtaani CLI. Goodbye!');
      rl.close();
      return;
    }

    // Send user input to AI and handle the response
    interactWithAI(userInput).then(() => {
      // After receiving a response, continue asking for more input
      promptUser();
    });
  });
}

// Start the CLI interaction
console.log('Welcome to Tutor Mtaani CLI!');
console.log('Type "exit" to exit the conversation.');
promptUser();
