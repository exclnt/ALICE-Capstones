import SettingRepositories from '../repositories/SettingRepositories.js';
import {
  AuthentificationError,
  InvariantError,
} from '../../../exceptions/index.js';
import response from '../../../utils/response.js';

export const updateSetting = async (req, res, next) => {
  const userId = req.user.id;
  // eslint-disable-next-line camelcase
  const { monthly_income, weekly_budget } = req.validated;
  console.log('Validated data:', req.validated);

  const upSetting = {
    // eslint-disable-next-line camelcase
    monthly_income,
    // eslint-disable-next-line camelcase
    weekly_budget,
  };
  if (!userId) {
    return next(
      new AuthentificationError('Kredensial yang Anda berikan salah'),
    );
  }

  const haveSetting = await SettingRepositories.getSettingByUserId(userId);

  if (!haveSetting) {
    const newSetting = await SettingRepositories.createSetting(
      userId,
      upSetting,
    );

    if (!newSetting) {
      return next(new InvariantError('Gagal membuat pengaturan'));
    }

    return response(res, 200, 'berhasil mengupdate pengaturan', {
      setting: newSetting,
    });
  }

  const updatedSetting = await SettingRepositories.updateSettingByUserId(
    userId,
    upSetting,
  );

  if (!updatedSetting) {
    return next(new InvariantError('Gagal memperbarui pengaturan'));
  }

  return response(res, 200, 'Pengaturan berhasil diperbarui', {
    setting: updatedSetting,
  });
};

export const getSetting = async (req, res, next) => {
  const userId = req.user.id;

  if (!userId) {
    return next(
      new AuthentificationError('Kredensial yang Anda berikan salah'),
    );
  }

  const setting = await SettingRepositories.getSettingByUserId(userId);

  if (!setting) {
    return response(res, 200, 'Pengaturan tidak ditemukan', {
      setting: {
        // eslint-disable-next-line camelcase
        monthly_income: 0,
        // eslint-disable-next-line camelcase
        weekly_budget: 0,
      },
    });
  }

  return response(res, 200, 'Pengaturan berhasil diambil', {
    setting: setting,
  });
};
