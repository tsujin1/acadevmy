import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const EMAIL_FROM = process.env.EMAIL_FROM || 'Acadevmy <onboarding@resend.dev>';

const getResetEmailTemplate = (resetUrl: string) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #111; text-align: center;">Reset Your Password</h2>
    <p style="color: #555; font-size: 16px;">
      You requested to reset your password for your Acadevmy account.
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" 
         style="background-color: #000; color: white; padding: 14px 28px; 
                text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
        Reset Password
      </a>
    </div>
    <p style="color: #555; font-size: 14px;">
      Or copy and paste this link into your browser:
      <br/>
      <a href="${resetUrl}" style="color: #000; word-break: break-all;">${resetUrl}</a>
    </p>
    <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;">
    <p style="color: #888; font-size: 12px; text-align: center;">
      If you didn't request this, please ignore this email.
    </p>
  </div>
`;

export const sendPasswordResetEmail = async (email: string, resetUrl: string): Promise<void> => {
  if (!resend) {
    console.log('\n[DEV MODE] Email Simulator ----------------');
    console.log(`To:   ${email}`);
    console.log(`Link: ${resetUrl}`);
    console.log('---------------------------------------------\n');
    return;
  }

  try {
    const response = await resend.emails.send({
      from: EMAIL_FROM,
      to: [email],
      subject: 'Reset your Acadevmy password',
      html: getResetEmailTemplate(resetUrl),
    });

    if (response.error) {
      console.error('[Resend API Error]:', response.error);
      throw new Error(`Email provider error: ${response.error.message}`);
    }

    console.log(`[Email Sent] ID: ${response.data?.id} | To: ${email}`);

  } catch (error) {
    console.error('[SendEmail Service Failed]:', error);
    throw new Error('Failed to send password reset email. Please try again later.');
  }
};