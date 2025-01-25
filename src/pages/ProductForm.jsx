import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeftIcon, QrCodeIcon } from '@heroicons/react/24/outline'
import BarcodeScanner from '../components/Scanner/BarcodeScanner'
import { productService } from '../services/productService'
import {
  PRODUCT_CATEGORIES,
  SUBCATEGORIES,
  PRODUCT_VARIANTS,
  BRANDS,
  DEFAULT_PRODUCT
} from '../types/Product'

export default function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isScanning, setIsScanning] = useState(false)
  const [formData, setFormData] = useState(DEFAULT_PRODUCT)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        try {
          setIsLoading(true)
          const product = await productService.getProduct(id)
          if (product) {
            setFormData(product)
          }
        } catch (err) {
          setError('Erreur lors du chargement du produit')
          console.error(err)
        } finally {
          setIsLoading(false)
        }
      }
    }

    loadProduct()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Vérifier si le code-barres existe déjà
      const exists = await productService.checkBarcodeExists(formData.codebar, id)
      if (exists) {
        setError('Ce code-barres existe déjà')
        setIsLoading(false)
        return
      }

      if (id) {
        await productService.updateProduct(id, formData)
      } else {
        await productService.createProduct(formData)
      }
      navigate('/products')
    } catch (err) {
      setError('Erreur lors de la sauvegarde')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleScan = (result) => {
    setFormData(prev => ({ ...prev, codebar: result }))
    setIsScanning(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <div className="flex items-center">
              <Link
                to="/products"
                className="mr-4 rounded-full bg-white p-3 text-gray-400 hover:text-gray-500 shadow-sm"
              >
                <ArrowLeftIcon className="h-6 w-6" aria-hidden="true" />
              </Link>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {id ? 'Modifier le produit' : 'Nouveau produit'}
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Remplissez les informations ci-dessous pour {id ? 'modifier' : 'ajouter'} un produit
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl">
            <div className="px-4 py-6 sm:p-8">
              {error && (
                <div className="mb-6 rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{error}</h3>
                    </div>
                  </div>
                </div>
              )}
              
              {isScanning ? (
                <div>
                  <BarcodeScanner onScanSuccess={handleScan} />
                  <button
                    type="button"
                    onClick={() => setIsScanning(false)}
                    className="mt-4 inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Annuler
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                      <label htmlFor="rayon" className="block text-sm font-medium leading-6 text-gray-900">
                        Rayon
                      </label>
                      <div className="mt-2">
                        <select
                          id="rayon"
                          name="rayon"
                          required
                          className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          value={formData.rayon}
                          onChange={(e) => setFormData(prev => ({ ...prev, rayon: e.target.value }))}
                        >
                          <option value="">Sélectionner un rayon</option>
                          {Object.values(PRODUCT_CATEGORIES).map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-1">
                      <label htmlFor="categorie" className="block text-sm font-medium leading-6 text-gray-900">
                        Catégorie
                      </label>
                      <div className="mt-2">
                        <select
                          id="categorie"
                          name="categorie"
                          required
                          className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          value={formData.categorie}
                          onChange={(e) => setFormData(prev => ({ ...prev, categorie: e.target.value }))}
                        >
                          <option value="">Sélectionner une catégorie</option>
                          {Object.values(SUBCATEGORIES).map((subcat) => (
                            <option key={subcat} value={subcat}>
                              {subcat}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-1">
                      <label htmlFor="sousCategorie" className="block text-sm font-medium leading-6 text-gray-900">
                        Sous-catégorie
                      </label>
                      <div className="mt-2">
                        <select
                          id="sousCategorie"
                          name="sousCategorie"
                          className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          value={formData.sousCategorie}
                          onChange={(e) => setFormData(prev => ({ ...prev, sousCategorie: e.target.value }))}
                        >
                          <option value="">Sélectionner une sous-catégorie</option>
                          {Object.values(PRODUCT_VARIANTS).map((variant) => (
                            <option key={variant} value={variant}>
                              {variant}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-1">
                      <label htmlFor="marque" className="block text-sm font-medium leading-6 text-gray-900">
                        Marque
                      </label>
                      <div className="mt-2">
                        <select
                          id="marque"
                          name="marque"
                          required
                          className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          value={formData.marque}
                          onChange={(e) => setFormData(prev => ({ ...prev, marque: e.target.value }))}
                        >
                          <option value="">Sélectionner une marque</option>
                          {Object.values(BRANDS).map((brand) => (
                            <option key={brand} value={brand}>
                              {brand}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="sm:col-span-1">
                      <label htmlFor="conditionnement" className="block text-sm font-medium leading-6 text-gray-900">
                        Conditionnement
                      </label>
                      <div className="mt-2">
                        <input
                          type="text"
                          name="conditionnement"
                          id="conditionnement"
                          placeholder="ex: 250 ml, 56, 24 doses"
                          className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          value={formData.conditionnement}
                          onChange={(e) => setFormData(prev => ({ ...prev, conditionnement: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-1">
                      <label htmlFor="quantite" className="block text-sm font-medium leading-6 text-gray-900">
                        Quantité
                      </label>
                      <div className="mt-2">
                        <input
                          type="number"
                          name="quantite"
                          id="quantite"
                          min="0"
                          required
                          className="block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          value={formData.quantite}
                          onChange={(e) => setFormData(prev => ({ ...prev, quantite: parseInt(e.target.value, 10) }))}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="codebar" className="block text-sm font-medium leading-6 text-gray-900">
                        Code-barres
                      </label>
                      <div className="mt-2 flex rounded-md shadow-sm">
                        <input
                          type="text"
                          name="codebar"
                          id="codebar"
                          required
                          className="block w-full rounded-none rounded-l-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          value={formData.codebar}
                          onChange={(e) => setFormData(prev => ({ ...prev, codebar: e.target.value }))}
                        />
                        <button
                          type="button"
                          onClick={() => setIsScanning(true)}
                          className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2.5 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          <QrCodeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                          Scanner
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-end gap-x-6 border-t border-gray-900/10 pt-6">
                    <Link
                      to="/products"
                      className="text-sm font-semibold leading-6 text-gray-900"
                    >
                      Annuler
                    </Link>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                    >
                      {isLoading ? 'Enregistrement...' : 'Enregistrer'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
