import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  Tag, 
  User, 
  Settings, 
  Menu, 
  X 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle }) => {
  // const { user } = useApp();
  const { user } = useAuth();
  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
    { path: '/calendar', label: 'Calendar', icon: <Calendar size={20} /> },
    { path: '/categories', label: 'Categories', icon: <Tag size={20} /> },
    { path: '/profile', label: 'Profile', icon: <User size={20} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const sidebarClasses = `fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 shadow-sm transform transition-transform duration-300 ease-in-out ${
    isOpen ? 'translate-x-0' : '-translate-x-full'
  } lg:translate-x-0`;

  const overlayClasses = `fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out ${
    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
  } lg:hidden`;

  return (
    <>
      <div className={overlayClasses} onClick={toggle} />
      
      <aside className={sidebarClasses}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <h1 className="text-lg font-bold text-indigo-600">3la Ma Tofrag</h1>
          <button
            className="p-1 text-gray-500 rounded-md hover:bg-gray-100 lg:hidden"
            onClick={toggle}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col p-4">
          <div className="flex items-center space-x-3 mb-6">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500"
            />
            <div>
              <h2 className="font-medium">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
                end
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      <button
        className="fixed bottom-4 right-4 p-3 bg-indigo-600 text-white rounded-full shadow-lg lg:hidden z-30"
        onClick={toggle}
      >
        <Menu size={24} />
      </button>
    </>
  );
};

export default Sidebar;