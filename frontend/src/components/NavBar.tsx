import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';

export default function NavBar() {
  return (
    <nav>
      <ul className="flex flex-row">
        <li>
          <Link to={'/'}>
            <Icon icon="mdi:home" />
          </Link>
        </li>
        <li>
          <Link to={'/analitik'}>Analitik</Link>
        </li>
        <li>
          <Link to={'/'}>+</Link>
        </li>
        <li>
          <Link to={'/alice'}>ALICE</Link>
        </li>
        <li>
          <Link to={'/profile'}>Profile</Link>
        </li>
      </ul>
    </nav>
  );
}

function LinkContainer({ icon, label }) {
  <div>
    <Icon />
  </div>;
}
