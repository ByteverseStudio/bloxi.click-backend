import user_schema from '../../models/user_schema.js';
import email_service from '../../services/email_service.js';


const send_email = (req, res, next) => {

    const user = req.user;

    const { email } = req.body || user;

    user.email = email;
    user.email_verified = false;
    const email_verification_token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    user.email_verification_token = email_verification_token;

    user.save()
        .then(() => {
            if (user.email_verified) {
                return res.status(400).json({ error: 'Email already verified' });
            }

            return email_service.sendVerifyEmail(email, email_verification_token)
        })
        .then(() => { res.sendStatus(204) })
        .catch(next);
}

const verify_email = (req, res, next) => {
    const { email_verification_token } = req.body;

    user_schema.findOne({ email_verification_token })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'Token does not exist' });
            }
            if (user.email_verified) {
                return res.status(400).json({ error: 'Email already verified' });
            }
            if (user.email_verification_token !== email_verification_token) {
                return res.status(400).json({ error: 'Invalid email verification token' });
            }
            user.email_verified = true;
            user.email_verification_token = null;
            return user.save()
        })
        .then(() => { res.sendStatus(204) })
        .catch(next);
}

export default {
    send_email,
    verify_email
}