import React from 'react';
import {
  ShoppingCartIcon,
  ArchiveBoxIcon,
  ArrowPathIcon,
  PlusCircleIcon,
  MinusCircleIcon,
  QrCodeIcon,
  ChartBarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Scanner',
    description: 'Scanner un produit',
    icon: QrCodeIcon,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    route: 'scanner'
  },
  {
    name: 'Inventaire',
    description: 'Voir tous les produits',
    icon: ArchiveBoxIcon,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    route: 'inventory'
  },
  {
    name: 'Ajouter',
    description: 'Ajouter du stock',
    icon: PlusCircleIcon,
    color: 'text-purple-500',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    route: 'add-stock'
  },
  {
    name: 'Retirer',
    description: 'Retirer du stock',
    icon: MinusCircleIcon,
    color: 'text-red-500',
    bg: 'bg-red-50',
    border: 'border-red-200',
    route: 'remove-stock'
  },
  {
    name: 'Transferts',
    description: 'Gérer les transferts',
    icon: ArrowPathIcon,
    color: 'text-yellow-500',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    route: 'transfers'
  },
  {
    name: 'Historique',
    description: 'Voir l\'historique',
    icon: ClockIcon,
    color: 'text-gray-500',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
    route: 'history'
  }
];

export default function DashboardGrid({ onNavigate }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          Gestion des Stocks
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
          Gérez votre inventaire simplement et efficacement
        </p>
      </div>

      <div className="mt-12">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
          {features.map((feature) => (
            <button
              key={feature.name}
              onClick={() => onNavigate(feature.route)}
              className={`relative group bg-white p-6 focus:outline-none rounded-lg border ${feature.border} transition-all duration-200 ease-in-out hover:shadow-lg`}
            >
              <div>
                <span className={`inline-flex p-3 rounded-lg ${feature.bg}`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} aria-hidden="true" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
                  {feature.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500 group-hover:text-gray-400 transition-colors">
                  {feature.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
