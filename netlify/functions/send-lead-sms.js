exports.handler = async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method not allowed" })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      ok: true,
      message:
        "SMS placeholder is active. Connect this function to a Netlify submission webhook or custom form handler when Twilio is ready."
    })
  };
};
