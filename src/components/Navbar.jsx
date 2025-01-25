import { Fragment } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, Transition } from '@headlessui/react'
import { HomeIcon, PlusIcon, ListBulletIcon, Bars3Icon } from '@heroicons/react/24/outline'

export default function Navbar() {
  const location = useLocation()

  const navigation = [
    { name: 'Accueil', href: '/', icon: HomeIcon },
    { name: 'Liste des produits', href: '/products', icon: ListBulletIcon },
    { name: 'Nouveau produit', href: '/products/new', icon: PlusIcon },
  ]

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 shadow-md shadow-indigo-200">
                <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375z" />
                  <path fillRule="evenodd" d="M3.087 9l.54 9.176A3 3 0 006.62 21h10.757a3 3 0 002.995-2.824L20.913 9H3.087zm6.163 3.75A.75.75 0 0110 12h4a.75.75 0 010 1.5h-4a.75.75 0 01-.75-.75z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="ml-3 text-lg font-semibold text-gray-900">StockFlow</span>
            </Link>

            <Menu as="div" className="relative ml-8">
              <Menu.Button className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                <Bars3Icon className="h-5 w-5" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-right-left rounded-xl bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {navigation.map((item) => {
                    const active = isActive(item.href)
                    const isNewProduct = item.href === '/products/new'
                    return (
                      <Menu.Item key={item.name}>
                        {({ active: hover }) => (
                          <Link
                            to={item.href}
                            className={`
                              block px-4 py-2 text-sm
                              ${isNewProduct ? 'text-indigo-600 hover:bg-indigo-50' : 
                                active ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700'
                              }
                              ${hover && !active && !isNewProduct ? 'bg-gray-50' : ''}
                            `}
                          >
                            <div className="flex items-center">
                              <item.icon 
                                className={`mr-3 h-5 w-5 ${isNewProduct ? 'text-indigo-600' : ''}`} 
                                aria-hidden="true" 
                              />
                              {item.name}
                            </div>
                          </Link>
                        )}
                      </Menu.Item>
                    )
                  })}
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
      </div>
    </nav>
  )
}
