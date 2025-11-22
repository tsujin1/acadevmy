import emailjs from '@emailjs/nodejs';
import dotenv from 'dotenv';

dotenv.config();

export const sendPasswordResetEmail = async (email: string, resetUrl: string): Promise<void> => {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    console.warn('EmailJS credentials missing. Check environment variables.');
    console.log(`[Dev Mode] Reset Link: ${resetUrl}`);
    return;
  }

  try {
    await emailjs.send(
      serviceId,
      templateId,
      {
        to_email: email,
        reset_link: resetUrl,
      },
      {
        publicKey,
        privateKey,
      }
    );
  } catch (error) {
    console.error('EmailJS Service Error:', error);
    throw new Error('Failed to send password reset email');
  }
};