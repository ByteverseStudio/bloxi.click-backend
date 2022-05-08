import aws from 'aws-sdk';
import user_schema from '../../models/user_schema.js';

const send_email = (req, res) => {

    const user = req.user;

    const { email } = req.body || user.email;

    user.email = email;
    user.email_verified = false;
    user.email_verification_token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    user.save()
        .then(() => {
            res.json({ message: 'Email updated' });

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
                    console.log(err);
                    res.status(500).json({ error: err });
                } else {
                    console.log(data);
                    res.json({ message: 'Email sent' });
                }
            });
        }
        ).catch(err => res.status(400).json({ error: err }));
}

const verify_email = (req, res) => {
    const { email, email_verification_token } = req.body;

    user_schema.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            if (user.email_verified) {
                return res.status(400).json({ error: 'Email already verified' });
            }
            if (user.email_verification_token !== email_verification_token) {
                return res.status(400).json({ error: 'Invalid token' });
            }
            user.email_verified = true;
            user.email_verification_token = null;
            user.save()
                .then(() => res.json({ message: 'Email verified' }))
                .catch(err => res.status(400).json({ error: err }));
        }).catch(err => res.status(400).json({ error: err }));
}

export default {
    send_email,
    verify_email
}