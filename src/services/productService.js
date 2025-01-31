import { api } from './api'

export const productService = {
  // Storage operations
  getStorages: async () => {
    return api.get('/storages')
  },

  createStorage: async (name) => {
    return api.post('/storages', { name })
  },

  // Rayon operations
  getRayons: async () => {
    return api.get('/rayons')
  },

  createRayon: async (name) => {
    return api.post('/rayons', { name })
  },

  // Category operations
  getCategories: async () => {
    return api.get('/categories')
  },

  getSubCategories: async () => {
    return api.get('/subcategories')
  },

  getBrands: async () => {
    return api.get('/brands')
  },

  // Category operations
  createCategory: async (name) => {
    return api.post('/categories', { name })
  },

  // SubCategory operations
  createSubCategory: async (name) => {
    return api.post('/subcategories', { name })
  },

  // Brand operations
  createBrand: async (name) => {
    return api.post('/brands', { name })
  },
  // Créer un nouveau produit
  createProduct: async (productData) => {
    return api.post('/products', productData)
  },

  // Mettre à jour un produit
  updateProduct: async (id, productData) => {
    return api.put(`/products/${id}`, productData)
  },

  // Récupérer un produit par son ID
  getProduct: async (id) => {
    return api.get(`/products/${id}`)
  },

  // Récupérer tous les produits avec filtres optionnels
  getProducts: async (filters = {}) => {
    const searchParams = new URLSearchParams()
    if (filters.search) {
      searchParams.append('search', filters.search)
    }
    return api.get(`/products?${searchParams.toString()}`)
  },

  // Supprimer un produit
  deleteProduct: async (id) => {
    return api.delete(`/products/${id}`)
  },

  // Mettre à jour la quantité d'un produit
  updateQuantity: async (id, quantity) => {
    return api.put(`/products/${id}/quantity`, { quantite: quantity })
  },

  // Vérifier si un code-barres existe déjà
  checkBarcodeExists: async (codebar, excludeId = null) => {
    const searchParams = new URLSearchParams()
    if (excludeId) {
      searchParams.append('excludeId', excludeId)
    }
    const response = await api.get(`/products/check-barcode/${codebar}?${searchParams.toString()}`)
    return response.exists
  },

  // Ajouter un code-barres à un produit existant
  addBarcodeToProduct: async (productId, barcode) => {
    return api.post(`/products/${productId}/barcodes`, { code: barcode })
  }
}
