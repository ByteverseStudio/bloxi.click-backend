import axios from 'axios';

const getToken = discord_code => {
    axios.post('https://discordapp.com/api/oauth2/token', {
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: discord_code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI
    }).then(response => {
        const token = response.data.access_token;

        const discordTokenData = {
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
            expires_in: Date.now() + response.data.expires_in * 1000,
            token_type: response.data.token_type,
            scope: response.data.scope
        }
        return Promise.resolve(discordTokenData);
    }).catch(err => {
        return Promise.reject(err);
    });
};


const getUserInfo = discordTokenData => {
    axios.get('https://discordapp.com/api/users/@me', {
        headers: {
            Authorization: `Bearer ${discordTokenData.access_token}`
        }
    }).then(response => {
        const discord_data = {
            id: response.data.id,
            username: response.data.username,
            discriminator: response.data.discriminator,
            token_data: discordTokenData,
            email: response.data.email
        }
        return Promise.resolve(discord_data);
    }).catch(err => {
        return Promise.reject(err);
    });
};

export default {
    getToken,
    getUserInfo
}

