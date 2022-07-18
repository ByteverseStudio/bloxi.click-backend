import { Router } from 'express';

import login_controller from '../controllers/user/login_controller.js';
import register_controller from '../controllers/user/register_controller.js';
import user_controller from '../controllers/user/user_controller.js';
import email_verify_controller from '../controllers/user/email_verify_controller.js';
import roblox_verify_controller from '../controllers/user/roblox_verify_controller.js';

import check_user_auth from '../middleware/check_user_auth.js';
import check_admin_auth from '../middleware/check_admin_auth.js';


const user_router = Router();

//Login
user_router.post('/login', login_controller.login);
user_router.post('/login/discord', login_controller.login_discord);

//Register
user_router.post('/register/start', register_controller.start_account_creation);
user_router.post('/register/create', register_controller.create_account);
user_router.post('/register/create/discord', register_controller.create_account_discord);

//Verify
user_router.put('/verify/email', check_user_auth, email_verify_controller.send_email);
user_router.post('/verify/email', email_verify_controller.verify_email);

user_router.put('/verify/roblox', check_user_auth, roblox_verify_controller.generate_roblox_verify_token);
user_router.post('/verify/roblox', check_user_auth, roblox_verify_controller.check_roblox_verify_token);
user_router.patch('/verify/roblox', check_admin_auth, roblox_verify_controller.set_roblox_verify_status);
user_router.get('/verify/roblox', check_admin_auth, roblox_verify_controller.get_user_roblox_info);

//User
user_router.get('/me', check_user_auth, user_controller.me);
user_router.put('/me/change_password', check_user_auth, user_controller.change_password);

export default user_router;
