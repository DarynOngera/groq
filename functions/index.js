const functions = require('firebase-functions');

// Basic webhook handler for Twilio's webhook
exports.webhook = functions.https.onRequest((req, res) => {
    // Check if the request method is POST
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    // Extract relevant data from the body (assuming Twilio sends data in the body)
    const body = req.body;

    // Log the received data for debugging purposes
    console.log('Received webhook data:', body);

    // You can process the data here (e.g., interact with a database, send a response, etc.)

    // Send a simple response back
    return res.status(200).send('Webhook received successfully');
});

