import { sendEmail } from '../email';

export const sendForgotPasswordEmail = (
  emailAddress: string,
  name: string,
  resetUrl: string
) => {
  const subject = 'Reset your password';
  const text = '';
  const html = `
    <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your FluencyTrail Password</title>
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

          /* Security Notice */
          .security-notice {
            margin: 30px 0;
            padding: 15px;
            background-color: #f0f9ff;
            border-left: 4px solid #0284c7;
            border-radius: 4px;
          }

          /* Button */
          .button-container {
            text-align: center;
            margin: 30px 0;
          }

          .button {
            display: inline-block;
            padding: 14px 28px;
            background-color: #0284c7;
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            font-size: 16px;
            text-align: center;
          }

          /* Link fallback */
          .link-fallback {
            margin-top: 15px;
            font-size: 14px;
            color: #727272;
            word-break: break-all;
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
            color: #0284c7;
            text-decoration: none;
          }

          .fine-print {
            font-size: 12px;
            color: #a2a2a2;
            margin-top: 20px;
          }

          /* Expiration notice */
          .expiration {
            font-style: italic;
            color: #727272;
            margin-top: 10px;
            font-size: 14px;
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
            <img src="https://dp9gtkfwnn.ufs.sh/f/LlmyUTzRNgIUVLUWvimrqk4sLiUT5Bhvucze2E6FmRb9Zxog" alt="FluencyTrail Logo" class="logo">
          </div>

          <div class="content">
            <h1>Reset Your Password</h1>

            <p>Hello ${name},</p>

            <p>We received a request to reset the password for your FluencyTrail account. If you made this request, please use the button below to reset your password.</p>

            <div class="button-container">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>

            <p class="link-fallback">If the button above doesn't work, copy and paste this URL into your browser: <br>${resetUrl}</p>

            <p class="expiration">This password reset link will expire in 24 hours.</p>

            <div class="security-notice">
              <strong>Security Notice:</strong>
              <p>If you didn't request a password reset, please ignore this email or contact our support team. Your account security is important to us.</p>
            </div>

            <p>For security reasons, this link can only be used once. If you need to reset your password again, please visit <a href="https://fluencytrail.com/forgot-password">FluencyTrail's forgot password page</a> and submit a new request.</p>

            <p>Happy learning!<br>The FluencyTrail Team</p>
          </div>

          <div class="footer">
            <p>Need help? Contact us at <a href="mailto:support@fluencytrail.com">support@fluencytrail.com</a></p>
            <p class="fine-print">
              You're receiving this email because a password reset was requested for your FluencyTrail account.
              If you didn't request this, please ignore this email or <a href="{{contact_support_link}}">contact support</a> if you have concerns.
            </p>
            <p class="fine-print">
              FluencyTrail, Inc.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: emailAddress,
    subject,
    text,
    html,
  });
};
