import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

export default function WelcomeModal() {
  const [isVisible, setIsVisible] = useState(() => {
    return localStorage.getItem('hasSeenWelcomeModal') === null;
  });

  const handleChoice = (choice: string) => {
    localStorage.setItem('hasSeenWelcomeModal', 'true');
    setIsVisible(false);
    if (choice === 'yes') {
      console.log('Starting tutorial...');
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <section className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 backdrop-blur-sm bg-black/30"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="bg-bg-main rounded-3xl w-full max-w-md p-8 relative shadow-2xl text-center"
          >
            <h2 className="text-2xl font-bold text-primary mb-3">Selamat Datang di ALICE!</h2>
            <p className="text-gray-600 mb-8">
              Ingin melihat cara kerja aplikasi ini agar lebih mudah mengelola keuanganmu?
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button
                type="button"
                className="px-6 py-2 font-medium rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
                onClick={() => handleChoice('no')}
              >
                Tidak, terima kasih
              </button>
              <button
                type="button"
                className="px-6 py-2 bg-primary text-bg-main font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-md"
                onClick={() => handleChoice('yes')}
              >
                Ya, mulai tutorial
              </button>
            </div>
          </motion.div>
        </section>
      )}
    </AnimatePresence>
  );
}
