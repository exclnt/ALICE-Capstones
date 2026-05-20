import { Icon } from '@iconify/react';
import { Link, useNavigate } from 'react-router-dom';

import PasswordInput from './PasswordInput';
import useInput from '../hooks/useInput.ts';
import TextInput from '../TextInput';
import { LoginUser, type UserLoginData } from '../../api/auth.ts';
import { useStatus } from '../../context/StatusContext.tsx';
import CatchErrorAPI from '../utils/CatchErrorAPI.ts';

interface LoginInputProp {
  setAuthedUser: (accessToken: string) => void;
}

export default function LoginInput({ setAuthedUser }: LoginInputProp) {
  const { showLoading, showSuccess, showError } = useStatus();
  const navigate = useNavigate();
  const [email, onEmailChange] = useInput('');
  const [password, onPasswordChange] = useInput('');

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData: UserLoginData = {
      email,
      password,
    };

    showLoading();

    try {
      const result = await LoginUser(formData);
      showSuccess(result.data.message);
      setAuthedUser(result.data.data.accessToken);
      navigate('/');
    } catch (error: unknown) {
      CatchErrorAPI({ error, showError });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className=" w-full pr-6 pl-6 pt-3 pb-3 rounded-2xl bg-bg-main flex flex-col items-center"
    >
      <TextInput
        label="Email"
        type="email"
        value={email}
        onChange={onEmailChange}
        isRequired={true}
      />
      <PasswordInput
        label="Password"
        value={password}
        onChange={onPasswordChange}
        isRequired={true}
      />

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
