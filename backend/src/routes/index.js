import express from 'express';
const router = express.Router();
import users from '../services/users/routes/index.js';
import authentification from '../services/authentifications/routes/index.js';
import googleAuth from '../services/googleAuth/routes/index.js';
import settings from '../services/settings/routes/index.js';
import categories from '../services/categories/routes/index.js';
import transaction from '../services/transaction/routes/index.js';
import analytics from '../services/alice/routes/index.js';

router.use('/', users);
router.use('/', authentification);
router.use('/', googleAuth);
router.use('/', settings);
router.use('/', categories);
router.use('/', transaction);
router.use('/', analytics);

export default router;
