import { Icon } from '@iconify/react';
import FormInput from './FormInput';
import { Link } from 'react-router-dom';

export default function RegisterInput() {
  return (
    <>
      <form className=" w-94 h-137 pr-6 pl-6 pt-2 rounded-2xl bg-bg-main flex flex-col items-center">
        <FormInput type={'text'} label={'Nama'} />
        <FormInput type={'email'} label={'Email'} />
        <FormInput type={'password'} label={'Password'} isPassword={true} />
        <FormInput type={'password'} label={'Confirm Password'} isPassword={true} />
        <input
          type="submit"
          value="DAFTAR"
          className="bg-primary font-bold text-bg-main rounded-xl p-2 mt-10 w-full"
        />
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
