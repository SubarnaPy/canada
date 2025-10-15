const nodemailer = require('nodemailer');

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send consultation reply email with meeting link
exports.sendConsultationReply = async ({ to, name, consultationType, meetingLink, scheduledDate, message }) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject: `Consultation Confirmed - ${consultationType}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Consultation Confirmed</h2>
          <p>Dear ${name},</p>
          <p>Your consultation request has been confirmed. Here are the details:</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Consultation Type:</strong> ${consultationType}</p>
            <p><strong>Scheduled Date:</strong> ${new Date(scheduledDate).toLocaleString()}</p>
            ${meetingLink ? `<p><strong>Meeting Link:</strong> <a href="${meetingLink}" style="color: #2563eb;">${meetingLink}</a></p>` : ''}
          </div>
          
          ${message ? `<p><strong>Additional Information:</strong></p><p>${message}</p>` : ''}
          
          <p>Please join the meeting at the scheduled time using the link provided above.</p>
          <p>If you have any questions, feel free to reply to this email.</p>
          
          <p>Best regards,<br>Canadian Nexus Team</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
};
