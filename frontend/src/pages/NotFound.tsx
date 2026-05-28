import { Icon } from '@iconify/react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import PageTitle from '../components/PageTitle';

export default function NotFound() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(-1);
  };

  return (
    <main className="absolute inset-0 bg-bg-main flex items-center justify-center flex-col">
      <PageTitle title="404 Not Found" />
      <h1 className="font-mplus font-bold text-xl md:text-4xl mb-5">
        -- Halaman Tidak Ditemukan --
      </h1>
      <button onClick={handleClick}>
        <div className="flex flex-row items-center text-xl gap-1 font-mplus font-bold text-primary">
          <motion.div
            animate={{ x: -8 }}
            transition={{
              repeat: Infinity,
              repeatType: 'mirror',
              duration: 0.5,
              ease: 'easeInOut',
            }}
          >
            <Icon icon={'material-symbols:arrow-back-rounded'} />
          </motion.div>

          <h2>Kembali</h2>
        </div>
      </button>
    </main>
  );
}
