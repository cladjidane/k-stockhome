import { api } from './api'

export const productService = {
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
    return api.put(`/products/${id}`, { quantite: quantity })
  },

  // Vérifier si un code-barres existe déjà
  checkBarcodeExists: async (codebar, excludeId = null) => {
    const searchParams = new URLSearchParams()
    if (excludeId) {
      searchParams.append('excludeId', excludeId)
    }
    const response = await api.get(`/products/check-barcode/${codebar}?${searchParams.toString()}`)
    return response.exists
  }
}
