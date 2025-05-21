import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Tag,
  User,
  Settings,
  Menu,
  X,
  // BotIcon
  // Map
  // StickyNote,
  PenTool
} from 'lucide-react';

// import { useAuth } from '../../context/AuthContext';
import  {useUser} from '../../context/UserContext';

interface SidebarProps {
  isOpen: boolean;
  toggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggle }) => {
  const { ser } = useUser();
  const navigationItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/tasks', label: 'Tasks', icon: <CheckSquare size={20} /> },
    { path: '/calendar', label: 'Calendar', icon: <Calendar size={20} /> },
    { path: '/categories', label: 'Categories', icon: <Tag size={20} /> },
    // { path: '/ask-gpt', label: 'Ask GPT', icon: <BotIcon size={20} /> },
    // { path: '/roadmap', label: 'Roadmap', icon: <Map size={20} /> },
    // { path: '/notes', label: 'My Notes', icon: <StickyNote size={20} /> },
    { path: '/sketchpad', label: 'Sketchpad', icon: <PenTool size={20} /> },
    { path: '/profile', label: 'Profile', icon: <User size={20} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  const sidebarClasses = `fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm transform transition-transform duration-300 ease-in-out ${
    isOpen ? 'translate-x-0' : '-translate-x-full'
  } lg:translate-x-0`;

  const overlayClasses = `fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out ${
    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
  } lg:hidden`;

  return (
    <>
      <div className={overlayClasses} onClick={toggle} />

      <aside className={sidebarClasses}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-lg font-bold dark:text-white text-indigo-600">3la Ma Tofrag</h1>
          <button
            className="p-1 text-gray-500 dark:text-gray-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
            onClick={toggle}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col p-4">
          <div className="flex items-center space-x-3 mb-6">
            <img
              src={ser?.profilePhoto}
              alt={ser?.username}
              className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500"
            />
            <div>
              <h2 className="font-medium text-gray-900 dark:text-white">{ser?.username}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{ser?.email}</p>
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
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
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
        className="fixed bottom-4 right-4 p-3 bg-indigo-600 text-white rounded-full shadow-lg lg:hidden z-30 hover:bg-indigo-700 dark:hover:bg-indigo-500"
        onClick={toggle}
      >
        <Menu size={24} />
      </button>
    </>
  );
};

export default Sidebar;