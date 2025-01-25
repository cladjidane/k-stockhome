import React from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, QueueListIcon } from '@heroicons/react/24/outline';

const actions = [
  {
    name: 'Ajouter un produit',
    description: 'Créer un nouveau produit dans votre inventaire',
    href: '/products/new',
    icon: PlusIcon,
    bgColor: 'bg-indigo-600',
  },
  {
    name: 'Voir les stocks',
    description: 'Consulter et gérer vos produits en stock',
    href: '/products',
    icon: QueueListIcon,
    bgColor: 'bg-emerald-600',
  },
];

export default function Home() {
  return (
    <div className="px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestion de Stock</h1>
        <p className="mt-2 text-sm text-gray-600">
          Gérez facilement votre inventaire
        </p>
      </div>

      <div className="grid gap-6 max-w-lg mx-auto">
        {actions.map((action) => (
          <Link
            key={action.name}
            to={action.href}
            className="relative flex items-center space-x-6 rounded-lg border border-gray-300 bg-white p-6 shadow-sm hover:shadow-md transition-shadow focus:outline-none"
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${action.bgColor}`}>
              <action.icon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="focus:outline-none">
                <p className="text-lg font-medium text-gray-900">{action.name}</p>
                <p className="mt-1 text-sm text-gray-500">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
