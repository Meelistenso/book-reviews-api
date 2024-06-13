// Import the Cloud Auth Admin module using ES module syntax.
import gcipCloudFunctions from 'gcip-cloud-functions';
// Initialize the Auth client.
const authClient = new gcipCloudFunctions.Auth();

// Http trigger with Cloud Functions using ES modules export syntax.
export const beforeCreate = authClient
  .functions()
  .beforeCreateHandler(async (user, context) => {
    const { BACKEND_URL, API_KEY } = process.env;
    const url = `${BACKEND_URL}/webhook/auth`;
    const body = JSON.stringify({ event: 'onUserRegistered', payload: user });
    const result = await fetch(url, {
      body,
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': API_KEY,
      },
      method: 'POST',
    });
    console.log(user, result);
  });
