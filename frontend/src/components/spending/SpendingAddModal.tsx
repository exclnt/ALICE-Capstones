/* eslint-disable camelcase */
import { useLocation } from 'react-router-dom';
import CurrencyInput from '../CurrencyInput.tsx';
import useInput from '../../hooks/useInput.ts';
import SelectionInput from '../SelectionInput.tsx';
import TextInput from '../TextInput.tsx';

import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery.ts';
import RiskConfirmation from './RiskConfirmation.tsx';

import { useCategories } from '../../hooks/useCategoriesHook.ts';
import { useStatusHandler } from '../../hooks/useStatusHandler.ts';
import { useAddTransaction } from '../../hooks/useTransactionHook.ts';
import { useUserSettings } from '../../hooks/useUserSettingsHook.ts';
import { usePredictTransaction } from '../../hooks/useAnalyzeHook.ts';
import { useStatus } from '../../context/StatusContext.tsx';
import { extractError } from '../utils/ExtractApiError.ts';

interface AddModalProp {
  closeModal: () => void;
  isVisible: boolean;
}

export default function AddModal({ closeModal, isVisible }: AddModalProp) {
  const { data, isPending, isError, error, isSuccess } = useCategories();
  const { showLoading, showError, hideStatus } = useStatus();
  const [amount, setAmount] = useInput('');
  const [title, setTitle] = useInput('');
  const options = useMemo(() => {
    return (
      data?.categories?.map((category, index) => ({
        id: `category-${index + 1}`,
        name: category,
      })) || []
    );
  }, [data]);
  const [selectedId, setSelectedId] = useInput();

  const currentOptionId = selectedId || options[0]?.id;
  const currentOptionName = options.find((opt) => opt.id === currentOptionId)?.name || '';

  useEffect(() => {
    if (options.length > 0 && !selectedId) {
      setSelectedId(options[0].id);
    }
  }, [options, selectedId, setSelectedId]);

  const location = useLocation();
  const isDesktop = useMediaQuery('(min-width:768px)');

  useStatusHandler({
    pending: isPending,
    error,
    isError,
    isSuccess,
  });

  const {
    mutate,
    isPending: transactionIsPending,
    isError: transactionIsError,
    isSuccess: transactionIsSuccess,
    error: transactionError,
    data: transactionData,
  } = useAddTransaction();

  const { data: userSettings } = useUserSettings();

  const { mutate: predictMutate, data: predictData } = usePredictTransaction();

  const [isRisky, setIsRisky] = useState(false);
  const toggleRiskyModal = () => {
    setIsRisky((prevState) => !prevState);
  };

  const confirmSubmit = () => {
    mutate({
      amount: Number(amount),
      category: selectedId,
      title,
      type: 'expense',
      date: new Date().toISOString(),
    });
    setSelectedId('');
    closeModal();
  };

  const handleSumbit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    showLoading();

    predictMutate(
      {
        day_of_week: new Date().getDay(),
        day_of_month: new Date().getDate(),
        hour_of_day: new Date().getHours(),
        amount: Number(amount),
        category: currentOptionName,
        weekly_budget: Number(userSettings?.setting?.weekly_budget || 0),
        segment: Number(userSettings?.setting?.segment || 0),
      },
      {
        onSuccess: (data) => {
          hideStatus();
          if (data?.data?.is_risky) {
            setIsRisky(true);
          } else {
            confirmSubmit();
          }
        },
        onError: (error) => {
          const extracted = extractError(error);
          showError(extracted.message, extracted.statusCode);
        },
      }
    );
  };

  useStatusHandler({
    pending: transactionIsPending,
    error: transactionError,
    isError: transactionIsError,
    isSuccess: transactionIsSuccess,
    successMessage: transactionData?.message,
  });

  useEffect(() => {
    closeModal();
  }, [location.pathname, closeModal]);

  return (
    <AnimatePresence>
      {isVisible && (
        <div>
          <section className="spending-modal fixed inset-0 z-30 md:z-100 flex items-end md:items-center md:justify-center pb-21 md:pb-0 px-1">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 backdrop-blur-sm bg-black/10"
              onClick={closeModal}
            />

            <motion.div
              initial={isDesktop ? { opacity: 0, scale: 0.8 } : { opacity: 0, y: '100%' }}
              animate={isDesktop ? { opacity: 1, scale: 1 } : { opacity: 1, y: 0 }}
              exit={isDesktop ? { opacity: 0, scale: 0.8 } : { opacity: 0, y: '100%' }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="bg-bg-main z-30 pb-20 md:pb-0 md:rounded-2xl w-full md:max-w-150 flex items-center flex-col p-3 rounded-tl-4xl rounded-tr-4xl ring-1 ring-primary/20"
            >
              <div>
                <h2 className="font-bold text-red-400">Pengeluaran</h2>
              </div>
              <form className="w-full p-5" onSubmit={handleSumbit}>
                <CurrencyInput
                  label="Jumlah (Rp)"
                  onValueChange={setAmount}
                  value={amount}
                  max={1000000000}
                />
                <TextInput label="Judul Catatan" value={title} onChange={setTitle} />
                <SelectionInput
                  value={selectedId}
                  label="Kategori"
                  onChange={setSelectedId}
                  options={options}
                />
                <button
                  type="submit"
                  className="bg-primary font-medium text-bg-main rounded-xl p-2 mt-15 mb-10 w-full"
                >
                  Masukan Pengeluaran
                </button>
              </form>
            </motion.div>
          </section>
          <RiskConfirmation
            isRisky={isRisky}
            toggleRiskyModal={toggleRiskyModal}
            confirmSubmit={confirmSubmit}
            predictData={predictData?.data}
          />
        </div>
      )}
    </AnimatePresence>
  );
}
