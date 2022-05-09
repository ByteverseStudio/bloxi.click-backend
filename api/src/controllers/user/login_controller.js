import bcryptjs from 'bcryptjs';
import user_schema from '../../models/user_schema.js';

import discord from '../../services/discord_service.js';
import user_serivce from '../../services/user_serivce.js';

import { error } from '../../utils/error.js';


const login = (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return next({ message: 'Username or password not found', status: 400 });
    }

    user_schema.findOne({$or: [{ 'username': username }, { 'email': username }]})
        .then(user => {
            if (!user) {
                return next(error('User not found', 404));
            }
            const isPasswordValid = bcryptjs.compareSync(password, user.password);
            if (!isPasswordValid) {
                return next(error("Invalid password", 400));
            }
            const token = user_serivce.createJWTLogin(user);
            res.json({ token });
        }).catch(err => next(error("User not found", 500, err )));
}

const login_discord = (req, res, next) => {
    const { discord_code } = req.body;

    discord.getToken(discord_code).then(discordTokenData => {
        discord.getUserInfo(discordTokenData).then(discordUserData => {
            const email = discordUserData.email;
        
            findOne({ email })
                .then(user => {
                    if (!user) {
                        return next({ message: 'User not found', status: 404 });
                    }
                    user.discordData = {
                        id: discordUserData.id,
                        username: discordUserData.username,
                        discriminator: discordUserData.discriminator,
                        tokenData: discordTokenData
                    }
                    user.save()
                        .then(() => {
                            const token = user_serivce.createJWTLogin(user);
                            res.json({ jwt: token });
                        }).catch(err => next({ message: 'User saved failed', status: 500, error: err }));
                }).catch(err => next({ message: 'User not found', status: 404, error: err }));
        }).catch(err => next({ message: 'Failed to login', status: 500, error: err }));
    }).catch(err => next({ message: 'Failed to login', status: 500, error: err }));
}

export default {
    login,
    login_discord
}