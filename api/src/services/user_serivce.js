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
                    return reject('Session not found');
                }
                //Session older than 24 hours
                if (session.created_at < Date.now() - 86400000) {
                    session.deleteOne()
                        .then(() => {
                            return reject('Session expired');
                        }).catch(err => { reject(err) });
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
                            .catch(err => { reject(err) });
                    }).catch(err => { reject(err) });
            }).catch(err => { reject(err) });
    });
}


export default {
    createJWTLogin,
    createAccount
};