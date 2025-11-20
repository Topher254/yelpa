import React from 'react';
import { menuItemsData } from '../assets/assets';
import { NavLink } from 'react-router';

const MenuItems = ({ onItemClick }) => {
  return (
    <div className="px-6 text-gray-600 space-y-1 font-medium">
      {menuItemsData.map(({ to, label, Icon, danger, ping }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          onClick={onItemClick}   
          className={({ isActive }) =>
            `relative px-3.5 py-2 flex items-center gap-3 rounded-xl 
            ${isActive ? 'bg-purple-50 text-purple-700' : 'bg-gray-50'} 
            ${danger ? 'text-red-600 font-bold' : ''}`
          }
        >
          <Icon
            className={`w-5 h-5 ${danger ? 'text-red-500' : ''} ${
              ping ? 'animate-pulse inline-block' : ''
            }`}
          />
          {label}
        </NavLink>
      ))}
    </div>
  );
};

export default MenuItems;
