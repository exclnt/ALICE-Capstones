import TextInput from '../TextInput';
import ConfigContainer from './ConfigContainer';
import useInput from '../../hooks/useInput.ts';
import { motion, AnimatePresence } from 'motion/react';

interface EditModalProp {
  currentName: string;
  toggleEditing: () => void;
  isEditing: boolean;
}

export default function ProfileEditModal({ currentName, toggleEditing, isEditing }: EditModalProp) {
  const [name, onNameChange] = useInput(currentName);
  return (
    <AnimatePresence>
      {isEditing && (
        <section className={`fixed inset-0 z-30  flex items-center justify-center`}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 backdrop-blur-sm bg-black/10"
            onClick={toggleEditing}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`bg-bg-main rounded-xl w-80 md:w-120  relative`}
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
          </motion.div>
        </section>
      )}
    </AnimatePresence>
  );
}
