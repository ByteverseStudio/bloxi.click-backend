import jwt from 'jsonwebtoken';
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
                            user.deleteOne().exec();
                        } else {
                            return res.status(400).json({ error: 'Account already exists' });
                        }
                    }

                    register_session_schema.findOne({ roblox_id: id }).deleteOne()
                        .then(() => {

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
                                    }, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
                                        if (err) {
                                            return res.status(500).json({ error: 'Failed to create jwt token' });
                                        }
                                        res.json({ jwt: token });
                                    });
                                }).catch(next);
                        }).catch(next);
                }).catch(next);
        }).catch(next);
}

const create_account = (req, res, next) => {
    const { indetifier, email, password } = req.body;

    if (!indetifier || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    user_service.createAccount(indetifier, email, password, { discordData: null, otherData: null }, false, false)
        .then((user) => { res.sendStatus(204) })
        .catch(next);
}

const create_account_discord = (req, res, next) => {
    const { indetifier, password, discordCode } = req.body;

    if (!indetifier || !password || !discordCode) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    discord_service.getToken(discordCode).then(token => {
        discord_service.getUserInfo(token).then(user => {
            const discordData = {
                id: user.id,
                username: user.username,
                discriminator: user.discriminator,
                tokenData: token
            }

            const email = user.email;

            user_service.createAccount(indetifier, email, password, { discordData, otherData: null }, true, false)
                .then(() => { res.sendStatus(204) })
                .catch(next);
        }).catch(next);
    }).catch(next);
}

export default {
    start_account_creation,
    create_account,
    create_account_discord
}