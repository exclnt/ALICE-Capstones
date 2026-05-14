import CurrencyInput from './CurrencyInput.tsx';
import useInput from './hooks/useInput.tsx';
import SelectionInput from './SelectionInput.tsx';
import TextInput from './TextInput.tsx';

interface AddModalProp {
  toggleVisible: () => void;
  isVisible: boolean;
}

export default function AddModal({ toggleVisible, isVisible }: AddModalProp) {
  const [amount, setAmount] = useInput('');
  const [title, setTitle] = useInput('');
  const options = ['Makanan', 'Minuman', 'Orang'];
  const [option, setOption] = useInput(options[0]);

  return (
    <section
      className={`spending-modal fixed inset-0 z-30 flex items-end pb-21 ${isVisible ? 'visible opacity-100' : 'invisible opacity-0'}`}
    >
      <div className="absolute inset-0  backdrop-blur-sm" onClick={toggleVisible}></div>
      <div
        className={`bg-white z-30  pb-20 w-full transition-all duration-500 flex items-center flex-col p-3 rounded-tl-4xl rounded-tr-4xl ring-1 ring-primary/20 ${isVisible ? 'translate-y-0' : 'transalte-y-150 pointer-events-none'}`}
      >
        <header>
          <h2 className="font-bold text-red-400">Pengeluaran</h2>
        </header>
        <form className="w-full p-5">
          <CurrencyInput label="Jumlah (Rp)" onValueChange={setAmount} value={amount} />
          <TextInput label="Judul Catatan" value={title} onChange={setTitle} />
          <SelectionInput value={option} label="Kategori" onChange={setOption} options={options} />
          <button
            type="submit"
            className="bg-primary font-medium text-bg-main rounded-xl p-2 mt-15 mb-10 w-full"
          >
            Masukan Pengeluaran
          </button>
        </form>
      </div>
    </section>
  );
}
