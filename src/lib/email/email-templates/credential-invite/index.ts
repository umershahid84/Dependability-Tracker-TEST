import {logoBase64} from '../../logoBase64';

export const credentialInviteTemplate = (
  inviteId: string,
  username: string,
  inviteToken: string,
  createLoginCredentialsLink: string
): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="color-scheme" content="light">
        <title>Email Verification</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: rgb(2, 6, 23) !important; color: #e2e2e2 !important; margin: 0; padding: 0;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: rgb(2, 6, 23) !important; width: 100%; height: 100%; margin: 0; padding: 20px 0;">
            <tr>
                <td align="center" style="padding: 0; margin: 0;">
                    <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: rgb(30, 41, 59) !important; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); padding: 20px; width: 100%; max-width: 600px;">
                        <tr>
                            <td align="center" style="padding: 20px;">
                              <img
                                src=${logoBase64}
                                alt="Dependability Tracker Logo"
                                style="width: 350px !important; border-radius: 5px;" />
                                <h2 style="color: #e2e2e2 !important; margin-top: 35px">Dependability Tracker</h2>
                            </td>
                        </tr>
                        <tr>
                            <td align="left" style="padding: 20px;">
                                <h1 style="font-size: 24px; color: #e2e2e2 !important; margin-bottom: 20px;">Create Account Credentials</h1>
                                <p style="margin-bottom: 20px; color: #e2e2e2 !important;">Dear ${username},</p>
                                <p style="margin-bottom: 20px; color: #e2e2e2 !important;">Click on the link below to create your login credentials:</p>
                              
                                <div style="text-align: center; margin-bottom: 20px; font-size: 12px">
                                    <a href="${createLoginCredentialsLink}?invite-id=${inviteId}&token=${inviteToken}" target="_blank" rel="noopener noreferrer" style="display: block; background-color: #4aca00 !important; color: #ffffff !important; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; width: 90%;">Create Credentials</a>
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
  `;
};
