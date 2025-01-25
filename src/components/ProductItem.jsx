import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PencilSquareIcon, MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { productService } from '../services/productService'

export default function ProductItem({ product: initialProduct, onDelete }) {
  const [product, setProduct] = useState(initialProduct)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

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

  const getStockStatusClasses = () => {
    if (product.quantite === 0) {
      return 'bg-red-50 border-red-200';
    } else if (product.quantite === 1) {
      return 'bg-orange-50 border-orange-200';
    }
    return 'bg-white border-gray-200';
  };

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await productService.deleteProduct(product.id)
      onDelete(product.id)
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error)
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <>
      <div className={`relative flex flex-col rounded-2xl border p-6 ${getStockStatusClasses()}`}>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-medium text-gray-900">
              {product.rayon?.name || 'Sans rayon'}
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
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="ml-2 inline-flex h-8 w-8 items-center justify-center rounded-full text-red-400 hover:bg-red-50 hover:text-red-500"
              >
                <TrashIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.category?.name && (
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-sm font-medium text-blue-700">
              {product.category.name}
            </span>
          )}
          {product.subCategory?.name && (
            <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-sm font-medium text-purple-700">
              {product.subCategory.name}
            </span>
          )}
        </div>
        <div className="mt-4 flex items-center space-x-3 text-sm text-gray-500">
          {product.brand?.name && <span>{product.brand.name}</span>}
          {product.conditionnement && <span>{product.conditionnement}</span>}
          {product.barcodes?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.barcodes.map(barcode => (
                <span key={barcode.code} className="font-mono text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded">
                  {barcode.code}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmer la suppression</h3>
            <p className="text-sm text-gray-500 mb-6">
              Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
