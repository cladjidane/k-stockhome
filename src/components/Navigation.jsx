import { Link, useLocation } from 'react-router-dom'
import { HomeIcon, PlusIcon, QueueListIcon } from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Accueil', href: '/', icon: HomeIcon },
  { name: 'Ajouter', href: '/add-stock', icon: PlusIcon },
  { name: 'Produits', href: '/products', icon: QueueListIcon },
]

export default function Navigation() {
  const location = useLocation()

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200">
      <div className="grid h-full max-w-lg grid-cols-3 mx-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50"
            >
              <item.icon
                className={`w-6 h-6 mb-1 ${
                  isActive ? 'text-indigo-600' : 'text-gray-500'
                }`}
                aria-hidden="true"
              />
              <span
                className={`text-xs ${
                  isActive ? 'text-indigo-600' : 'text-gray-500'
                }`}
              >
                {item.name}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
