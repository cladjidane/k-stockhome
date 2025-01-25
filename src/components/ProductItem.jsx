import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PencilSquareIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { productService } from '../services/productService'

export default function ProductItem({ product: initialProduct }) {
  const [product, setProduct] = useState(initialProduct)
  const [isUpdating, setIsUpdating] = useState(false)

  const updateQuantity = async (delta) => {
    const newQuantity = Math.max(0, product.quantite + delta)
    if (newQuantity === product.quantite) return

    setIsUpdating(true)
    try {
      await productService.updateQuantity(product.id, newQuantity)
      setProduct(prev => ({ ...prev, quantite: newQuantity }))
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la quantité:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="relative flex flex-col rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-medium text-gray-900">
            {product.marque || 'Sans marque'}
          </h3>
          <div className="flex items-center space-x-1">
            <button
              type="button"
              disabled={isUpdating || product.quantite === 0}
              onClick={() => updateQuantity(-1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400"
            >
              <MinusIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <span className="min-w-[2rem] text-center">
              {product.quantite}
            </span>
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => updateQuantity(1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-400"
            >
              <PlusIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <Link
              to={`/products/${product.id}`}
              className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <PencilSquareIcon className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.rayon && (
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-sm font-medium text-blue-700">
              {product.rayon}
            </span>
          )}
          {product.categorie && (
            <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-sm font-medium text-indigo-700">
              {product.categorie}
            </span>
          )}
          {product.sousCategorie && (
            <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-sm font-medium text-purple-700">
              {product.sousCategorie}
            </span>
          )}
        </div>
        <div className="mt-4 flex items-center space-x-3 text-sm text-gray-500">
          {product.conditionnement && <span>{product.conditionnement}</span>}
          {product.codebar && <span className="font-mono text-xs text-gray-400">{product.codebar}</span>}
        </div>
      </div>
    </div>
  )
}
