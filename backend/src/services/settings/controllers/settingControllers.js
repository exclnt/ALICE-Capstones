import SettingRepositories from '../repositories/SettingRepositories.js';
import {
  AuthentificationError,
  InvariantError,
} from '../../../exceptions/index.js';
import response from '../../../utils/response.js';

export const updateSetting = async (req, res, next) => {
  const userId = req.user.id;
  // eslint-disable-next-line camelcase
  const { monthly_income, weekly_budget, financial_goal, financial_problem } =
    req.validated;
  console.log('Validated data:', req.validated);

  const upSetting = {
    // eslint-disable-next-line camelcase
    monthly_income,
    // eslint-disable-next-line camelcase
    weekly_budget,
    // eslint-disable-next-line camelcase
    financial_goal,
    // eslint-disable-next-line camelcase
    financial_problem,
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
      setting: {
        // eslint-disable-next-line camelcase
        monthly_income: Number(newSetting.monthly_income),
        // eslint-disable-next-line camelcase
        weekly_budget: Number(newSetting.weekly_budget),
        // eslint-disable-next-line camelcase
        financial_goal: newSetting.financial_goal,
        // eslint-disable-next-line camelcase
        financial_problem: newSetting.financial_problem,
        // eslint-disable-next-line camelcase
        updated_at: newSetting.updated_at,
        segment: newSetting.segment,
        // eslint-disable-next-line
        segment_label: newSetting.segment_label,
      },
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
    setting: {
      // eslint-disable-next-line camelcase
      monthly_income: Number(updatedSetting.monthly_income),
      // eslint-disable-next-line camelcase
      weekly_budget: Number(updatedSetting.weekly_budget),
      // eslint-disable-next-line camelcase
      financial_goal: updatedSetting.financial_goal,
      // eslint-disable-next-line camelcase
      financial_problem: updatedSetting.financial_problem,
      // eslint-disable-next-line camelcase
      updated_at: updatedSetting.updated_at,
      segment: updatedSetting.segment,
      // eslint-disable-next-line
      segment_label: updatedSetting.segment_label,
    },
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
    const newSetting = await SettingRepositories.createSetting(userId, {
      // eslint-disable-next-line camelcase
      monthly_income: 0,
      // eslint-disable-next-line camelcase
      weekly_budget: 0,
    });
    return response(res, 200, 'Pengaturan tidak ditemukan', {
      setting: {
        // eslint-disable-next-line camelcase
        monthly_income: Number(newSetting.monthly_income),
        // eslint-disable-next-line camelcase
        weekly_budget: Number(newSetting.weekly_budget),
        // eslint-disable-next-line camelcase
        financial_goal: newSetting.financial_goal,
        // eslint-disable-next-line camelcase
        financial_problem: newSetting.financial_problem,
        segment: newSetting.segment,
        // eslint-disable-next-line
        segment_label: newSetting.segment_label,
        // eslint-disable-next-line
        updated_at: newSetting.updated_at,
        // eslint-disable-next-line camelcase
        created_at: newSetting.created_at,
      },
    });
  }

  return response(res, 200, 'Pengaturan berhasil diambil', {
    setting: {
      // eslint-disable-next-line camelcase
      monthly_income: Number(setting.monthly_income),
      // eslint-disable-next-line camelcase
      weekly_budget: Number(setting.weekly_budget),
      // eslint-disable-next-line camelcase
      financial_goal: setting.financial_goal,
      // eslint-disable-next-line camelcase
      financial_problem: setting.financial_problem,
      // eslint-disable-next-line camelcase
      updated_at: setting.updated_at,
      segment: setting.segment,
      // eslint-disable-next-line
      segment_label: setting.segment_label,
    },
  });
};
