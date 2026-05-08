import express from 'express';
const router = express.Router();
import users from '../services/users/routes/index.js';
import authentification from '../services/authentifications/routes/index.js';
import googleAuth from '../services/googleAuth/routes/index.js';
import settings from '../services/settings/routes/index.js';

router.use('/', users);
router.use('/', authentification);
router.use('/', googleAuth);
router.use('/', settings);

export default router;
