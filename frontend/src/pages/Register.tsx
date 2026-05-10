import { useEffect } from 'react';
import RegisterInput from '../components/RegisterInput';

export default function Register() {
  useEffect(() => {
    document.body.classList.add('special-page-body');

    return () => {
      document.body.classList.remove('special-page-body');
    };
  }, []);
  return (
    <main className="flex flex-col items-center">
      <h1 className="text-white font-geist text-5xl font-thin mt-35 mb-10">A L I C E</h1>
      <div className="flex items-start justify-start flex-col">
        <h2 className="text-white text-3xl font-bold ml-6 mb-2">DAFTAR</h2>
        <RegisterInput />
      </div>
    </main>
  );
}
