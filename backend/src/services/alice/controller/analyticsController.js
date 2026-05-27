import axios from 'axios';

import {
  AuthentificationError,
  InvariantError,
} from '../../../exceptions/index.js';
import response from '../../../utils/response.js';
import TransactionRepositories from '../../transaction/repositories/TransactionRepositories.js';
import SettingRepositories from '../../settings/repositories/SettingRepositories.js';
import CategoriesRepositories from '../../categories/repositories/CategoriesRepositories.js';
import getRangedDate from '../../../utils/getRangedDate.js';

export const predictBalance = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    const { startDate, endDate } = req.validated;

    const dstartDate = getRangedDate(29, endDate).startDate;

    if (!userId) {
      return next(
        new AuthentificationError('Kredensial yang Anda berikan salah'),
      );
    }

    const settingUser = await SettingRepositories.getSettingByUserId(userId);

    // eslint-disable-next-line camelcase
    const { weekly_budget, monthly_income, created_at } = settingUser;
    // eslint-disable-next-line camelcase
    if (weekly_budget <= 0 || monthly_income <= 0) {
      return response(
        res,
        400,
        'Setting Weekly Budget dan Monthly Income Terlebih Dahulu.',
      );
    }

    const targetDate = new Date(created_at);
    const now = new Date();

    const diffTime = now - targetDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (!(diffDays >= 30)) {
      return response(
        res,
        422,
        `Model Belum Bisa melakukan Prediksi Berdasar Data Kamu, Tunggu ${Math.round(30 - diffDays)} Hari Dan Periksa Kembali`,
      );
    }

    const [dailySpending, dailyNet, balance] = await Promise.all([
      TransactionRepositories.getDailySpending(userId, {
        startDate: startDate || dstartDate,
        endDate,
      }),

      TransactionRepositories.getDailyNet(userId, {
        startDate: startDate || dstartDate,
        endDate,
      }),

      TransactionRepositories.getBalance(userId, {
        startDate: startDate || dstartDate,
        endDate,
      }),
    ]);

    const spendingLength = dailySpending.length;

    const netLength = dailyNet.length;

    const balanceLength = balance.length;

    if (spendingLength !== netLength || spendingLength !== balanceLength) {
      return next(
        new InvariantError(
          `Jumlah data tidak sama 
          (spending=${spendingLength}, 
          net=${netLength}, 
          balance=${balanceLength})`,
        ),
      );
    }

    const payload = {
      // eslint-disable-next-line camelcase
      daily_spending: dailySpending.map((item) =>
        Number(item.total_expense || 0),
      ),

      // eslint-disable-next-line camelcase
      daily_net: dailyNet.map((item) => Number(item.net || 0)),

      balance: balance.map((item) => Number(item.balance || 0)),
    };

    const aiResponse = await axios.post(
      `${process.env.AI_URL}/api/v1/predict-balance`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const result = aiResponse.data;

    return response(res, 200, 'Prediksi saldo berhasil', {
      predictions: result.predictions,

      warnings: result.warnings,
    });
  } catch (error) {
    return next(new InvariantError(`Error Code: ${error}`));
  }
};

export const budgetOptimization = async (req, res, next) => {
  const userId = req.user.id;
  const { endDate } = req.validated;
  const { week = null, month = null } = req.body || {};

  const startDate = getRangedDate(29, endDate).startDate;

  try {
    const settingUser = await SettingRepositories.getSettingByUserId(userId);

    // eslint-disable-next-line camelcase
    const { weekly_budget, monthly_income, created_at } = settingUser;
    // eslint-disable-next-line camelcase
    if (weekly_budget <= 0 || monthly_income <= 0) {
      return response(
        res,
        400,
        'Setting Weekly Budget dan Monthly Income Terlebih Dahulu.',
      );
    }

    const targetDate = new Date(created_at);
    const now = new Date();

    const diffTime = now - targetDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (!(diffDays >= 30)) {
      return response(
        res,
        422,
        `Model Belum Bisa melakukan Prediksi Berdasar Data Kamu, Tunggu ${Math.round(30 - diffDays)} Hari Dan Periksa Kembali`,
      );
    }

    const [transactionsInMonth, categories, userSetting] = await Promise.all([
      TransactionRepositories.getTransactionsByUserId(userId, {
        startDate,
        endDate,
      }),
      CategoriesRepositories.getCategories(),
      SettingRepositories.getSettingByUserId(userId),
    ]);

    const transactions = transactionsInMonth?.data || [];

    const categoryTotals = categories.map((cat) => {
      const total = transactions.reduce((sum, transaction) => {
        if (transaction.category === cat.name) {
          return sum + Number(transaction.amount);
        }

        return sum;
      }, 0);

      return {
        category: cat.name,
        total,
      };
    });

    const totalPengeluaran = transactions.reduce(
      (sum, transaction) => sum + Number(transaction.amount),
      0,
    );

    const categoryProportions = categoryTotals.map((cat) => ({
      category: cat.category,
      proportion: totalPengeluaran > 0 ? cat.total / totalPengeluaran : 0,
    }));

    const aiResponse = await axios.post(
      `${process.env.AI_URL}/api/v1/optimize-budget`,
      {
        /* eslint-disable  */
        category_proportions: categoryProportions.map((cat) => cat.proportion),
        monthly_income: month || userSetting.monthly_income,
        weekly_budget: week || userSetting.weekly_budget,
        /* eslint-enable  */
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return response(res, 200, 'Prediksi saldo berhasil', aiResponse.data);
  } catch (error) {
    console.error(error);

    return next(error);
  }
};
export const postSegmentation = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const [stats, impulsiveRatio, endMonthRatio, overbudgetFreq] =
      await Promise.all([
        TransactionRepositories.getAvgSpendingAndCV(userId),
        TransactionRepositories.getImpulsiveRatio(userId),
        TransactionRepositories.getEndMonthRatio(userId),
        TransactionRepositories.getOverbudgetFreq(userId),
      ]);

    const payloadForAI = {
      /* eslint-disable camelcase */
      avg_spending: stats.avg_spending,
      spending_cv: stats.spending_cv,
      impulsive_ratio: impulsiveRatio,
      end_month_ratio: endMonthRatio,
      overbudget_freq: overbudgetFreq,
      /* eslint-enable camelcase */
    };

    const aiResponse = await axios.post(
      `${process.env.AI_URL}/api/v1/segment-user`,
      payloadForAI,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const segment = aiResponse.data.segment_label;
    const segmentCount = aiResponse.data.segment_number;

    await SettingRepositories.updateSegmentByUserId(
      userId,
      segmentCount,
      segment,
    );

    return response(res, 200, 'Segmentation berhasil', aiResponse.data);
  } catch (error) {
    console.error(error);

    return next(error);
  }
};

/* eslint-disable camelcase */
function isImpulsive(amount, weekly_budget) {
  if (weekly_budget === 0) return false;
  return amount > weekly_budget * 0.5;
}

export const predictRisk = async (req, res, next) => {
  const userId = req.user.id;
  /* eslint-disable camelcase */
  const {
    day_of_week,
    day_of_month,
    hour_of_day,
    category,
    amount,
    weekly_budget,
    segment,
  } = req.validated;
  /* eslint-enable camelcase */
  try {
    // eslint-disable-next-line camelcase
    if (weekly_budget <= 0) {
      return response(
        res,
        400,
        'Setting Weekly Budget dan Monthly Income Terlebih Dahulu.',
      );
    }

    const [impulsiveRatio, overbudgetFreq] = await Promise.all([
      TransactionRepositories.getImpulsiveRatio(userId),
      TransactionRepositories.getOverbudgetFreq(userId),
    ]);

    const payloadForAI = {
      /* eslint-disable camelcase */
      day_of_week: day_of_week,
      day_of_month: day_of_month,
      hour_of_day: hour_of_day,
      // segment: 2,
      category: category,
      amount: amount,
      weekly_budget: weekly_budget,
      segment: segment,
      is_impulsive: isImpulsive(amount, weekly_budget) ? 1 : 0,
      impulsive_ratio: impulsiveRatio,
      overbudget_freq: overbudgetFreq,
      /* eslint-enable camelcase */
    };

    const aiResponse = await axios.post(
      `${process.env.AI_URL}/api/v1/predict-risk`,
      payloadForAI,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    return response(res, 200, 'Prediksi risiko berhasil', aiResponse.data);
  } catch (error) {
    console.error(error);

    return next(error);
  }
};
