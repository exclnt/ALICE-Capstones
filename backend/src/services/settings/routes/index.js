import { Router } from 'express';
import {
  getSetting,
  updateSetting,
} from '../controllers/settingControllers.js';
import authetificate from '../../../middlewares/auth.js';
import validate from '../../../middlewares/validate.js';
import { updateSettingPayloadSchema } from '../validator/schema.js';

const router = Router();

router.get('/setting', authetificate, getSetting);
router.put(
  '/setting',
  validate(updateSettingPayloadSchema),
  authetificate,
  updateSetting,
);

export default router;
