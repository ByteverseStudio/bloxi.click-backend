import user_schema from '../../models/user_schema.js';

const me = (req, res) => {
    user_schema.findOne({ _id: req.user._id })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        }).catch(err => res.status(400).json({ error: err }));
}

const change_password = (req, res) => {
    user_schema.findOne({ _id: req.user._id })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            user.password = req.body.password;
            user.save()
                .then(() => res.json({ success: true }))
                .catch(err => res.status(400).json({ error: err }));
        }).catch(err => res.status(400).json({ error: err }));
}


export default{
    me,
    change_password
}