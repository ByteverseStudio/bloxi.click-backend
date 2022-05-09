import user_schema from '../../models/user_schema.js';

import email_service from '../../services/email_service.js';

import { error } from '../../utils/error_handler.js';



const send_email = (req, res, next) => {

    const user = req.user;

    const { email } = req.body || user;

    user.email = email;
    user.email_verified = false;
    const email_verification_token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    user.email_verification_token = email_verification_token;

    user.save()
        .then(() => {
            email_service.sendVerifyEmail(email, email_verification_token)
                .then(() => {
                    res.json({ message: 'Email sent' });
                }).catch(err => next(error("Email sent failed", 500, err )));
        }).catch(err => next(error("User saved failed", 500, err )));
}

const verify_email = (req, res, next) => {
    const { email_verification_token } = req.body;

    user_schema.findOne({ email_verification_token })
        .then(user => {
            if (!user) {
                return next(error('User not found', 404));
            }
            if (user.email_verified) {
                return next(error('Email already verified', 400));
            }
            if (user.email_verification_token !== email_verification_token) {
                return next(error('Email verification token does not match', 400));
            }
            user.email_verified = true;
            user.email_verification_token = null;
            user.save()
                .then(() => res.json({ message: 'Email verified' }))
                .catch(err => next(error("User saved failed", 500, err )));
        }).catch(err => next(error("Error while finding user", 500, err )));
}

export default {
    send_email,
    verify_email
}