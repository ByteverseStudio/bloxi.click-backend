import aws from 'aws-sdk';

function send_verify_mail(email, email_verification_token){
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
                            <a href="${process.env.frontendUrl}/verify/${user.email_verification_token}">Verify your email</a>
                        </p>
                    </body>
                    </html>`,
                },
                Text: {
                    Charset: 'UTF-8',
                    Data: `Verify your email: ${process.env.frontendUrl}/verify/${user.email_verification_token}`,
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'Verify your email',
            }
        },
        Source: process.env.emailSender,
    };

    var emailSender = new aws.SESV2().sendEmail(params, function (err, data) {
        if (err) {
            Promise.reject(err);
        } else {
            Promise.resolve(data);
        }});
    Promise.resolve(null);
}

export default {
    send_verify_mail
}