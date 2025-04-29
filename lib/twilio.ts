import twilio from 'twilio';

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendSMS(to: string, message: string) {
  try {
    const response = await client.messages.create({
      body: message,
      to,
      from: process.env.TWILIO_PHONE_NUMBER,
    });
    return response;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
}

export async function sendSOSAlert(phoneNumber: string, location: [number, number]) {
  const googleMapsUrl = `https://www.google.com/maps?q=${location[0]},${location[1]}`;
  const message = `EMERGENCY SOS ALERT: Your contact needs immediate help! Their location: ${googleMapsUrl}`;
  
  return sendSMS(phoneNumber, message);
}

// Send verification code
export async function sendVerificationCode(phoneNumber: string) {
  try {
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_ID!)
      .verifications.create({
        to: phoneNumber,
        channel: 'sms'
      });
    return verification;
  } catch (error) {
    console.error('Error sending verification code:', error);
    throw error;
  }
}

// Check verification code
export async function checkVerificationCode(phoneNumber: string, code: string) {
  try {
    const verification = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_ID!)
      .verificationChecks.create({
        to: phoneNumber,
        code
      });
    return verification.status === 'approved';
  } catch (error) {
    console.error('Error checking verification code:', error);
    throw error;
  }
} 