import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Verify SMTP configuration
console.log('🔧 SMTP Configuration:');
console.log('Host:', process.env.SMTP_HOST);
console.log('Port:', process.env.SMTP_PORT);
console.log('User:', process.env.SMTP_USER);
console.log('Admin Email:', process.env.ADMIN_EMAIL);

// Create transporter using Gmail SMTP with proper settings for Gmail
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true', // false for port 587, true for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // Use App Password if 2FA is enabled
  },
  tls: {
    rejectUnauthorized: false, // Allow self-signed certs (for Gmail)
  },
  // Add timeout to prevent hanging
  connectionTimeout: 5000,
  socketTimeout: 5000,
});

// Verify transporter connection (non-blocking with timeout)
setTimeout(() => {
  transporter.verify((error, success) => {
    if (error) {
      console.error('❌ SMTP Connection Error:', error.message);
      console.error('⚠️  Email sending may not work. Continuing anyway...');
    } else {
      console.log('✅ SMTP Transporter is ready to send emails');
    }
  });
}, 1000); // Verify after 1 second, don't block startup

// Send notification email to admin when someone contacts
export const sendAdminNotificationEmail = async (contactData) => {
  try {
    console.log('\n📧 Sending admin notification email...');
    console.log('📮 To:', process.env.ADMIN_EMAIL);
    console.log('👤 From:', contactData.email);
    
    // Return immediately if email config is missing
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.ADMIN_EMAIL) {
      console.warn('⚠️  Email config missing, skipping email send');
      return { success: false, error: 'Email configuration incomplete' };
    }
    
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL,
      replyTo: contactData.email,
      subject: `New Contact Message from ${contactData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #0066cc; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 10px 0;">
              <strong style="color: #555;">From:</strong> 
              <span style="color: #333;">${contactData.name}</span>
            </p>
            
            <p style="margin: 10px 0;">
              <strong style="color: #555;">Email:</strong> 
              <a href="mailto:${contactData.email}" style="color: #0066cc; text-decoration: none;">${contactData.email}</a>
            </p>
            
            <p style="margin: 10px 0;">
              <strong style="color: #555;">Phone:</strong> 
              <span style="color: #333;">${contactData.phone}</span>
            </p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #555; margin-bottom: 10px;">Message:</h3>
            <div style="background-color: #fff; padding: 15px; border-left: 4px solid #0066cc; border-radius: 4px;">
              <p style="color: #333; line-height: 1.6; margin: 0;">${contactData.message}</p>
            </div>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            This email was sent from your portfolio contact form at ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    };

    // Wrap sendMail in a timeout promise
    const emailPromise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Email send timeout'));
      }, 10000); // 10 second timeout

      transporter.sendMail(mailOptions, (error, info) => {
        clearTimeout(timeout);
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });

    const info = await emailPromise;
    console.log('✅ Admin notification email sent successfully');
    console.log('📬 Message ID:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending admin notification email:', error.message);
    return { success: false, error: error.message };
  }
};

// Send thank you email to the person who contacted you
export const sendThankYouEmail = async (recipientEmail, recipientName) => {
  try {
    console.log('\n📧 Sending thank you email...');
    console.log('📮 To:', recipientEmail);
    
    // Return immediately if email config is missing
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('⚠️  Email config missing, skipping thank you email');
      return { success: false, error: 'Email configuration incomplete' };
    }
    
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: recipientEmail,
      subject: 'Thank You for Contacting Me - Aditi Shrimankar',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #0066cc; margin: 0; font-size: 28px;">Thank You for Reaching Out!</h1>
            </div>
            
            <p style="color: #333; line-height: 1.8; font-size: 16px;">
              Hi <strong>${recipientName}</strong>,
            </p>
            
            <p style="color: #333; line-height: 1.8; font-size: 16px;">
              Thank you for contacting me through my portfolio website. I have received your message and truly appreciate you taking the time to reach out.
            </p>
            
            <div style="background-color: #e8f4fd; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #0066cc;">
              <p style="color: #333; line-height: 1.8; font-size: 16px; margin: 0;">
                <strong>📧 What's Next?</strong><br>
                I will review your message carefully and get back to you as soon as possible, typically within 12-24 hours.
              </p>
            </div>
            
            <p style="color: #333; line-height: 1.8; font-size: 16px;">
              If you have any additional information to share or urgent matters, feel free to reply to this email directly.
            </p>
            
            <p style="color: #333; line-height: 1.8; font-size: 16px; margin-top: 30px;">
              Best regards,<br>
              <strong style="color: #0066cc; font-size: 18px;">Aditi Shrimankar</strong><br>
              <span style="color: #666; font-size: 14px;">Full Stack Developer</span>
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              This is an automated response from my portfolio contact form.<br>
              Sent on ${new Date().toLocaleString()}
            </p>
          </div>
        </div>
      `,
    };

    // Wrap sendMail in a timeout promise
    const emailPromise = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Email send timeout'));
      }, 10000); // 10 second timeout

      transporter.sendMail(mailOptions, (error, info) => {
        clearTimeout(timeout);
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });

    const info = await emailPromise;
    console.log('✅ Thank you email sent successfully to:', recipientEmail);
    console.log('📬 Message ID:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending thank you email:', error.message);
    return { success: false, error: error.message };
  }
};
