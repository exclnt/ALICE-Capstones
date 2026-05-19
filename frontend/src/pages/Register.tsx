import { useEffect } from 'react';
import RegisterInput from '../components/login/RegisterInput';

export default function Register() {
  useEffect(() => {
    document.body.classList.add('special-page-body');

    return () => {
      document.body.classList.remove('special-page-body');
    };
  }, []);
  return (
    <main className="flex flex-col items-center ">
      <div className="flex md:items-center md:justify-end md:w-full md:mr-50 md:h-50 ">
        <h1 className="text-white font-geist text-5xl font-thin mt-35 mb-15 md:mb-35">A L I C E</h1>
      </div>
      <div className="flex items-start w-full px-7 justify-start flex-col md:max-w-110">
        <h2 className="text-white text-3xl font-bold ml-6 mb-2">DAFTAR</h2>
        <RegisterInput />
      </div>
    </main>
  );
}
