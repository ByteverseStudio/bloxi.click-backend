import user_schema from '../../models/user_schema.js';
import random_words from 'random-words';
import roblox_service from '../../services/roblox_service.js';

const generate_roblox_verify_token = (req, res, next) => {
    const user = req.user;

    const { token_type } = req.body;

    user_schema.findOne({ _id: user._id })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            if (user.roblox_verified) {
                return res.status(400).json({ error: 'User already verified' });
            }

            switch (token_type) {
                case 'words':
                    user.roblox_verification_token = random_words({ exactly: 3, join: ' ' });
                    break;
                default:
                case 'random':
                    user.roblox_verification_token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                    break;
            }
            user.save()
                .then(() => res.json({ token: user.roblox_verification_token }))
                .catch(next);
        }).catch(next);
}

const check_roblox_verify_token = (req, res, next) => {
    const user = req.user;
    const token = user.roblox_verification_token;

    const { search_type } = req.body || "blurb";

    switch (search_type) {
        default:
        case 'blurb':
            roblox_service.checkTokenInBlurb(user.roblox_id, token)
                .then(result => {
                    if (!result) {
                        return res.status(400).json({ error: 'Invalid token' });
                    }

                        user.roblox_verified = true;
                        user.roblox_verification_token = null;
                        user.save()
                            .then(() => res.sendStatus(204))
                            .catch(next);
                }).catch(next);
            break;
    }
}

const set_roblox_verify_status = (req, res, next) => {
    const { roblox_id, roblox_verified } = req.body;

    user_schema.findOne({ roblox_id })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            user.roblox_verified = roblox_verified;
            user.save()
                .then(() => res.status(204).json())
                .catch(next);
        }).catch(next);
}

const get_user_roblox_info = (req, res) => {
    const { roblox_id } = req.body;

    user_schema.findOne({ roblox_id })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json({ email: user.email, roblox_verified: user.roblox_verified, username: user.username });
        }).catch(next);
}

export default {
    generate_roblox_verify_token,
    check_roblox_verify_token,
    set_roblox_verify_status,
    get_user_roblox_info
}
