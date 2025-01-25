import React from 'react';
import {
  HomeIcon,
  QrCodeIcon,
  ArchiveBoxIcon,
  ChartBarIcon,
  UserIcon,
} from '@heroicons/react/24/outline';

const getNavigation = (currentView) => [
  { name: 'Accueil', icon: HomeIcon, current: currentView === 'dashboard', id: 'dashboard' },
  { name: 'Scanner', icon: QrCodeIcon, current: ['scanner', 'add-stock'].includes(currentView), id: 'scanner' },
  { name: 'Inventaire', icon: ArchiveBoxIcon, current: currentView === 'inventory', id: 'inventory' },
  { name: 'Stats', icon: ChartBarIcon, current: currentView === 'statistics', id: 'statistics' },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function NavigationItem({ item, onNavigate }) {
  return (
    <button
      onClick={() => onNavigate(item.id)}
      className={classNames(
        item.current
          ? 'text-emerald-600'
          : 'text-gray-400 hover:text-gray-500',
        'inline-flex flex-col items-center justify-center px-5 py-2 hover:bg-gray-50 group'
      )}
    >
      <item.icon
        className={classNames(
          item.current ? 'text-emerald-600' : 'text-gray-400 group-hover:text-gray-500',
          'w-6 h-6'
        )}
        aria-hidden="true"
      />
      <span className="mt-1 text-xs font-medium">
        {item.name}
      </span>
    </button>
  );
}

export default function AppLayout({ children, onNavigate, currentView }) {
  const navigation = getNavigation(currentView);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-emerald-600">StockManager</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button className="p-2 rounded-full text-gray-400 hover:text-gray-500">
                <UserIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-16">
        <div className="py-6">
          {children}
        </div>
      </main>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 z-50 w-full bg-white border-t border-gray-200">
        <div className="max-w-lg mx-auto">
          <div className="grid h-16 grid-cols-4">
            {navigation.map((item) => (
              <NavigationItem key={item.name} item={item} onNavigate={onNavigate} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
