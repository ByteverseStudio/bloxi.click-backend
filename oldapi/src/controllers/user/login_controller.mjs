import bcryptjs from 'bcryptjs';
import user_schema from '../../models/user_schema.js';
import discord from '../../services/discord_service.js';
import user_serivce from '../../services/user_serivce.js';

const login = (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    user_schema.findOne({$or: [{ 'username': username }, { 'email': username }]})
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const isPasswordValid = bcryptjs.compareSync(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ error: 'Invalid password' });
            }
            const token = user_serivce.createJWTLogin(user);
            res.json({ token });
        }).catch(next);
}

const login_discord = (req, res, next) => {
    const { discord_code } = req.body;

    discord.getToken(discord_code).then(discordTokenData => {
        return discord.getUserInfo(discordTokenData);
    })
    .then(discordUserData => {
            const email = discordUserData.email;
        
            return user_schema.findOne({ email })
    }).then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
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
                }).catch(next);
    })
    .catch(next);
}

export default {
    login,
    login_discord
}