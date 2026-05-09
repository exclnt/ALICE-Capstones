import AlertCard from './AlertCard';

export default function HeaderCard() {
  return (
    <header
      className="
  h-fit w-full p-6 rounded-xl
  bg-[url('../../../public/assets/img/background.png')]
  bg-cover bg-center relative flex flex-col gap-5"
    >
      <div className="absolute inset-0 bg-linear-to-r from-green-950/70 to-transparent rounded-xl z-10"></div>
      <div className="z-20 relative">
        <p className="text-text-muted">Selamat Pagi</p>
        <h1 className="text-white text-xl font-bold">Eko Ramadani</h1>
      </div>
      <div className="z-20 relative mb-8">
        <p className="text-text-muted">Anggaran Bulanan</p>
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-white text-xl font-bold">Rp.2.000.000</h1>
          <h2 className="text-red-600 font-bold">Rp 2.000.000</h2>
        </div>
      </div>
      <AlertCard />
    </header>
  );
}
