const mongoose = require('mongoose');
const User = require('../../models/user/userser');
const RobloxData = require('../../models/user/robloxData');
const DiscordData = require('../../models/user/discordData');
const OtherData = require('../../models/user/otherData');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const express = require('express');
const checkAuthAdmin = require('../middleware/checkAuthAdmin');

const router = express.Router();

router.post('/register', (req, res) => {
    const { email, username, password } = req.body;

    var passwordHash = bcrypt.hashSync(password, 10);

    const newUser = new User({
        email,
        username,
        password: passwordHash,
        verifyToken: jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' }),
    });

    newUser.save()
        .then(() => res.json({ message: 'User created successfully' }))
        .catch(err => res.status(400).json({ error: err }));
}
);

router.post('/login', (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid password' });
            }
            const token = jwt.sign({
                email: user.email,
                username: user.username,
                id: user._id,
                status: user.status,
                robloxId: user.robloxId
            }, 'secret', { expiresIn: '1h' });
            res.json({ token });
        }).catch(err => res.status(400).json({ error: err }));
});



router.post('verify/email', (req, res) => {
    const { email, emailVerifyToken } = req.body;

    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            const isTokenValid = jwt.verify(emailVerifyToken, process.env.JWT_SECRET);
            if (!isTokenValid) {
                return res.status(401).json({ error: 'Invalid token' });
            }
            user.status = 'emailverified';
            user.verifyToken = null;
            user.save()
                .then(() => res.json({ message: 'Email verified successfully' }))
                .catch(err => res.status(400).json({ error: err }));
            
}
);

router.post('verify/roblox', checkAuthAdmin, (req, res) => {
    const { robloxId } = req.body;

