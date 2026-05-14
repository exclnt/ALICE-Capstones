import BudgetConfig from '../components/profile/BudgetConfig';
import ThemeConfig from '../components/profile/ThemeConfig';
import ProfileCard from '../components/profile/ProfileCard';
import EditModal from '../components/profile/ProfileEditModal';
import { useState } from 'react';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEditing = () => {
    setIsEditing((prevState) => !prevState);
  };
  const name = 'Eko Ramadani';
  return (
    <div className="flex flex-col w-full gap-7 flex-1 mb-5 md:pb-0">
      <EditModal currentName={name} toggleEditing={toggleEditing} isEditing={isEditing} />
      <ProfileCard name={name} toggleEditing={toggleEditing} />
      <section className="config text-text-main flex flex-col lg:flex-row md:justify-between gap-7">
        <BudgetConfig />
        <ThemeConfig />
      </section>
      <div className="actions w-full flex">
        <button className="bg-red-500 text-white w-full rounded-xl p-3 font-bold">Keluar</button>
      </div>
    </div>
  );
}
