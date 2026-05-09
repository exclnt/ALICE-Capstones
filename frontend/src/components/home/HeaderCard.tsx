export default function HeaderCard() {
  return (
    <header
      className="
        h-fit w-full p-6 rounded-xl
        bg-[url('/assets/img/background.png')]
        bg-cover bg-center relative flex flex-col gap-5 shadow-md"
    >
      <div className="absolute inset-0 bg-linear-to-r from-green-950/70 to-transparent rounded-xl z-10"></div>

      <div className="z-20 relative">
        <p className="text-text-muted text-sm">Selamat Pagi</p>
        <h1 className="text-white text-xl font-bold">Eko Ramadani</h1>
      </div>

      <div className="z-20 relative">
        <p className="text-text-muted text-sm">Anggaran Bulanan</p>
        <div className="flex flex-row items-baseline justify-between">
          <h1 className="text-white text-2xl font-bold">Rp 2.000.000</h1>
          <span className="text-red-400 text-base font-medium">Rp 2.000.000</span>
        </div>
      </div>
    </header>
  );
}
