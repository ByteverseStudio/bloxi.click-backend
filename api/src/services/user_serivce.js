import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import register_session_schema from '../models/register_session_schema.js';
import User from '../models/user_schema.js';

function createJWTLogin(user) {
    return jwt.sign({
        email: user.email,
        username: user.username,
        _id: user._id,
        roblox_id: user.roblox_id
    }, process.env.JWT_SECRET, { expiresIn: '1w' });
}

function createAccount(indetifier, email, password, other_data, email_verified, roblox_verified) {

    if (other_data === undefined) {
        other_data = { discordData: null, otherData: null };
    }

    return new Promise((resolve, reject) => {
        register_session_schema.findOne({ indetifier: indetifier })
            .then(session => {
                if (!session) {
                    return reject({ message: 'Invalid register session', status: 400 });
                }
                //Session older than 24 hours
                if (session.created_at < Date.now() - 86400000) {
                    session.deleteOne()
                        .then(() => {
                            return reject({ message: 'Register session expired', status: 400 });
                        }).catch(err => { return reject({ message: 'Failed to delete register session', status: 500, error: err }) });
                }
                const newUser = new User({
                    email: email,
                    password: bcryptjs.hashSync(password, 10),
                    roblox_id: session.roblox_id,
                    username: session.roblox_username,
                    roblox_verified: roblox_verified || false,
                    email_verified: email_verified || false,
                    discord_data: other_data.discordData ? other_data.discord_data : null,
                    other_data: other_data.otherData ? other_data.other_data : null
                });
                newUser.save()
                    .then(() => {
                        session.deleteOne()
                            .then(() => { return resolve(newUser) })
                            .catch(err => { return reject({ message: 'Failed to create account', status: 500, error: err }) });
                    }).catch(err => { reject({ message: 'Failed to create account', status: 500, error: err }) });
            }).catch(err => { reject({ message: 'Failed to create account', status: 400, error: err }) });
    });
}


export default {
    createJWTLogin,
    createAccount
};