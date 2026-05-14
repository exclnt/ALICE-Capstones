import { Icon } from '@iconify/react';

interface ProfileCardProp {
  name: string;
  toggleEditing: () => void;
}

export default function ProfileCard({ name, toggleEditing }: ProfileCardProp) {
  return (
    <section className="user-card text-bg-main flex items-center justify-between w-full bg-primary p-4 py-5 rounded-2xl">
      <div className="flex items-center gap-2">
        <Icon icon={'gg:profile'} className="text-5xl" />
        <div>
          <h2 className="font-bold text-xl">{name}</h2>
          <p className="text-xs bg-secondary text-text-muted p-1 pl-3 pr-3 rounded-xl max-w-fit">
            UID : 24124240
          </p>
        </div>
      </div>
      <Icon
        icon={'material-symbols:edit-square-outline'}
        onClick={toggleEditing}
        className="text-2xl"
      />
    </section>
  );
}
