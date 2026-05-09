import { Icon } from '@iconify/react';

export default function AlertCard() {
  return (
    <section className="alert-anggaran z-20 p-5 absolute top-35 left-0">
      <div className="bg-bg-main p-5 rounded-2xl shadow-2xl flex flex-col gap-3">
        <h3 className="font-bold text-text-main">Anggaran Mingguan</h3>
        <div className="flex flex-row justify-between text-sm">
          <h2 className="text-text-muted">Rp 1.320.000 / Rp 1.500.000</h2>
          <h2 className="font-bold text-red-600">88.0%</h2>
        </div>
        <ProgressBar />
        <div className="flex flex-row items-center gap-3 bg-red-400/20 py-1 px-2 rounded-xl">
          <div>
            <Icon
              icon={'material-symbols:warning-outline-rounded'}
              className="text-3xl text-red-600"
            />
          </div>

          <p className="text-red-600 text-sm">
            Awas! Pengeluaranmu hampir melebihi batas. Tunda dulu pengluaran yang tidak penting.
          </p>
        </div>
      </div>
    </section>
  );
}

const ProgressBar = ({ progress = 88 }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
      <div
        className="bg-red-600 h-3 rounded-full transition-all duration-500"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};
