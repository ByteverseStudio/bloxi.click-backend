import user_schema from '../../models/user_schema.js';
import email_service from '../../services/email_service.js';


const send_email = (req, res) => {

    const user = req.user;

    const { email } = req.body || user.email;

    user.email = email;
    user.email_verified = false;
    user.email_verification_token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    user.save()
        .then(() => {
            res.json({ message: 'Email updated' });
            email_service.sendVerifyEmail(email, user.email_verification_token)
                .then(() => {
                    console.log('Email sent');
                    res.json({ message: 'Email sent' });
                }).catch(err => {
                    console.log(err);
                    res.status(500).json({ error: err });
                });
        }).catch(err => res.status(400).json({ error: err }));
    
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