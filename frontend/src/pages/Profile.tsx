import BudgetConfig from '../components/profile/BudgetConfig';
import ThemeConfig from '../components/profile/ThemeConfig';
import ProfileCard from '../components/profile/ProfileCard';
import EditModal from '../components/profile/ProfileEditModal';
import { useState } from 'react';
import { LogoutUser } from '../api/auth';
import { useStatus } from '../context/StatusContext';
import { useNavigate } from 'react-router-dom';
import CatchErrorAPI from '../components/utils/CatchErrorAPI';

interface ProfileProp {
  setAuthedUser: (accessToken: null) => void;
}

export default function Profile({ setAuthedUser }: ProfileProp) {
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { showLoading, showSuccess, showError } = useStatus();
  const toggleEditing = () => {
    setIsEditing((prevState) => !prevState);
  };

  const handleLogout = async () => {
    showLoading();
    try {
      const result = await LogoutUser();
      showSuccess(result.data.message);
      setAuthedUser(null);
      navigate('/');
    } catch (error) {
      CatchErrorAPI({ error, showError });
    }
  };
  const name = 'Eko Ramadani';
  return (
    <div className="flex flex-col w-full gap-7 flex-1  md:pb-0 p-5">
      <EditModal currentName={name} toggleEditing={toggleEditing} isEditing={isEditing} />
      <ProfileCard name={name} toggleEditing={toggleEditing} />
      <section className="config text-text-main flex flex-col lg:flex-row md:justify-between gap-7">
        <BudgetConfig />
        <ThemeConfig />
      </section>
      <div className="actions w-full flex">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white w-full rounded-xl p-3 font-bold"
        >
          Keluar
        </button>
      </div>
    </div>
  );
}
