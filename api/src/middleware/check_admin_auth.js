import admin_schema from '../models/admin_schema.js';

export default (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token not found' });
    }
    admin_schema.findOne({ token })
        .then(admin => {
            if (!admin) {
                return res.status(401).json({ message: 'Token is invalid' });
            }
            req.admin = admin;
            next();
        }).catch(err => res.status(401).json({ message: 'Token is invalid' }));
}

    
