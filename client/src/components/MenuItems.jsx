import React from 'react'
import { menuItemsData } from '../assets/assets'
import { Navigate, NavLink } from 'react-router'

const MenuItems = () => {
  return (
    <div className='px-6 text-gray-600 space-y-1 font-medium'>
      {
        menuItemsData.map(({to,label,Icon})=>(
            <NavLink key={to} to={to} end={to==='/'} className={({isActive})=>`px-3.5 py-2 flex
             items-center gap-3 rounded-xl ${isActive ? 'bg-purple-50 text-purple-700':'bg-gray-50'}`}>

        <Icon classNamew='w-5 h-5'/>
        {label}

             </NavLink>
        ))
      }
    </div>
  )
}

export default MenuItems
