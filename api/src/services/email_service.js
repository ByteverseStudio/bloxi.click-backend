import aws from 'aws-sdk';

const SESV2 = new aws.SESV2();

function sendVerifyEmail(email, email_verification_token) {
    // Create sendEmail params 
    const params = {
        Destination: {
            ToAddresses: [
                email
            ]
        },
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: `<html>
                    <head>
                        <title>Verify your email</title>
                    </head>
                    <body>
                        <h1>Verify your email</h1>
                        <p>
                            <a href="${process.env.FRONTEND_URL}/verify/${user.email_verification_token}">Verify your email</a>
                        </p>
                    </body>
                    </html>`,
                },
                Text: {
                    Charset: 'UTF-8',
                    Data: `Verify your email: ${process.env.FRONTEND_URL}/verify/${user.email_verification_token}`,
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Verify your email',
            }
        },
        Source: process.env.emailSender,
    };

    return new Promise((resolve, reject) => {
        SESV2.sendEmail(params, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });

}

export default {
    sendVerifyEmail
}