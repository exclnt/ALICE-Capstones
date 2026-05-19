import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'motion/react';
interface RiskConfirmationProp {
  isRisky: boolean;
  toggleRiskyModal: () => void;
  confirmSubmit: () => void;
}

export default function RiskConfirmation({
  isRisky,
  toggleRiskyModal,
  confirmSubmit,
}: RiskConfirmationProp) {
  return (
    <AnimatePresence>
      {isRisky && (
        <section className="risky-confirmation  fixed inset-0 z-100 flex  items-center justify-center px-3">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="z-50 absolute inset-0 backdrop-blur-sm bg-black/10"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-bg-main z-50  pb-0 rounded-2xl w-full md:max-w-150 flex items-center flex-col  ring-1 ring-red-400/20"
          >
            <div className="bg-red-400/30 w-full gap-3 flex h-full items-center justify-center flex-col rounded-tl-2xl rounded-tr-2xl p-5">
              <div className="bg-red-400/20 p-2 rounded-4xl">
                <Icon
                  icon={'material-symbols:brightness-alert-rounded'}
                  className="text-red-400 text-4xl"
                />
              </div>
              <h2 className="font-bold text-red-400">Transaksi Berisiko!</h2>
            </div>
            <div className="p-5 flex flex-col gap-6">
              <div className="bg-bg-main p-4 rounded-2xl ring-1 ring-red-400/40 text-sm text-text-main md:text-base">
                <p>
                  ⚠️ Hati-hati! Transaksi Shopping sebesar Rp500,000 pada hari Sabtu jam 21:00
                  terdeteksi berisiko (HIGH). Pertimbangkan untuk menunda pengeluaran ini.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={toggleRiskyModal}
                  className="bg-gray-500 font-bold text-bg-main rounded-xl p-2  w-full"
                >
                  Batal Transaksi
                </button>
                <button
                  onClick={() => {
                    toggleRiskyModal();
                    confirmSubmit();
                  }}
                  className="bg-red-400/20 font-bold text-red-400 ring-1 ring-red-400 rounded-xl p-2 w-full"
                >
                  Tetap Lanjut
                </button>
              </div>
            </div>
          </motion.div>
        </section>
      )}
    </AnimatePresence>
  );
}
