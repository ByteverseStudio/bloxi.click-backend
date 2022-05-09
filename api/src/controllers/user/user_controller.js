import user_schema from '../../models/user_schema.js';
import { error } from '../../utils/error_handler.js';

const me = (req, res, next) => {
    user_schema.findOne({ _id: req.user._id })
        .then(user => {
            if (!user) {
                return next(error('User not found', 404));
            }
            res.json(user);
        }).catch(err => next(error('Error while searching for User', 500, err )));
}

const change_password = (req, res, next) => {
    user_schema.findOne({ _id: req.user._id })
        .then(user => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            user.password = req.body.password;
            user.save()
                .then(() => res.status(204).json())
                .catch(err => next(error('Error while saving User', 500, err )));
        }).catch(err => next(error('Error while searching for User', 500, err )));
}


export default{
    me,
    change_password
}