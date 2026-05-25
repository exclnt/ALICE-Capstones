import { AnimatePresence, motion } from 'framer-motion';
import ConfigContainer from '../profile/ConfigContainer';
import TextInput from '../TextInput';
import useInput from '../../hooks/useInput.ts';
import { useStatusHandler } from '../../hooks/useStatusHandler.ts';
import { useTransactionsById } from '../../hooks/useTransactionHook.ts';
import CurrencyInput from '../CurrencyInput.tsx';
import SelectionInput from '../SelectionInput.tsx';
import { useEffect, useMemo } from 'react';
import type { Categories } from '../../validator/CategoriesSchema.ts';
import { usePutTransactionsById } from '../../hooks/useTransactionHook.ts';
import { useStatus } from '../../context/StatusContext.tsx';

interface EditModalTransactionProp {
  id: string | null;
  closeModal: () => void;
  isEditing: boolean;
  categoriesData: Categories | undefined;
}

export default function EditModalTransaction({
  id,
  closeModal,
  isEditing,
  categoriesData,
}: EditModalTransactionProp) {
  const { showLoading, showError, showSuccess } = useStatus();
  const { data, isPending, isError, error, isSuccess } = useTransactionsById(id);

  const [amount, setAmount] = useInput('');
  const [title, setTitle] = useInput('');
  const [option, setOption] = useInput('');

  const options = useMemo(() => {
    return (
      categoriesData?.categories.map((category, index) => ({
        id: `category-${index + 1}`,
        name: category,
      })) || []
    );
  }, [categoriesData]);

  useEffect(() => {
    if (data?.transaction) {
      setAmount(data.transaction.amount.toString());
      setTitle(data.transaction.title);
    }
  }, [data, setAmount, setTitle]);

  useEffect(() => {
    if (options.length > 0 && !option) {
      setOption(options[0].id);
    }
  }, [options, option, setOption]);

  useStatusHandler({
    pending: isEditing ? isPending : false,
    error: isEditing ? error : null,
    isError: isEditing ? isError : false,
    isSuccess: isEditing ? isSuccess : false,
  });

  const {
    mutate,
    isPending: transactionIsPending,
    isError: transactionIsError,
    isSuccess: transactionIsSuccess,
    error: transactionError,
  } = usePutTransactionsById();

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    showLoading();

    mutate(
      {
        id: id,
        payload: {
          amount: Number(amount),
          category: option,
          title,
          type: 'expense',
          date: new Date().toISOString(),
        },
      },
      {
        onSuccess: () => {
          showSuccess('Transaksi berhasil diperbarui!');
          closeModal();
        },
        onError: (error) => {
          showError(
            error instanceof Error ? error.message : 'Terjadi kesalahan saat memperbarui transaksi.'
          );
        },
      }
    );
  };

  return (
    <AnimatePresence>
      {isEditing && (
        <section className={`fixed inset-0 z-30 flex items-center justify-center`}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 backdrop-blur-sm bg-black/10"
            onClick={closeModal}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`bg-bg-main rounded-xl w-80 md:w-120 relative`}
          >
            <ConfigContainer label="Konfigurasi Akun" icon="ph:gear-six-light">
              <form className="w-full p-5" onSubmit={handleSubmit}>
                <CurrencyInput
                  label="Jumlah (Rp)"
                  onValueChange={setAmount}
                  value={amount}
                  max={10000000000}
                />
                <TextInput label="Judul Catatan" value={title} onChange={setTitle} />
                <SelectionInput
                  value={option}
                  label="Kategori"
                  onChange={setOption}
                  options={options}
                />
                <button
                  type="submit"
                  className="bg-primary font-medium text-bg-main rounded-xl p-2 mt-15 mb-10 w-full"
                >
                  Simpan Perubahan
                </button>
              </form>
            </ConfigContainer>
          </motion.div>
        </section>
      )}
    </AnimatePresence>
  );
}
