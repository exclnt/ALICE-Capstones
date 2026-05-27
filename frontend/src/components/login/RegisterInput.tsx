import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import type { CredentialResponse } from '@react-oauth/google';

import useInput from '../../hooks/useInput.ts';
import TextInput from '../TextInput';
import PasswordInput from './PasswordInput';
import { useStatus } from '../../context/StatusContext.tsx';
import type React from 'react';
import { RegisterUser, RegisterWithGoogle } from '../../api/auth.ts';
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

    const formdata: UserRegisterData = { username: name, email, password };
    showLoading();

    try {
      const result = await RegisterUser(formdata);
      showSuccess(result.message);
      navigate('/');
    } catch (error: unknown) {
      CatchErrorAPI({ error, showError });
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    showLoading();
    try {
      if (credentialResponse.credential) {
        const result = await RegisterWithGoogle(credentialResponse.credential);
        showSuccess(result.message);
        navigate('/');
      } else {
        showError('No credential received from Google');
      }
    } catch (error: unknown) {
      CatchErrorAPI({ error, showError });
    }
  };

  return (
    <>
      <form
        className="pr-6 pl-6 pt-3 pb-5 rounded-2xl bg-bg-main flex flex-col items-center w-full mb-10"
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
          autoComplete="new-password"
        />
        <PasswordInput
          label="Confirm Password"
          value={confirmPassword}
          onChange={onConfirmPasswordChange}
          isRequired={true}
          autoComplete="new-password"
        />

        <button
          type="submit"
          className="bg-primary font-bold text-bg-main rounded-xl p-2 mt-10 w-full"
        >
          DAFTAR
        </button>

        <p className="text-text-muted mt-5 mb-5">Atau</p>

        {/* 3. Render the official Google Login component */}
        <div className="w-full flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => showError('Google Register Failed')}
            useOneTap={false}
          />
        </div>

        <Link to={'/'} className="text-text-muted mt-5">
          Sudah punya akun? <span className="text-primary">Masuk</span>
        </Link>
      </form>
    </>
  );
}
