import * as jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import register_session_schema from '../models/register_session_schema.js';

function createJWTLogin(user) {
    return jwt.sign({
        email: user.email,
        username: user.username,
        _id: user._id,
        roblox_id: user.roblox_id
    }, process.env.JWT_SECRET, { expiresIn: '1w' });
}

function createAccount(indetifier, email, password, other_data, email_verified, roblox_verified) {

    register_session_schema.findOne({ indetifier })
        .then(session => {
            if (!session) {
                return Promise.reject({ message: 'Invalid register session', status: 400 });
            }
            //Session older than 24 hours
            if (session.created_at < Date.now() - 86400000) {
                session.deleteOne().then(() => {
                    return Promise.reject({ message: 'Register session expired', status: 400 });
                });
            }
            const newUser = new User({
                email: email,
                password: bcryptjs.hashSync(password, 10),
                roblox_id: session.roblox_id,
                username: session.roblox_username,
                roblox_verified: roblox_verified || false,
                email_verified: email_verified || false,
                created_at: Date.now,
                discord_data: other_data.discordData ? other_data.discord_data : null,
                other_data: other_data.otherData ? other_data.other_data : null
            });
            newUser.save()
                .then(() => {
                    session.deleteOne().then(() => { return Promise.resolve(newUser) })
                        .catch(err => { return Promise.reject({ message: 'Failed to create account', status: 500, error: err }) });
                }).catch(err => { Promise.reject({ message: 'Failed to create account', status: 500, error: err }) });
        }).catch(err => { Promise.reject({ message: 'Failed to create account', status: 400, error: err }) });
}

export default {
    createJWTLogin,
    createAccount
};