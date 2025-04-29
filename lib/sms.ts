import twilio from 'twilio';

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// SMS Service using both Fast2SMS and Twilio as fallback
export async function sendSMS(phoneNumber: string, message: string) {
  // Remove any spaces and special characters from the phone number
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  // Format numbers for different services
  const fast2smsNumber = cleanNumber.startsWith('91') ? cleanNumber.slice(2) : cleanNumber;
  const twilioNumber = phoneNumber.startsWith('+') ? phoneNumber : `+91${cleanNumber}`;

  // Try Fast2SMS first
  try {
    const apiKey = process.env.FAST2SMS_API_KEY;
    if (!apiKey) {
      throw new Error('Fast2SMS API key is not configured');
    }

    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'authorization': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        route: 'dlt',
        numbers: fast2smsNumber,
        message: message,
        flash: 1
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.return) {
      throw new Error(data.message || 'Failed to send SMS via Fast2SMS');
    }
    console.log('SMS sent successfully via Fast2SMS');
    return data;
  } catch (fast2smsError) {
    console.error('Fast2SMS failed, trying Twilio:', fast2smsError);

    // Try Twilio as fallback
    try {
      const twilioResponse = await twilioClient.messages.create({
        body: message,
        to: twilioNumber,
        from: process.env.TWILIO_PHONE_NUMBER,
      });
      console.log('SMS sent successfully via Twilio');
      return twilioResponse;
    } catch (twilioError) {
      console.error('Twilio also failed:', twilioError);
      throw new Error('Failed to send SMS via both services');
    }
  }
}

export async function sendSOSAlert(phoneNumber: string, location: [number, number], userName: string) {
  const googleMapsUrl = `https://www.google.com/maps?q=${location[0]},${location[1]}`;
  
  // Create an urgent message with location
  const message = `EMERGENCY SOS ALERT!\n${userName} needs immediate help!\nLocation: ${googleMapsUrl}\nThis is an emergency alert. Please respond immediately!`;
  
  try {
    // Send the primary alert
    await sendSMS(phoneNumber, message);

    // Send a follow-up message with emergency numbers
    const emergencyInfo = "Emergency Numbers:\nPolice: 100\nWomen Helpline: 1091\nAmbulance: 102";
    await sendSMS(phoneNumber, emergencyInfo);

    return true;
  } catch (error) {
    console.error('Failed to send SOS alert:', error);
    throw error;
  }
}

// Function to send alerts to multiple emergency contacts
export async function sendSOSToContacts(contacts: { name: string; phoneNumber: string }[], location: [number, number], userName: string) {
  const promises = contacts.map(contact => 
    sendSOSAlert(contact.phoneNumber, location, userName)
      .catch(error => {
        console.error(`Failed to send alert to ${contact.name}:`, error);
        return false;
      })
  );

  // Wait for all SMS to be sent
  const results = await Promise.allSettled(promises);
  
  // Check if any messages were sent successfully
  return results.some(result => result.status === 'fulfilled' && result.value === true);
} 