import * as jwt from 'jsonwebtoken';
import user_schema from '../models/user_schema.js';

export default (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({
            message: 'No token, authorization denied'
        });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({
            message: 'Token not found'
        });
    }
    jwt.verify(token, process.env.jwtSecret, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: 'Token is invalid'
            });
        }
        user_schema.findOne({_id: decoded._id})
            .then(user => {
                if (!user) {
                    return res.status(401).json({
                        message: 'User not found'
                    });
                }
                req.user = user;
                next();
            }).catch(err => res.status(401).json({
                message: 'User not found'
            }));
    });
}