import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useState } from 'react';

export default function NavBar() {
  const [activeId, setActiveId] = useState('home');

  return (
    <nav className="flex w-full fixed bottom-0 ring-1 ring-accent-accent pt-3 pb-3 md:static md:max-w-20  md:h-full bg-bg-main md:ring-0 md:rounded-xl md:pt-5">
      <ul className="flex flex-row justify-evenly w-full md:flex-col md:h-full">
        <li>
          <Link to={'/'}>
            <LinkContainer
              id="home"
              icon={
                activeId === 'home'
                  ? 'material-symbols:home-rounded'
                  : 'material-symbols:home-outline-rounded'
              }
              label="Beranda"
              isActive={activeId === 'home'}
              onClick={() => setActiveId('home')}
            />
          </Link>
        </li>
        <li>
          <Link to={'/analitik'}>
            <LinkContainer
              id="analitik"
              icon={
                activeId === 'analitik'
                  ? 'material-symbols:analytics-rounded'
                  : 'material-symbols:analytics-outline-rounded'
              }
              label="Analitik"
              isActive={activeId === 'analitik'}
              onClick={() => setActiveId('analitik')}
            />
          </Link>
        </li>
        <li>
          <Link to={'/'}>
            <Icon
              icon="material-symbols:add-circle-outline-rounded"
              className="relative -top-10 bg-primary text-5xl p-2 w-15 h-15 rounded-4xl text-bg-main md:hidden "
            />
          </Link>
        </li>
        <li>
          <Link to={'/alice'}>
            <LinkContainer
              id="alice"
              icon={
                activeId === 'alice'
                  ? 'material-symbols:energy-savings-leaf-rounded'
                  : 'material-symbols:energy-savings-leaf-outline-rounded'
              }
              label="A.L.I.C.E"
              isActive={activeId === 'alice'}
              onClick={() => setActiveId('alice')}
            />
          </Link>
        </li>
        <li className="flex justify-center items-center cursor-pointer">
          <Link to={'/'}>
            <Icon
              icon="mingcute:add-fill"
              className="bg-primary p-1 rounded-md text-4xl text-bg-main hidden md:flex "
            />
          </Link>
        </li>
        <li className="md:mt-auto">
          <Link to={'/profile'}>
            <LinkContainer
              id="profile"
              icon="material-symbols:person-2-rounded"
              label="Profile"
              isActive={activeId === 'profile'}
              onClick={() => setActiveId('profile')}
            />
          </Link>
        </li>
      </ul>
    </nav>
  );
}

interface LinkContainerProps {
  id: string;
  icon: string;
  label?: string;
  isActive: boolean;
  onClick: () => void;
}

function LinkContainer({ icon, label, isActive, onClick }: LinkContainerProps) {
  return (
    <div
      className={`flex  flex-col justify-center items-center cursor-pointer transition-all ${
        isActive ? 'text-primary' : 'text-text-muted'
      }`}
      onClick={onClick}
    >
      <Icon icon={icon} className="text-3xl md:text-4xl md:mb-3" />
      <p className="text-base md:hidden ">{label}</p>
    </div>
  );
}
