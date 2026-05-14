import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import useInput from '../hooks/useInput';
import TextInput from '../TextInput';
import PasswordInput from './PasswordInput';

export default function RegisterInput() {
  const [name, onNameChange] = useInput('');
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const [confirmPassword, onConfirmPasswordChange] = useInput('');
  return (
    <>
      <form
        className="pr-6 pl-6 pt-3 pb-3 rounded-2xl bg-bg-main flex flex-col items-center w-full"
        onSubmit={() => {
          alert(`${name}+${email}+${password}+${confirmPassword}`);
        }}
      >
        <TextInput label="Nama" value={name} onChange={onNameChange} />
        <TextInput label="Email" value={email} onChange={onEmailChange} type="email" />
        <PasswordInput label="Password" value={password} onChange={onPasswordChange} />
        <PasswordInput
          label="Confirm Password"
          value={confirmPassword}
          onChange={onConfirmPasswordChange}
        />

        <button
          type="submit"
          className="bg-primary font-bold text-bg-main rounded-xl p-2 mt-10 w-full"
        >
          DAFTAR
        </button>
        <p className="text-text-muted mt-5">Atau</p>
        <div className="flex items-center justify-center dark:bg-white bg-black text-bg-main rounded-xl p-2 mt-5 w-full">
          <Icon icon="mynaui:google-solid" className="text-2xl" />
        </div>
        <Link to={'/'} className="text-text-muted mt-5">
          Sudah punya akun? <span className="text-primary">Masuk</span>
        </Link>
      </form>
    </>
  );
}
