import user_schema from '../../models/user_schema.js';

const me = (req, res, next) => {
    user_schema.findOne({ _id: req.user._id })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.json(user);
        }).catch(next);
}

const change_password = (req, res, next) => {
    user_schema.findOne({ _id: req.user._id })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            user.password = req.body.password;
            user.save()
                .then(() => res.sendStatus(204))
                .catch(next);
        }).catch(next);
}


export default{
    me,
    change_password
}