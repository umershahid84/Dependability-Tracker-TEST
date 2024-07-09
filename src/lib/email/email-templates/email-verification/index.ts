import fs from 'fs';
import path from 'path';

const logoPath = path.resolve(__dirname, './seatac-dark.png');

console.log('LOGO PATH:', logoPath);

const logo = fs.readFileSync(logoPath, 'base64');

export const emailVerificationTemplate = (
  inviteId: string,
  username: string,
  inviteToken: string,
  defaultPassword: string,
  createLoginCredentialsLink: string
): string => {
  return `
    <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification</title>
            <style>
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgb(2 6 23);
            color: #e2e2e2;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            /* Prevent scrolling */
        }

        .container {
            padding: 20px;
            width: 90%;
            max-width: 600px;
            height: auto;
            max-height: min-content;
            background-color: rgb(30 41 59);
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            align-items: center;
            overflow: hidden;
            gap: 15px;
        }

        .header {
            text-align: center;
            padding-bottom: 20px;
        }

        .header img {
            max-width: 100px;
            margin-bottom: 10px;
            border-radius: 5px;
        }

        .content {
            text-align: left;
            padding: 20px;
            width: 100%;
        }

        .content h1 {
            font-size: 24px;
            margin-bottom: 20px;
        }

        .greeting {
            margin-bottom: 20px;
        }

        .content p {
            line-height: 1.6;
        }

        .verification-code {
            background-color: rgb(15 23 42);
            border-radius: 5px;
            padding: 10px;
            margin: 20px 0;
            text-align: center;
            width: 100%;
        }

        .verification-code p {
            font-size: 20px;
            font-weight: bold;
        }

        .verification-code h2 {
            font-size: 16px;
            margin: 0;
        }

        .button {
            width: 100%;
            text-align: center;
            margin: 20px 0;
        }

        .button a {
            display: block;
            background-color: #4aca00;
            color: #ffffff;
            padding: 15px 25px;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            width: 100%;
            text-align: center;
        }

        .button a:hover {
            background-color: #2980b9;
        }

        .closing {
            margin-top: 20px;
        }

        .footer {
            text-align: center;
            padding-top: 20px;
            font-size: 12px;
            color: #888;
            width: 100%;
        }
    </style>
        </head>
        <body>
            <section class="container">
                <header class="header">
                    <img src="data:image/png;base64,${logo}" alt="MyPasswordKeeper Logo" crossorigin="anonymous">
                    <h2>MyPasswordKeeper</h2>
                </header>
                <div class="content">
                    <h1>Create Account Credentials</h1>
                    <p>Dear ${username},</p>
                    <p>Click on the link below to create your login credentials:</p>
                    <div class="verification-code">
                        <h2>Use the token below when creating your login credentials!</h2>
                        
                      <p>Invite Token: ${inviteToken}</p>


                        <div class="button">
                            <a href=${createLoginCredentialsLink}?invite-id=${inviteId} rel='noreferrer noopener' target="_blank">Create Credentials</a>
                        </div>
                    </div>  
                    
                </div>
            </section>
        </body>
    </html>
  `;
};
