import * as jwt from 'jsonwebtoken';
import nobloxJs from 'noblox.js';
import user_service from '../../services/user_serivce.js';
import discord_service from '../../services/discord_service.js';
import register_session_schema from '../../models/register_session_schema.js';
import user_schema from '../../models/user_schema.js';

const start_account_creation = (req, res, next) => {
    const { roblox_username } = req.body;

    nobloxJs.getIdFromUsername(roblox_username)
        .then(id => {

            user_schema.findOne({ roblox_id: id })
                .then(user => {
                    if (user) {
                        if (!user.roblox_verified) {
                            user.deleteOne()
                        } else {
                            next({ message: 'User already exists', status: 400})
                        }
                    }

                    register_session_schema.findOne({ roblox_id: id }).deleteOne().exec();

                    const indetifier = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)


                    const newRegisterSession = new register_session_schema({
                        roblox_username: roblox_username,
                        roblox_id: id,
                        indetifier: indetifier,
                        createdAt: Date.now
                    });

                    newRegisterSession.save()
                        .then(() => {
                            jwt.sign({
                                roblox_username: roblox_username,
                                roblox_id: id,
                                indetifier: indetifier
                            }, process.env.JWT_SECRET, { expiresIn: '24h' })
                                .then(token => {
                                    console.log("Token: " + token);
                                    res.json({ jwt: token });
                                }).catch(err => next({ error: err, status: 500, message: 'Failed to create jwt token' }));
                        }).catch(err => next({ message: 'Failed to create register session', status: 500, error: err }));
                }).catch(err => next({ message: 'Failed to create register session', status: 400, error: err }));
        }).catch(err => next({ message: 'Failed to create register session', status: 400, error: err }));
}

const create_account = (req, res, next) => {
    const { indetifier, email, password } = req.body;

    if (!indetifier || !email || !password) {
        next({ message: 'Missing required fields', status: 400 });
        return;
    }

    user_service.createAccount(indetifier, email, password, { discordData: null, otherData: null }, false, false)
        .then(() => {
            res.json({ message: 'Account created' });
        }).catch(err => next({ message: 'Failed to create account', status: 500, error: err }));
}

const create_account_discord = (req, res, next) => {
    const { indetifier, password, discordCode } = req.body;

    if (!indetifier || !password || !discordCode) {
        next({ message: 'Missing required fields', status: 400 });
        return;
    }

    discord_service.getToken(discordCode).then(token => {
        discord_service.getUserInfo(token).then(user => {
            const discordData = {
                id: response.data.id,
                username: response.data.username,
                discriminator: response.data.discriminator,
                tokenData: discordTokenData
            }

            const email = response.data.email;

            user_service.createAccount(indetifier, email, password, { discordData, otherData: null }, true, false)
                .then(() => {
                    res.json({ message: 'Account created' });
                }).catch(err => next({ message: 'Failed to create account', status: 500, error: err }));
        }).catch(err => next({ message: 'Failed to create account', status: 500, error: err }));
    }).catch(err => next({ message: 'Failed to create account', status: 500, error: err }));
}

export default {
    start_account_creation,
    create_account,
    create_account_discord
}