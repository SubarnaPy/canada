const nodemailer = require('nodemailer');

// Gmail transporter optimized for Render
const createTransporter = () => {
  console.log('📧 Creating Gmail transporter...');
  console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'NOT SET');
  console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Set (length: ' + process.env.EMAIL_PASSWORD.length + ')' : 'NOT SET');
  
  return nodemailer.createTransporter({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: true,
      minVersion: 'TLSv1.2'
    },
    pool: true,
    maxConnections: 1,
    rateDelta: 20000,
    rateLimit: 5,
    logger: true,
    debug: true
  });
};

// Send consultation reply email with meeting link
exports.sendConsultationReply = async ({ to, name, consultationType, meetingLink, scheduledDate, message }) => {
  console.log('\n📧 ===== EMAIL SEND ATTEMPT =====');
  console.log('To:', to);
  console.log('Name:', name);
  console.log('Type:', consultationType);
  console.log('Meeting Link:', meetingLink);
  console.log('Scheduled:', scheduledDate);
  
  try {
    const transporter = createTransporter();
    
    console.log('✅ Transporter created successfully');
    
    // Verify transporter
    console.log('🔍 Verifying transporter connection...');
    await transporter.verify();
    console.log('✅ Transporter verified successfully');
    
    const mailOptions = {
      from: `"Canadian Nexus" <${process.env.EMAIL_USER}>`,
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

    console.log('📤 Sending email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
    console.log('===== EMAIL SEND COMPLETE =====\n');
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('\n❌ ===== EMAIL SEND FAILED =====');
    console.error('Error Code:', error.code);
    console.error('Error Command:', error.command);
    console.error('Error Message:', error.message);
    console.error('Full Error:', error);
    console.error('===== EMAIL ERROR END =====\n');
    throw error;
  }
};
