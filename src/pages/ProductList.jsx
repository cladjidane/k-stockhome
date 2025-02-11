import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MagnifyingGlassIcon, ArchiveBoxIcon, QrCodeIcon } from '@heroicons/react/24/outline'
import { productService } from '../services/productService'
import ProductItem from '../components/ProductItem'

export default function ProductList() {
  const [searchQuery, setSearchQuery] = useState('')
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true)
        const data = await productService.getProducts({
          search: searchQuery
        })
        setProducts(data)
        setError('')
      } catch (err) {
        console.error('Error loading products:', err)
        setError(err.message || 'Unable to connect to the server. Please check your connection and try again.')
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimeout = setTimeout(loadProducts, 300)
    return () => clearTimeout(debounceTimeout)
  }, [searchQuery])

  const handleDelete = (productId) => {
    setProducts(prevProducts => prevProducts.filter(product => product.id !== productId))
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold text-gray-900">Produits</h1>
      <p className="mt-1 text-sm text-gray-600">
        Liste de tous les produits en stock
      </p>

      <div className="mt-6">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            className="block w-full rounded-xl border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
            placeholder="Rechercher un produit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <div className="rounded-full bg-gray-100 p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <ArchiveBoxIcon className="h-12 w-12 text-gray-400" aria-hidden="true" />
              </div>
              <h3 className="text-base font-semibold text-gray-900">Aucun produit</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery 
                  ? "Aucun produit ne correspond à votre recherche."
                  : "Commencez par ajouter votre premier produit."}
              </p>
              {!searchQuery && (
                <div className="mt-6">
                  <Link
                    to="/add-stock"
                    className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                  >
                    <QrCodeIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                    Scanner un produit
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {products.map((product) => (
                <ProductItem key={product.id} product={product} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
