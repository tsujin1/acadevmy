import nodemailer from 'nodemailer';

const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return {
      sendMail: async (mailOptions: any) => {
        const resetUrl = mailOptions.html.match(/href="([^"]*)"/)?.[1] || 'Not found';
        console.log('Development mode - Reset URL:', resetUrl);
        return { messageId: 'dev-mode-' + Date.now() };
      }
    };
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  return transporter;
};

export const sendPasswordResetEmail = async (email: string, resetUrl: string): Promise<void> => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request - Acadevmy',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>You requested to reset your password for your Acadevmy account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #000; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p><strong>Or copy this link:</strong> ${resetUrl}</p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">
            Acadevmy - Learn. Build. Grow.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

  } catch (error: any) {
    console.error('Email send failed:', error.message);

    if (error.code === 'EAUTH') {
      console.error('Authentication failed - verify 2FA and App Password settings');
    }

    throw new Error('Failed to send reset email');
  }
};