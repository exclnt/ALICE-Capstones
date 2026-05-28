import { AnimatePresence, motion } from 'framer-motion';
import TextInput from '../TextInput';
import useInput from '../../hooks/useInput.ts';
import { useStatusHandler } from '../../hooks/useStatusHandler.ts';
import { useTransactionsById } from '../../hooks/useTransactionHook.ts';
import CurrencyInput from '../CurrencyInput.tsx';
import SelectionInput from '../SelectionInput.tsx';
import { useEffect, useMemo, useState } from 'react';
import type { Categories } from '../../validator/CategoriesSchema.ts';
import { usePutTransactionsById } from '../../hooks/useTransactionHook.ts';
import { useStatus } from '../../context/StatusContext.tsx';
import { useDeleteTransactionsById } from '../../hooks/useTransactionHook.ts';

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
  const [isDeleting, setIsDeleting] = useState(false);

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

  const { mutate } = usePutTransactionsById();
  const { mutate: deleteMutate } = useDeleteTransactionsById();

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
          handleClose();
        },
        onError: (error) => {
          showError(
            error instanceof Error ? error.message : 'Terjadi kesalahan saat memperbarui transaksi.'
          );
        },
      }
    );
  };

  const handleConfirmDelete = () => {
    deleteMutate(id, {
      onSuccess: () => {
        showSuccess('Transaksi berhasil dihapus!');
        handleClose();
      },
      onError: (error) => {
        showError(
          error instanceof Error ? error.message : 'Terjadi kesalahan saat menghapus transaksi.'
        );
      },
    });
  };

  const handleClose = () => {
    setIsDeleting(false);
    closeModal();
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
            onClick={handleClose}
          />

          <AnimatePresence mode="wait">
            {!isDeleting ? (
              <motion.div
                key="edit-form"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={`bg-bg-main rounded-xl w-80 md:w-120 relative ring-1 ring-primary/25`}
              >
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
                  <div className="flex flex-col md:flex-row  mt-5  gap-3 w-full">
                    <button
                      type="button"
                      onClick={() => setIsDeleting(true)}
                      className="bg-red-500 font-medium text-bg-main rounded-xl h-full p-2  w-full cursor-pointer hover:bg-red-600 transition-colors"
                    >
                      Hapus Transaksi
                    </button>
                    <button
                      type="submit"
                      className="bg-primary font-medium text-bg-main rounded-xl h-full  p-2  w-full cursor-pointer hover:opacity-90 transition-opacity"
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="delete-confirm"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={`bg-bg-main rounded-xl w-80 md:w-120 relative ring-1 ring-red-500 p-6 flex flex-col items-center text-center`}
              >
                <h3 className="text-xl font-bold mb-2">Hapus Transaksi?</h3>
                <p className="mb-6 text-sm opacity-80">
                  Apakah Anda yakin ingin menghapus transaksi ini? Tindakan ini tidak dapat
                  dibatalkan.
                </p>
                <div className="flex flex-col md:flex-row   gap-3 w-full">
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    className="bg-red-500 font-medium text-bg-main h-full rounded-xl p-2 w-full mb-3 cursor-pointer hover:bg-red-600 transition-colors"
                  >
                    Ya, Hapus
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDeleting(false)}
                    className="bg-gray-200 text-black font-medium rounded-xl p-2 w-full h-full cursor-pointer hover:bg-gray-300 transition-colors"
                  >
                    Batal
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}
    </AnimatePresence>
  );
}
