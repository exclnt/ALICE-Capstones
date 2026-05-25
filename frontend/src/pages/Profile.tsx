import BudgetConfig from '../components/profile/BudgetConfig';
import ThemeConfig from '../components/profile/ThemeConfig';
import ProfileCard from '../components/profile/ProfileCard';
import EditModal from '../components/profile/ProfileEditModal';
import { useState, useEffect } from 'react';
import { LogoutUser } from '../api/auth';
import { useStatus } from '../context/StatusContext';
import { useNavigate } from 'react-router-dom';
import CatchErrorAPI from '../components/utils/CatchErrorAPI';
import { useUserProfile } from '../hooks/UserProfileHooks';
import { extractError } from '../components/utils/ExtractApiError';

interface ProfileProp {
  setAuthedUser: (accessToken: null) => void;
}

export default function Profile({ setAuthedUser }: ProfileProp) {
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  const { showLoading, showError, showSuccess } = useStatus();

  const toggleEditing = () => {
    setIsEditing((prevState) => !prevState);
  };

  const handleLogout = async () => {
    showLoading();

    try {
      const result = await LogoutUser();

      showSuccess(result.message);

      setAuthedUser(null);

      navigate('/');
    } catch (error) {
      CatchErrorAPI({
        error,
        showError,
      });
    }
  };

  const { data, isPending, isError, error } = useUserProfile();

  useEffect(() => {
    if (isPending) {
      showLoading();
    }
  }, [isPending, showLoading]);

  useEffect(() => {
    if (isError) {
      const extracted = extractError(error);

      showError(extracted.message, extracted.statusCode);
    }
  }, [isError, error, showError]);

  if (!data) return null;

  const user = data.data;

  return (
    <div className="flex flex-col w-full gap-7 flex-1 md:pb-0 p-5">
      <EditModal currentName={user.username} toggleEditing={toggleEditing} isEditing={isEditing} />

      <ProfileCard UID={user.id} name={user.username} toggleEditing={toggleEditing} />

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
