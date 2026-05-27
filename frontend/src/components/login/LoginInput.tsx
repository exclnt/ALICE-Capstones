import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';

import PasswordInput from './PasswordInput';
import useInput from '../../hooks/useInput.ts';
import TextInput from '../TextInput';
import { LoginUser, LoginWithGoogle } from '../../api/auth.ts';
import { useStatus } from '../../context/StatusContext.tsx';
import CatchErrorAPI from '../utils/CatchErrorAPI.ts';
import type { UserLoginData } from '../../validator/UserLoginSchema.ts';

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
    const formData: UserLoginData = { email, password };
    showLoading();

    try {
      const result = await LoginUser(formData);
      showSuccess(result.message);
      setAuthedUser(result.accessToken);
      navigate('/');
    } catch (error: unknown) {
      CatchErrorAPI({ error, showError });
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    showLoading();
    try {
      if (credentialResponse.credential) {
        const result = await LoginWithGoogle(credentialResponse.credential);
        showSuccess(result.message);
        setAuthedUser(result.accessToken);
        navigate('/');
      } else {
        showError('No credential received from Google');
      }
    } catch (error: unknown) {
      CatchErrorAPI({ error, showError });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className=" w-full pr-6 pl-6 pt-3 pb-5 rounded-2xl bg-bg-main flex flex-col items-center mb-10"
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
        autoComplete="current-password"
      />

      <button
        type="submit"
        className="bg-primary font-bold text-bg-main rounded-xl p-2 mt-10 w-full"
      >
        MASUK
      </button>

      <p className="text-text-muted mt-5 mb-5">Atau</p>

      <div className="w-full flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => showError('Google Login Failed')}
          useOneTap={false}
        />
      </div>

      <Link to="/register" className="text-text-muted mt-5">
        Tidak punya akun? <span className="text-primary">Daftar</span>
      </Link>
    </form>
  );
}
