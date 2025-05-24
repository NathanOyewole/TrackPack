export interface NotificationServiceProps {
  contact: string;
  message: string;
  onSuccess: () => void;
  onError: (err: string) => void;
}

// This is a mock notification service. Replace with real API integration (e.g., EmailJS, Twilio) for production.
export function sendNotification({ contact, message, onSuccess, onError }: NotificationServiceProps) {
  setTimeout(() => {
    if (contact) {
      // Simulate sending the message (for mock purposes, just log it)
      console.log(`Sending message: "${message}" to contact: ${contact}`);
      onSuccess();
    } else {
      onError('No contact info provided.');
    }
  }, 1000);
}
