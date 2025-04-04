import { sendEmail } from '../email';

export const sendConfirmationEmail = (
  emailAddress: string,
  confirmationUrl: string,
  name?: string
) => {
  const subject = 'Welcome to FluencyTrail! Please confirm your email address.';
  const text = '';
  const html = `
  <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to FluencyTrail!</title>
      <style>
        /* Base styles */
        body {
          margin: 0;
          padding: 0;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          font-size: 16px;
          line-height: 1.5;
          color: #404040;
          background-color: #f4f4f4;
        }

        /* Container */
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
        }

        /* Header */
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 1px solid #e6e6e6;
        }

        .logo {
          max-width: 180px;
          height: auto;
        }

        /* Content */
        .content {
          padding: 30px 20px;
        }

        h1 {
          color: #0284c7;
          font-size: 24px;
          margin-top: 0;
          margin-bottom: 20px;
        }

        p {
          margin-bottom: 20px;
        }

        /* Features */
        .features {
          margin: 30px 0;
          padding: 20px;
          background-color: #f0f9ff;
          border-radius: 8px;
        }

        .feature {
          margin-bottom: 15px;
        }

        .feature-title {
          font-weight: bold;
          color: #0284c7;
          margin-bottom: 5px;
        }

        /* Button */
        .button-container {
          text-align: center;
          margin: 30px 0;
        }

        .button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #0284c7;
          color: #ffffff !important;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
          text-align: center;
        }

        /* Footer */
        .footer {
          padding: 20px;
          text-align: center;
          font-size: 14px;
          color: #727272;
          border-top: 1px solid #e6e6e6;
        }

        .social-links {
          margin: 20px 0;
        }

        .social-link {
          display: inline-block;
          margin: 0 10px;
        }

        .fine-print {
          font-size: 12px;
          color: #a2a2a2;
          margin-top: 20px;
        }

        /* Responsive */
        @media only screen and (max-width: 480px) {
          .container {
            width: 100% !important;
          }

          .content {
            padding: 20px 15px !important;
          }

          .button {
            display: block !important;
            width: 100% !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="https://dp9gtkfwnn.ufs.sh/f/LlmyUTzRNgIUVLUWvimrqk4sLiUT5Bhvucze2E6FmRb9Zxog" alt="FluencyTrail" class="logo">
        </div>

        <div class="content">
          <h1>Welcome to FluencyTrail${name ? ', ' + name : ''}!</h1>

          <p>Thank you for creating an account with FluencyTrail. We're excited to have you join our community of language learners!</p>

          <p>Your account has been successfully created, but before you can start your language learning journey, we need to verify your email address.</p>

          <div class="button-container">
            <a href="${confirmationUrl}" class="button">Verify My Email</a>
          </div>


          <p>If you have any questions or need assistance, please don't hesitate to contact our support team at <a href="mailto:support@fluencytrail.com">support@fluencytrail.com</a>.</p>

          <p>Happy learning!<br>The FluencyTrail Team</p>
        </div>

        <div class="footer">
          <p>© 2025 FluencyTrail. All rights reserved.</p>

          <p class="fine-print">
            You're receiving this email because you recently created an account on FluencyTrail.
            If you didn't create this account, please <a href="{{unsubscribe_link}}">click here</a> to unsubscribe.
          </p>

          <p class="fine-print">
            FluencyTrail, Inc.
          </p>
        </div>
      </div>
    </body>
  </html>
  `;
  return sendEmail({ to: emailAddress, subject, text, html });
};
