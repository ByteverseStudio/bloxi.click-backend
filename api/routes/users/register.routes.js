const mongoose = require('mongoose');
const User = require('../../models/user/userser');
const RegisterSession = require('../../models/registerSession');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const noblox = require('noblox.js');
const axios = require('axios');
const aws = require('aws-sdk');
const checkAuthAdmin = require('../middleware/checkAuthAdmin');


const router = express.Router();

router.post('/start', (req, res) => {
    const { roblox_username } = req.body;

    noblox.getIdFromUsername(roblox_username)
        .then(id => {

            User.findOne({ roblox_id: id })
                .then(user => {
                    if (user) {
                        if (!user.roblox_verified) {
                            user.deleteOne()
                        } else {
                            return res.status(400).json({ error: 'User already exists' });
                        }
                    }

                    await RegisterSession.findOne({ roblox_id: id }).deleteOne()

                    const indetifier = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

                    const newRegisterSession = new RegisterSession({
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
});


function createAccount(indetifier, email, password, other_data, email_verified, roblox_verified) {
    RegisterSession.findOne({ indetifier })
        .then(session => {
            if (!session) {
                return res.status(404).json({ error: 'Session not found' });
            }
            //Session older than 24 hours
            if (session.created_at < Date.now() - 86400000) {
                session.deleteOne()
                return res.status(404).json({ error: 'Session expired' });
            }
            const newUser = new User({
                email: email,
                password: password,
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
                    session.deleteOne()
                    return res.json({ message: 'User created successfully' });
                }
                )
                .catch(err => res.status(400).json({ error: err }));
        }
        )
        .catch(err => res.status(400).json({ error: err }));
}

router.post('/create', (req, res) => {
    const { indetifier, email, password } = req.body;

    if (!indetifier || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    return createAccount(indetifier, email, password, { discordData: null, otherData: null });
});

router.post('/create/discord', (req, res) => {
    const { indetifier, password, discordCode } = req.body;

    if (!indetifier || !password || !discordCode) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    axios.post('https://discordapp.com/api/oauth2/token', {
        client_id: process.env.discordClientId,
        client_secret: process.env.discordClientSecret,
        grant_type: 'authorization_code',
        code: discordCode,
        redirect_uri: `xyz`
    }).then(response => {

        const discordTokenData = {
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
            expires_in: response.data.expires_in,
            token_type: response.data.token_type,
            scope: response.data.scope
        }

        axios.get('https://discordapp.com/api/users/@me', {
            headers: {
                Authorization: `${token} ${discordTokenData.access_token}`
            }
        }).then(response => {
            const discordData = {
                id: response.data.id,
                username: response.data.username,
                discriminator: response.data.discriminator,
                tokenData: discordTokenData
            }

            const email = response.data.email;

            return createAccount(indetifier, email, password, { discordData, otherData: null }, true);
        }).catch(err => res.status(400).json({ error: err }));
    }).catch(err => res.status(400).json({ error: err }));
});


