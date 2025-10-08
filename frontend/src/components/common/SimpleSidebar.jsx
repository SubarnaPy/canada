import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  MoonIcon,
  SunIcon
} from '@heroicons/react/24/outline';
import { DarkModeContext } from '../../app/DarkModeContext';

const SimpleSidebar = ({
  title,
  items,
  activeSection,
  onSectionChange,
  isOpen,
  onToggle,
  userInfo,
  className = ""
}) => {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);

  // Flatten nested items into a simple list
  const flattenItems = (items) => {
    const flattened = [];
    
    items.forEach(item => {
      if (item.children && item.children.length > 0) {
        // Add children directly to the main list
        item.children.forEach(child => {
          flattened.push({
            ...child,
            parentLabel: item.label // Keep track of parent for search context
          });
        });
      } else {
        flattened.push(item);
      }
    });
    
    return flattened;
  };

  // Filter items based on search query
  useEffect(() => {
    const allItems = flattenItems(items);
    
    if (!searchQuery.trim()) {
      setFilteredItems(allItems);
      return;
    }

    const filtered = allItems.filter(item => {
      const searchLower = searchQuery.toLowerCase();
      return (
        item.label.toLowerCase().includes(searchLower) ||
        (item.description && item.description.toLowerCase().includes(searchLower)) ||
        (item.parentLabel && item.parentLabel.toLowerCase().includes(searchLower))
      );
    });

    setFilteredItems(filtered);
  }, [searchQuery, items]);

  const handleItemClick = (item) => {
    if (item.route) {
      navigate(item.route);
    } else if (onSectionChange) {
      onSectionChange(item.key);
    }
    
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768 && onToggle) {
      onToggle();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth');
  };

  if (!isOpen && window.innerWidth < 1024) return null; // Only hide on mobile when closed

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onToggle}
      />

      {/* Sidebar */}
      <div
        className={`
          fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
          transform transition-transform duration-300 ease-in-out z-50 flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          ${className}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors lg:hidden"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-2 min-h-0">
          <div className="space-y-1">
            {filteredItems.map((item) => (
              <button
                key={item.key}
                onClick={() => handleItemClick(item)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200
                  ${
                    activeSection === item.key
                      ? 'bg-blue-500 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }
                `}
              >
                {item.icon && (
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${
                    activeSection === item.key ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                  }`} />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span className={`
                        px-2 py-0.5 text-xs rounded-full font-medium ml-2
                        ${
                          activeSection === item.key
                            ? 'bg-white bg-opacity-20 text-white'
                            : 'bg-red-500 text-white'
                        }
                      `}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <p className={`text-xs mt-0.5 truncate ${
                      activeSection === item.key ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {item.description}
                    </p>
                  )}
                  {item.parentLabel && (
                    <p className={`text-xs mt-0.5 truncate ${
                      activeSection === item.key ? 'text-blue-200' : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      {item.parentLabel}
                    </p>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* No results message */}
          {searchQuery && filteredItems.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No items found for "{searchQuery}"
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-2 flex-shrink-0">
          {/* User Info */}
          {userInfo && (
            <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
              <UserCircleIcon className="w-8 h-8 text-gray-400" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {userInfo.name || userInfo.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {userInfo.role}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={toggleDarkMode}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              {isDarkMode ? (
                <SunIcon className="w-4 h-4" />
              ) : (
                <MoonIcon className="w-4 h-4" />
              )}
              {isDarkMode ? 'Light' : 'Dark'}
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SimpleSidebar;