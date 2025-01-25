import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()

app.use(cors())
app.use(express.json())

// Liste des produits avec recherche
app.get('/api/products', async (req, res) => {
  try {
    const { search } = req.query
    const where = {}

    if (search) {
      where.OR = [
        { rayon: { contains: search } },
        { categorie: { contains: search } },
        { sousCategorie: { contains: search } },
        { marque: { contains: search } },
        { codebar: { contains: search } },
      ]
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: [
        { rayon: 'asc' },
        { categorie: 'asc' },
      ],
    })
    res.json(products)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erreur lors de la récupération des produits' })
  }
})

// Récupérer un produit par ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params
    const product = await prisma.product.findUnique({
      where: { id },
    })
    if (product) {
      res.json(product)
    } else {
      res.status(404).json({ error: 'Produit non trouvé' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erreur lors de la récupération du produit' })
  }
})

// Créer un produit
app.post('/api/products', async (req, res) => {
  try {
    const product = await prisma.product.create({
      data: req.body,
    })
    res.status(201).json(product)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erreur lors de la création du produit' })
  }
})

// Mettre à jour un produit
app.put('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params
    const product = await prisma.product.update({
      where: { id },
      data: req.body,
    })
    res.json(product)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erreur lors de la mise à jour du produit' })
  }
})

// Vérifier si un code-barres existe
app.get('/api/products/check-barcode/:codebar', async (req, res) => {
  try {
    const { codebar } = req.params
    const { excludeId } = req.query
    
    const where = { codebar }
    if (excludeId) {
      where.NOT = { id: excludeId }
    }
    
    const product = await prisma.product.findFirst({ where })
    res.json({ exists: !!product })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erreur lors de la vérification du code-barres' })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
