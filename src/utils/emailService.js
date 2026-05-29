import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Verify Resend configuration
console.log('🔧 Resend Configuration:');
console.log('✅ API Key:', process.env.RESEND_API_KEY ? '***' + process.env.RESEND_API_KEY.slice(-4) : 'NOT SET');
console.log('📧 From Email:', process.env.FROM_EMAIL);
console.log('📬 Admin Email:', process.env.ADMIN_EMAIL);

// Send notification email to admin when someone contacts
export const sendAdminNotificationEmail = async (contactData) => {
  try {
    console.log('\n📧 Sending admin notification email via Resend...');
    console.log('📮 To:', process.env.ADMIN_EMAIL);
    console.log('👤 From:', contactData.email);

    // Validate configuration
    if (!process.env.RESEND_API_KEY || !process.env.FROM_EMAIL || !process.env.ADMIN_EMAIL) {
      console.warn('⚠️  Resend configuration incomplete, skipping email');
      return { success: false, error: 'Resend config missing' };
    }

    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: process.env.ADMIN_EMAIL,
      replyTo: contactData.email,
      subject: `New Contact Message from ${contactData.name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #00d4ff 0%, #0099ff 100%); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">
                        📬 New Contact Form Submission
                      </h1>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      
                      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                        Dear Aditi,
                      </p>
                      
                      <p style="color: #333333; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                        You have received a new message through your portfolio contact form. Please find the details below:
                      </p>
                      
                      <!-- Contact Details Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 6px; margin-bottom: 25px;">
                        <tr>
                          <td style="padding: 20px;">
                            <table width="100%" cellpadding="8" cellspacing="0">
                              <tr>
                                <td style="color: #666666; font-size: 14px; font-weight: 600; width: 100px;">Name:</td>
                                <td style="color: #333333; font-size: 14px;">${contactData.name}</td>
                              </tr>
                              <tr>
                                <td style="color: #666666; font-size: 14px; font-weight: 600;">Email:</td>
                                <td style="color: #0099ff; font-size: 14px;">
                                  <a href="mailto:${contactData.email}" style="color: #0099ff; text-decoration: none;">${contactData.email}</a>
                                </td>
                              </tr>
                              <tr>
                                <td style="color: #666666; font-size: 14px; font-weight: 600;">Phone:</td>
                                <td style="color: #333333; font-size: 14px;">${contactData.phone}</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- Message Box -->
                      <div style="margin-bottom: 25px;">
                        <p style="color: #666666; font-size: 14px; font-weight: 600; margin: 0 0 10px 0;">Message:</p>
                        <div style="background-color: #ffffff; border-left: 4px solid #00d4ff; padding: 15px; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                          <p style="color: #333333; font-size: 14px; line-height: 1.8; margin: 0; white-space: pre-wrap;">${contactData.message}</p>
                        </div>
                      </div>
                      
                      <!-- Action Button -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                        <tr>
                          <td align="center">
                            <a href="mailto:${contactData.email}" style="display: inline-block; background: linear-gradient(135deg, #00d4ff 0%, #0099ff 100%); color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-size: 14px; font-weight: 600;">
                              Reply to ${contactData.name}
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 20px 30px; border-radius: 0 0 8px 8px; text-align: center;">
                      <p style="color: #999999; font-size: 12px; margin: 0; line-height: 1.6;">
                        This email was sent from your portfolio contact form<br>
                        ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (result.error) {
      console.error('❌ Error sending admin notification email:', result.error.message);
      return { success: false, error: result.error.message };
    }

    console.log('✅ Admin notification email sent successfully to:', process.env.ADMIN_EMAIL);
    console.log('📬 Message ID:', result.data.id);
    return { success: true, messageId: result.data.id };
  } catch (error) {
    console.error('❌ Error sending admin notification email:', error.message);
    return { success: false, error: error.message };
  }
};

// Send thank you email to the person who contacted you
export const sendThankYouEmail = async (recipientEmail, recipientName) => {
  try {
    console.log('\n📧 Sending thank you email via Resend...');
    console.log('📮 To:', recipientEmail);

    // Validate configuration
    if (!process.env.RESEND_API_KEY || !process.env.FROM_EMAIL) {
      console.warn('⚠️  Resend configuration incomplete, skipping email');
      return { success: false, error: 'Resend config missing' };
    }

    const result = await resend.emails.send({
      from: process.env.FROM_EMAIL,
      to: recipientEmail,
      subject: 'Thank You for Contacting Me - Aditi Shrimankar',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #00d4ff 0%, #0099ff 100%); padding: 40px 30px; border-radius: 8px 8px 0 0; text-align: center;">
                      <h1 style="color: #ffffff; margin: 0 0 10px 0; font-size: 28px; font-weight: 600;">
                        Thank You for Reaching Out! 🙏
                      </h1>
                      <p style="color: #ffffff; margin: 0; font-size: 14px; opacity: 0.9;">
                        Your message has been received successfully
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      
                      <p style="color: #333333; font-size: 16px; line-height: 1.8; margin: 0 0 20px 0;">
                        Dear <strong>${recipientName}</strong>,
                      </p>
                      
                      <p style="color: #333333; font-size: 16px; line-height: 1.8; margin: 0 0 20px 0;">
                        Thank you for contacting me through my portfolio website. I have received your message and truly appreciate you taking the time to reach out.
                      </p>
                      
                      <!-- Info Box -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #e8f7ff 0%, #f0f9ff 100%); border-radius: 8px; margin: 30px 0; border-left: 4px solid #00d4ff;">
                        <tr>
                          <td style="padding: 25px;">
                            <p style="color: #333333; font-size: 15px; line-height: 1.8; margin: 0 0 15px 0;">
                              <strong style="color: #0099ff; font-size: 16px;">📧 What's Next?</strong>
                            </p>
                            <p style="color: #555555; font-size: 14px; line-height: 1.8; margin: 0;">
                              I will review your message carefully and get back to you as soon as possible, typically within <strong>12-24 hours</strong>. If you have any additional information to share or urgent matters, feel free to reply to this email directly.
                            </p>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="color: #333333; font-size: 16px; line-height: 1.8; margin: 30px 0 0 0;">
                        Best regards,
                      </p>
                      
                      <div style="margin: 20px 0 0 0;">
                        <p style="color: #0099ff; font-size: 20px; font-weight: 600; margin: 0 0 5px 0;">
                          Aditi Shrimankar
                        </p>
                        <p style="color: #666666; font-size: 14px; margin: 0;">
                          Full Stack Developer | AI Engineer | Data Science Enthusiast
                        </p>
                      </div>
                      
                      <!-- Social Links (Optional) -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0 0 0;">
                        <tr>
                          <td align="center">
                            <p style="color: #999999; font-size: 13px; margin: 0 0 10px 0;">Connect with me:</p>
                            <a href="https://aditishrimankar.com" style="color: #0099ff; text-decoration: none; font-size: 13px; margin: 0 10px;">🌐 Portfolio</a>
                            <span style="color: #cccccc;">|</span>
                            <a href="https://linkedin.com/in/aditi-shrimankar" style="color: #0099ff; text-decoration: none; font-size: 13px; margin: 0 10px;">💼 LinkedIn</a>
                            <span style="color: #cccccc;">|</span>
                            <a href="https://github.com/Adittii72" style="color: #0099ff; text-decoration: none; font-size: 13px; margin: 0 10px;">💻 GitHub</a>
                          </td>
                        </tr>
                      </table>
                      
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f8f9fa; padding: 25px 30px; border-radius: 0 0 8px 8px; text-align: center;">
                      <p style="color: #999999; font-size: 12px; margin: 0 0 5px 0; line-height: 1.6;">
                        This is an automated response from my portfolio contact form.
                      </p>
                      <p style="color: #cccccc; font-size: 11px; margin: 0; line-height: 1.6;">
                        Sent on ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
                      </p>
                      <p style="color: #cccccc; font-size: 11px; margin: 10px 0 0 0;">
                        Please do not reply to noreply@aditishrimankar.com
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (result.error) {
      console.error('❌ Error sending thank you email:', result.error.message);
      return { success: false, error: result.error.message };
    }

    console.log('✅ Thank you email sent successfully to:', recipientEmail);
    console.log('📬 Message ID:', result.data.id);
    return { success: true, messageId: result.data.id };
  } catch (error) {
    console.error('❌ Error sending thank you email:', error.message);
    return { success: false, error: error.message };
  }
};
