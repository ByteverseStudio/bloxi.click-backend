import * as jwt from 'jsonwebtoken';
import nobloxJs from 'noblox.js';
import user_serivce from '../../services/user_serivce.js';
import discord_service from '../../services/discord_service.js';
import register_session_schema from '../../models/register_session_schema.js';
import user_schema from '../../models/user_schema.js';

const start_account_creation = (req, res) => {
    const { roblox_username } = req.body;

    nobloxJs.getIdFromUsername(roblox_username)
        .then(id => {

            user_schema.findOne({ roblox_id: id })
                .then(user => {
                    if (user) {
                        if (!user.roblox_verified) {
                            user.deleteOne()
                        } else {
                            return res.status(400).json({ error: 'User already exists' });
                        }
                    }

                    register_session_schema.findOne({ roblox_id: id }).deleteOne()

                    const indetifier = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

                    const newRegisterSession = new register_session_schema({
                        roblox_username: roblox_username,
                        roblox_id: id,
                        indetifier: indetifier,
                        createdAt: Date.now
                    });

                    newRegisterSession.save()

                    const token = jwt.sign({
                        roblox_username: roblox_username,
                        roblox_id: id,
                        indetifier: indetifier
                    }, process.env.jwtSecret, { expiresIn: '24h' });

                    res.json({ token });

                }).catch(err => res.status(400).json({ error: err }));
        }).catch(err => res.status(404).json({ error: err, status: 'error', message: 'User on Roblox not exist' }));
}

const create_account = (req, res) => {
    const { indetifier, email, password } = req.body;

    if (!indetifier || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    return user_serivce.createAccount(indetifier, email, password, { discordData: null, otherData: null });
}

const create_account_discord = (req, res) => {
    const { indetifier, password, discordCode } = req.body;

    if (!indetifier || !password || !discordCode) {
        return res.status(400).json({ error: 'Missing required fields' });
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

            return user_serivce.createAccount(indetifier, email, password, { discordData, otherData: null }, true);
        }).catch(err => res.status(400).json({ error: err }));
    }).catch(err => res.status(400).json({ error: err }));
}

export default {
    start_account_creation,
    create_account,
    create_account_discord
}