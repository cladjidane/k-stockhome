import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { ArrowLeftIcon, QrCodeIcon, XMarkIcon } from '@heroicons/react/24/outline'
import BarcodeScanner from '../components/Scanner/BarcodeScanner'
import { productService } from '../services/productService'
import Select from 'react-select/creatable'
import { DEFAULT_PRODUCT } from '../types/Product'

export default function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [isScanning, setIsScanning] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState({
    storage: [],
    rayon: [],
    category: [],
    subCategory: [],
    brand: []
  })

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [storages, rayons, categories, subCategories, brands] = await Promise.all([
          productService.getStorages(),
          productService.getRayons(),
          productService.getCategories(),
          productService.getSubCategories(),
          productService.getBrands()
        ])

        setCategoryOptions({
          storage: storages.map(storage => ({ value: storage.id, label: storage.name })),
          rayon: rayons.map(rayon => ({ value: rayon.id, label: rayon.name })),
          category: categories.map(cat => ({ value: cat.id, label: cat.name })),
          subCategory: subCategories.map(subCat => ({ value: subCat.id, label: subCat.name })),
          brand: brands.map(brand => ({ value: brand.id, label: brand.name }))
        })
      } catch (error) {
        console.error('Error loading options:', error)
        setError('Error loading categories and brands')
      }
    }

    loadOptions()
  }, [])

  const [formData, setFormData] = useState(() => {
    if (location.state?.codebar) {
      return { ...DEFAULT_PRODUCT, barcodes: [location.state.codebar] }
    }
    return { ...DEFAULT_PRODUCT, barcodes: [] }
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        try {
          setIsLoading(true);
          const { product, categories, subcategories, brands, rayons, storages } = await productService.getProduct(id);
          if (product) {
            setFormData({
              ...product,
              storage: product.storage?.id || '',
              rayon: product.rayon?.id || '',
              category: product.category?.id || '',
              subCategory: product.subCategory?.id || '',
              brand: product.brand?.id || '',
              barcodes: product.barcodes?.map(b => b.code) || [],
              quantite: product.quantite || 0,
              conditionnement: product.conditionnement || ''
            });

            setCategoryOptions({
              storage: storages.map(storage => ({ value: storage.id, label: storage.name })),
              rayon: rayons.map(rayon => ({ value: rayon.id, label: rayon.name })),
              category: categories.map(cat => ({ value: cat.id, label: cat.name })),
              subCategory: subcategories.map(subCat => ({ value: subCat.id, label: subCat.name })),
              brand: brands.map(brand => ({ value: brand.id, label: brand.name }))
            });
          }
        } catch (err) {
          setError('Erreur lors du chargement du produit');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadProduct();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!formData.rayon || !formData.category || formData.barcodes.length === 0) {
        throw new Error('Les champs rayon, categorie et au moins un code-barres sont obligatoires');
      }

      const productData = {
        storageId: formData.storage || undefined,
        rayonId: formData.rayon,
        categoryId: formData.category,
        subCategoryId: formData.subCategory || undefined,
        brandId: formData.brand || undefined,
        quantite: parseInt(formData.quantite, 10),
        conditionnement: formData.conditionnement,
        barcodes: {
          create: formData.barcodes.map(code => ({ code }))
        }
      };

      if (id) {
        await productService.updateProduct(id, productData);
      } else {
        await productService.createProduct(productData);
      }
      navigate('/products');
    } catch (error) {
      console.error('Error saving product:', error);
      setError(error.message || 'Une erreur est survenue lors de l\'enregistrement du produit');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScan = (result) => {
    if (!formData.barcodes.includes(result)) {
      setFormData(prev => ({
        ...prev,
        barcodes: [...prev.barcodes, result]
      }))
    }
    setIsScanning(false)
  }

  const removeBarcode = (barcode) => {
    setFormData(prev => ({
      ...prev,
      barcodes: prev.barcodes.filter(code => code !== barcode)
    }))
  }

  const handleCreateOption = async (inputValue, selectType) => {
    try {
      let newEntity;
      switch (selectType) {
        case 'storage':
          newEntity = await productService.createStorage(inputValue);
          break;
        case 'rayon':
          newEntity = await productService.createRayon(inputValue);
          break;
        case 'category':
          newEntity = await productService.createCategory(inputValue);
          break;
        case 'subCategory':
          if (!formData.category) {
            setError('Veuillez d\'abord sélectionner une catégorie');
            return;
          }
          newEntity = await productService.createSubCategory(inputValue);
          break;
        case 'brand':
          newEntity = await productService.createBrand(inputValue);
          break;
        default:
          return;
      }

      const newOption = { value: newEntity.id, label: newEntity.name };
      setCategoryOptions(prev => ({
        ...prev,
        [selectType]: [...prev[selectType], newOption]
      }));
      setFormData(prev => ({ ...prev, [selectType]: newOption.value }));
    } catch (error) {
      console.error('Error creating new option:', error);
      setError(`Erreur lors de la création de l'option: ${error.message}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  const customStyles = {
    control: (base) => ({
      ...base,
      minHeight: '42px',
      borderRadius: '0.375rem',
      borderColor: 'transparent',
      boxShadow: '0 0 0 1px rgb(209 213 219)',
      '&:hover': {
        borderColor: 'transparent',
        boxShadow: '0 0 0 1px rgb(209 213 219)'
      }
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#4F46E5' : state.isFocused ? '#EEF2FF' : 'white',
      ':active': {
        backgroundColor: '#4F46E5'
      }
    })
  };

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
                    <div className="sm:col-span-2 border-b border-gray-200 pb-6 mb-6">
                      <label htmlFor="storage" className="block text-sm font-medium leading-6 text-gray-900">
                        Rangement
                      </label>
                      <div className="mt-2">
                        <Select
                          id="storage"
                          name="storage"
                          value={categoryOptions.storage.find(option => option.value === formData.storage)}
                          onChange={(newValue) => {
                            setFormData(prev => ({ ...prev, storage: newValue ? newValue.value : '' }));
                          }}
                          options={categoryOptions.storage}
                          styles={customStyles}
                          placeholder="Sélectionner un rangement"
                          isClearable
                          isSearchable
                          creatable
                          onCreateOption={(inputValue) => handleCreateOption(inputValue, 'storage')}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-1">
                      <label htmlFor="rayon" className="block text-sm font-medium leading-6 text-gray-900">
                        Rayon
                      </label>
                      <div className="mt-2">
                        <Select
                          id="rayon"
                          name="rayon"
                          value={categoryOptions.rayon.find(option => option.value === formData.rayon)}
                          onChange={(newValue) => {
                            setFormData(prev => ({ ...prev, rayon: newValue ? newValue.value : '' }));
                          }}
                          options={categoryOptions.rayon}
                          styles={customStyles}
                          placeholder="Sélectionner un rayon"
                          isClearable
                          isSearchable
                          required
                          creatable
                          onCreateOption={(inputValue) => handleCreateOption(inputValue, 'rayon')}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-1">
                      <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-900">
                        Catégorie
                      </label>
                      <div className="mt-2 relative">
                        <Select
                          id="category"
                          name="category"
                          value={categoryOptions.category.find(option => option.value === formData.category)}
                          onChange={(newValue) => {
                            setFormData(prev => ({ ...prev, category: newValue.value }));
                          }}
                          options={categoryOptions.category}
                          styles={customStyles}
                          placeholder="Sélectionner une catégorie"
                          isClearable
                          isSearchable
                          required
                          creatable
                          onCreateOption={(inputValue) => handleCreateOption(inputValue, 'category')}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-1">
                      <label htmlFor="subCategory" className="block text-sm font-medium leading-6 text-gray-900">
                        Sous-catégorie
                      </label>
                      <div className="mt-2">
                        <Select
                          id="subCategory"
                          name="subCategory"
                          value={categoryOptions.subCategory.find(option => option.value === formData.subCategory)}
                          onChange={(newValue) => {
                            setFormData(prev => ({ ...prev, subCategory: newValue ? newValue.value : '' }));
                          }}
                          options={categoryOptions.subCategory}
                          styles={customStyles}
                          placeholder="Sélectionner une sous-catégorie"
                          isClearable
                          isSearchable
                          isDisabled={!formData.category}
                          creatable
                          onCreateOption={(inputValue) => handleCreateOption(inputValue, 'subCategory')}
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-1">
                      <label htmlFor="brand" className="block text-sm font-medium leading-6 text-gray-900">
                        Marque
                      </label>
                      <div className="mt-2">
                        <Select
                          id="brand"
                          name="brand"
                          value={categoryOptions.brand.find(option => option.value === formData.brand)}
                          onChange={(newValue) => {
                            setFormData(prev => ({ ...prev, brand: newValue ? newValue.value : '' }));
                          }}
                          options={categoryOptions.brand}
                          styles={customStyles}
                          placeholder="Sélectionner une marque"
                          isClearable
                          isSearchable
                          creatable
                          onCreateOption={(inputValue) => handleCreateOption(inputValue, 'brand')}
                        />
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
                      <label className="block text-sm font-medium leading-6 text-gray-900">
                        Codes-barres
                      </label>
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {formData.barcodes.map((barcode) => (
                            <span
                              key={barcode}
                              className="inline-flex items-center gap-x-1.5 rounded-md px-2 py-1 text-sm font-medium text-gray-900 ring-1 ring-inset ring-gray-200"
                            >
                              {barcode}
                              <button
                                type="button"
                                onClick={() => removeBarcode(barcode)}
                                className="group relative -mr-1 h-3.5 w-3.5 rounded-sm hover:bg-gray-500/20"
                              >
                                <XMarkIcon className="h-3.5 w-3.5 text-gray-400 group-hover:text-gray-500" />
                              </button>
                            </span>
                          ))}
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsScanning(true)}
                          className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                          <QrCodeIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                          Scanner un code-barres
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
