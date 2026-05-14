import TextInput from '../TextInput';
import ConfigContainer from './ConfigContainer';
import useInput from '../hooks/useInput';

interface EditModalProp {
  currentName: string;
  toggleEditing: () => void;
  isEditing: boolean;
}

export default function ProfileEditModal({ currentName, toggleEditing, isEditing }: EditModalProp) {
  const [name, onNameChange] = useInput(currentName);
  return (
    <section
      className={`fixed inset-0 z-100  flex items-center justify-center ${isEditing ? 'visible opacity-100' : 'invisible opacity-0'} `}
    >
      <div className="absolute inset-0  backdrop-blur-sm" onClick={toggleEditing}></div>
      <div
        className={`bg-bg-main rounded-xl w-80 md:w-120   relative transition-all duration-500  ${!isEditing ? 'scale-50 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
      >
        <ConfigContainer label="Konfigurasi Akun" icon="ph:gear-six-light">
          <div className="flex items-center justify-center">
            <img src="/assets/img/TET.gif" className="w-25 object-cover " />
          </div>
          <form>
            <TextInput label="Nama" value={name} onChange={onNameChange} />
            <div className="flex mt-5 justify-end gap-2">
              <button
                type="button"
                className="bg-red-600  text-bg-main w-25 p-1 font-medium rounded-xl "
                onClick={toggleEditing}
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-primary   font-medium w-25 p-1 text-bg-main rounded-xl "
              >
                Simpan
              </button>
            </div>
          </form>
        </ConfigContainer>
      </div>
    </section>
  );
}
