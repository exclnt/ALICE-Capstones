import BudgetConfig from '../components/profile/BudgetConfig';
import ThemeConfig from '../components/profile/ThemeConfig';
import ProfileCard from '../components/profile/ProfileCard';

import { LogoutUser } from '../api/auth';
import { useStatus } from '../context/StatusContext';
import { useNavigate } from 'react-router-dom';
import CatchErrorAPI from '../components/utils/CatchErrorAPI';
import { useUserProfile } from '../hooks/useUserProfileHooks';
import { useStatusHandler } from '../hooks/useStatusHandler';
import PageTitle from '../components/PageTitle';
import ProfileConfig from '../components/profile/ProfileConfig';

interface ProfileProp {
  setAuthedUser: (accessToken: null) => void;
}

export default function Profile({ setAuthedUser }: ProfileProp) {
  const navigate = useNavigate();

  const { showLoading, showError, showSuccess } = useStatus();

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

  useStatusHandler({
    pending: isPending,
    error,
    isError,
  });

  if (!data) return null;

  const user = data.data;

  return (
    <div className="flex flex-col w-full gap-7 flex-1 md:pb-5 p-5">
      <PageTitle title="Profil" />

      <ProfileCard UID={user.id} name={user.username} />

      <section className="config text-text-main grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ProfileConfig
          currentName={user.username}
          currentAge={user.age}
          currentOccupation={user.occupation}
        />
        <BudgetConfig />
      </section>
      <ThemeConfig />

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
