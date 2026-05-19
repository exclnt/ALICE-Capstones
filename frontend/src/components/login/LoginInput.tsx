import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';

import PasswordInput from './PasswordInput';
import useInput from '../hooks/useInput.ts';
import TextInput from '../TextInput';

export default function LoginInput() {
  const [name, onNameChange] = useInput('');
  const [password, onPasswordChange] = useInput('');

  return (
    <form className=" w-full pr-6 pl-6 pt-3 pb-3 rounded-2xl bg-bg-main flex flex-col items-center">
      <TextInput label="Nama" value={name} onChange={onNameChange} />
      <PasswordInput label="Password" value={password} onChange={onPasswordChange} />

      <button
        type="submit"
        className="bg-primary font-bold text-bg-main rounded-xl p-2 mt-10 w-full"
      >
        MASUK
      </button>

      <p className="text-text-muted mt-5">Atau</p>
      <div className="flex items-center justify-center dark:bg-white bg-black text-bg-main rounded-xl p-2 mt-5 w-full">
        <Icon icon="mynaui:google-solid" className="text-2xl" />
      </div>
      <Link to="/register" className="text-text-muted mt-5">
        Tidak punya akun? <span className="text-primary">Daftar</span>
      </Link>
    </form>
  );
}
