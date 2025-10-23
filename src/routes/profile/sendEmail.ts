import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private';

export const sendEmail = async (
  inviterName: string,
  inviteeEmail: string,
  token: string
) => {

  // --- COLOR MAPPING (HSL to Hex for dark theme) ---
  // --background: 224 71.4% 4.1%   -> #0A0A0B
  // --foreground: 210 20% 98%      -> #FAFAFC
  // --primary: 263.4 70% 50.4%     -> #8B30D9
  // --secondary: 215 27.9% 16.9%   -> #292D39
  // --muted-foreground: 217.9 10.6% 64.9% -> #979CA9

  const background_color = '#0A0A0B'; // Corresponds to --background / --card
  const foreground_color = '#FAFAFC'; // Corresponds to --foreground / --card-foreground
  const primary_color = '#8B30D9';    // Corresponds to --primary (button background, highlights)
  const secondary_color = '#292D39';  // Corresponds to --secondary / --border
  const text_color = '#979CA9';       // Corresponds to --muted-foreground (body text)

  // 1. Construct the unique sign-up link
  const signupLink = `https://autoagile.dev/signup?token=${token}`;

  // 2. Define the HTML content (formatted nicely with dark theme)
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>You're Invited to Auto Agile!</title>
      <style>
          body { 
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
              background-color: ${background_color}; /* Dark background */
              margin: 0; 
              padding: 0; 
              color: ${foreground_color}; 
          }
          .container { 
              max-width: 600px; 
              margin: 20px auto; 
              background-color: ${background_color}; /* Dark Card */
              border-radius: 8px; 
              overflow: hidden; 
              border: 1px solid ${secondary_color}; /* Border color */
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5); 
          }
          .header { 
              background-color: ${primary_color}; /* Primary accent color */
              color: ${foreground_color}; 
              padding: 20px; 
              text-align: center; 
          }
          h1, h2 { color: ${foreground_color}; }
          .content { 
              padding: 30px; 
              line-height: 1.6; 
              color: ${text_color}; /* Muted foreground for body text */
          }
          .button-container { text-align: center; margin: 30px 0; }
          .button { 
              background-color: ${primary_color}; /* Primary accent color */
              color: ${foreground_color}; /* Primary foreground */
              text-decoration: none; 
              padding: 12px 25px; 
              border-radius: 6px; 
              font-weight: bold; 
              display: inline-block;
          }
          .inviter { 
              font-weight: bold; 
              color: ${primary_color}; /* Highlight inviter name */
          }
          a { color: ${primary_color}; text-decoration: none; }
      </style>
  </head>
  <body style="background-color: ${background_color}; color: ${foreground_color};">
      <div class="container">
          <div class="header">
              <h1>Auto Agile Invitation</h1>
          </div>
          <div class="content">
              <h2>You've Been Invited!</h2>
              <p style="color: ${text_color};">Hello,</p>
              <p style="color: ${text_color};"><span class="inviter">${inviterName}</span> has invited you to join Auto Agile and configure your home devices based on the current Agile Prices from Octopus Energy.</p>

              <div class="button-container">
                  <a href="${signupLink}" class="button">Accept Invitation and Join Group</a>
              </div>

              <p style="color: ${text_color}; font-size: 12px;">If the button above doesn't work, you can copy and paste the link below into your browser:</p>
              <p style="word-break: break-all;"><a href="${signupLink}" style="color: ${primary_color};">${signupLink}</a></p>

              <p style="color: ${text_color};">We look forward to having you!</p>
              <p style="color: ${foreground_color};">Best regards,<br>Ed at Auto Agile</p>
              <p style="color: ${text_color};">P.S. This invite will expire after 24 hours(ish)</p>
          </div>
      </div>
  </body>
  </html>
  `;

  // 3. Define the Plain Text content (essential for email fallback)
  const textContent = `
You're Invited to Auto Agile!

Hello,

${inviterName} has invited you to join Auto Agile and configure your home devices based on the current Agile Prices from Octopus Energy.

Accept your invitation here:
${signupLink}

Best regards,
Ed at Auto Agile
    `;

  const email = {
    // NOTE: Resend's best practice is often to use the domain for the 'from' email
    from: `Auto Agile <invites@autoagile.dev>`,
    to: [inviteeEmail],
    subject: `${inviterName} has invited you to Auto Agile!`,
    html: htmlContent,
    text: textContent,
  };

  const resend = new Resend(RESEND_API_KEY);

  const { error: emailError } = await resend.emails.send(email);

  return { emailError };
}