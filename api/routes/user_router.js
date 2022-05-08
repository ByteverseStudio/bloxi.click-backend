import { Router } from 'express';

import login_controller from '../controllers/user/login_controller.js';
import register_controller from '../controllers/user/register_controller.js';
import user_controller from '../controllers/user/user_controller.js';
import verify_controller from '../controllers/user/verify_controller.js';
import check_user_auth from '../middleware/check_user_auth.js';


const user_router = Router();

//Login
user_router.post('/login', login_controller.login);
user_router.post('/login/discord', login_controller.login_discord);

//Register
user_router.post('/register/start', register_controller.start_account_creation);
user_router.post('/register/create', register_controller.create_account);
user_router.post('/register/create/discord', register_controller.create_account_discord);

//Verify
user_router.put('/verify/email', check_user_auth, verify_controller.send_email);
user_router.post('/verify/email', check_user_auth, verify_controller.verify_email);

//User
user_router.get('/me', check_user_auth, user_controller.me);

export default user_router;
