import { Icon } from '@iconify/react';
import { Link, useNavigate } from 'react-router-dom';
import useInput from '../../hooks/useInput.ts';
import TextInput from '../TextInput';
import PasswordInput from './PasswordInput';
import { useStatus } from '../../context/StatusContext.tsx';
import type React from 'react';
import { RegisterUser } from '../../api/auth.ts';
import type { UserRegisterData } from '../../validator/UserRegisterSchema.ts';
import CatchErrorAPI from '../utils/CatchErrorAPI.ts';

export default function RegisterInput() {
  const { showLoading, showSuccess, showError } = useStatus();
  const navigate = useNavigate();
  const [name, onNameChange] = useInput('');
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');
  const [confirmPassword, onConfirmPasswordChange] = useInput('');

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showError('Confirm Password Tidak Sama');
      return;
    }

    const formdata: UserRegisterData = {
      username: name,
      email,
      password,
    };

    showLoading();

    try {
      const result = await RegisterUser(formdata);
      showSuccess(result.message);
      navigate('/');
    } catch (error: unknown) {
      CatchErrorAPI({ error, showError });
    }
  };

  return (
    <>
      <form
        className="pr-6 pl-6 pt-3 pb-3 rounded-2xl bg-bg-main flex flex-col items-center w-full"
        onSubmit={handleSubmit}
      >
        <TextInput label="Nama" value={name} onChange={onNameChange} isRequired={true} />
        <TextInput
          label="Email"
          value={email}
          onChange={onEmailChange}
          type="email"
          isRequired={true}
        />
        <PasswordInput
          label="Password"
          value={password}
          onChange={onPasswordChange}
          isRequired={true}
        />
        <PasswordInput
          label="Confirm Password"
          value={confirmPassword}
          onChange={onConfirmPasswordChange}
          isRequired={true}
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
