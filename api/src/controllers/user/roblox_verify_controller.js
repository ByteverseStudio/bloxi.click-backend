import user_schema from '../../models/user_schema.js';
import random_words from 'random-words';
import roblox_service from '../../services/roblox_service.js';
import { error } from './utils/error_handler.js';


const generate_roblox_verify_token = (req, res, next) => {
    const user = req.user;

    const { token_type } = req.body;

    user_schema.findOne({ _id: user._id })
        .then(user => {
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
                .catch(err => next(error("User saved failed", 500, err )));
        }).catch(err => next(error("Error while finding user", 500, err )));
}

const check_roblox_verify_token = (req, res, next) => {
    const user = req.user;
    const token = user.roblox_verification_token;

    //const { search_type } = req.body;

    roblox_service.checkTokenInBlurb(user.roblox_id, token)
        .then(result => {
            if (!result) {
                return next(error('Roblox verification token does not match', 400));
            }

                user.roblox_verified = true;
                user.roblox_verification_token = null;
                user.save()
                    .then(() => res.status(204).json())
                    .catch(err => next(error("User saved failed", 500, err )));
        }).catch(err => next(error("Error while finding user", 500, err )));
}

const set_roblox_verify_status = (req, res, next) => {
    const { roblox_id, roblox_verified } = req.body;

    user_schema.findOne({ roblox_id })
        .then(user => {
            if (!user) {
                return next(error('User not found', 404));
            }
            user.roblox_verified = roblox_verified;
            user.save()
                .then(() => res.status(204).json())
                .catch(err => next(error("User saved failed", 500, err )));
        }).catch(err => next(error("Error while finding user", 500, err )));
}

const get_user_roblox_info = (req, res) => {
    const { roblox_id } = req.body;

    user_schema.findOne({ roblox_id })
        .then(user => {
            if (!user) {
                return next(error('User not found', 404));
            }
            res.json({ email: user.email, roblox_verified: user.roblox_verified, username: user.username });
        }).catch(err => next(error("Error while finding user", 500, err )));
}

export default {
    generate_roblox_verify_token,
    check_roblox_verify_token,
    set_roblox_verify_status,
    get_user_roblox_info
}
