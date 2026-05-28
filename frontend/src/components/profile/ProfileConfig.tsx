import useInput from '../../hooks/useInput';
import { useStatusHandler } from '../../hooks/useStatusHandler';
import { useUpdateUserProfile } from '../../hooks/useUserProfileHooks';
import TextInput from '../TextInput';
import ConfigContainer from './ConfigContainer';

interface ProfileConfigProps {
  currentName: string;
  currentAge?: number | null;
  currentOccupation?: string | null;
}

export default function ProfileConfig({
  currentName,
  currentAge,
  currentOccupation,
}: ProfileConfigProps) {
  const [name, onNameChange] = useInput(currentName);
  const [age, onAgeChange] = useInput(String(currentAge ?? ''));
  const [occupation, onOccupationChange] = useInput(currentOccupation ?? '');
  const { isPending, error, mutate, isSuccess, isError } = useUpdateUserProfile();

  const handleSubmit = () => {
    mutate({ username: name, age: Number(age) || null, occupation: occupation || null });
  };

  useStatusHandler({
    pending: isPending,
    isError,
    isSuccess,
    successMessage: 'Profil berhasil diperbarui',
    error,
  });
  return (
    <ConfigContainer label="KONFIGRUASI PROFIL" icon="ph:gear-six-light">
      <div className="flex flex-col gap-2 p-2">
        <TextInput label="Nama" value={name} onChange={onNameChange} />
        <TextInput label="Usia" value={age} onChange={onAgeChange} />
        <TextInput label="Pekerjaan" value={occupation} onChange={onOccupationChange} />
        <button
          onClick={handleSubmit}
          className="bg-primary font-bold text-bg-main rounded-xl p-2 mt-10 w-full"
        >
          Simpan Konfigurasi
        </button>
      </div>
    </ConfigContainer>
  );
}
