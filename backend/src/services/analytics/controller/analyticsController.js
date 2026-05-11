import axios from 'axios';

import { AuthentificationError } from '../../../exceptions/index.js';
import response from '../../../utils/response.js';
import TransactionRepositories from '../../transaction/repositories/TransactionRepositories.js';
import SettingRepositories from '../../settings/repositories/SettingRepositories.js';
import CategoriesRepositories from '../../categories/repositories/CategoriesRepositories.js';

export const predictBalance = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { startDate, endDate } = req.query;

    if (!userId) {
      return next(
        new AuthentificationError('Kredensial yang Anda berikan salah'),
      );
    }

    const dailySpending = await TransactionRepositories.getDailySpending(
      userId,
      { startDate, endDate },
    );

    const dailyNet = await TransactionRepositories.getDailyNet(userId, {
      startDate,
      endDate,
    });

    const balance = await TransactionRepositories.getBalance(userId, {
      startDate,
      endDate,
    });

    const payload = {
      //eslint-disable-next-line camelcase
      daily_spending: dailySpending.map((item) => Number(item.total_expense)),
      //eslint-disable-next-line camelcase
      daily_net: dailyNet.map((item) => Number(item.net)),

      balance: balance.map((item) => Number(item.balance)),
    };

    console.log(payload);

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
    console.error(error);

    return next(error);
  }
};

export const budgetOptimization = async (req, res, next) => {
  const userId = req.user.id;
  const { startDate, endDate } = req.query;

  console.log(userId, startDate, endDate);

  try {
    const transactionsInMonth =
      await TransactionRepositories.getTransactionsByUserId(userId, {
        startDate,
        endDate,
      });

    const categorydb = await CategoriesRepositories.getCategories();

    const userSetting = await SettingRepositories.getSettingByUserId(userId);

    const st = categorydb.map((cat) => {
      const total = transactionsInMonth.data.reduce((sum, transaction) => {
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

    const totalPengeluaran = transactionsInMonth.data.reduce(
      (sum, transaction) => {
        return sum + Number(transaction.amount);
      },
      0,
    );

    const categoryProportions = st.map((cat) => ({
      category: cat.category,
      proportion: cat.total / totalPengeluaran || 0,
    }));

    const aiResponse = await axios.post(
      `${process.env.AI_URL}/api/v1/optimize-budget`,
      {
        //eslint-disable-next-line camelcase
        category_proportions: categoryProportions.map((cat) => cat.proportion),
        //eslint-disable-next-line camelcase
        monthly_income: userSetting.monthly_income,
        //eslint-disable-next-line camelcase
        weekly_budget: userSetting.weekly_budget,
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

    await SettingRepositories.updateSegmentByUserId(userId, 0, segment);

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

    return response(res, 200, 'Prediksi risiko berhasil', {
      // payloadForAI,
      aiResponse: aiResponse.data,
    });
  } catch (error) {
    console.error(error);

    return next(error);
  }
};
