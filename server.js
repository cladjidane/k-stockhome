import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
const app = express()

app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Rayon endpoints
app.get('/api/rayons', async (req, res) => {
  try {
    const rayons = await prisma.rayon.findMany({
      orderBy: { name: 'asc' }
    })
    res.json(rayons)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error retrieving rayons' })
  }
})

app.post('/api/rayons', async (req, res) => {
  try {
    const { name } = req.body
    if (!name) {
      return res.status(400).json({ error: 'Rayon name is required' })
    }
    const rayon = await prisma.rayon.create({
      data: { name }
    })
    res.status(201).json(rayon)
  } catch (error) {
    console.error(error)
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Rayon already exists' })
    }
    res.status(500).json({ error: 'Error creating rayon' })
  }
})

// Category endpoints
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    })
    res.json(categories)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error retrieving categories' })
  }
})

app.post('/api/categories', async (req, res) => {
  try {
    const { name } = req.body
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' })
    }
    const category = await prisma.category.create({
      data: { name }
    })
    res.status(201).json(category)
  } catch (error) {
    console.error(error)
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Category already exists' })
    }
    res.status(500).json({ error: 'Error creating category' })
  }
})

// SubCategory endpoints
app.get('/api/subcategories', async (req, res) => {
  try {
    const subcategories = await prisma.subCategory.findMany({
      orderBy: { name: 'asc' }
    })
    res.json(subcategories)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error retrieving subcategories' })
  }
})

app.post('/api/subcategories', async (req, res) => {
  try {
    const { name } = req.body
    if (!name) {
      return res.status(400).json({ error: 'Subcategory name is required' })
    }
    const subcategory = await prisma.subCategory.create({
      data: { name }
    })
    res.status(201).json(subcategory)
  } catch (error) {
    console.error(error)
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Subcategory already exists' })
    }
    res.status(500).json({ error: 'Error creating subcategory' })
  }
})

// Brand endpoints
app.get('/api/brands', async (req, res) => {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: 'asc' }
    })
    res.json(brands)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error retrieving brands' })
  }
})

// Storage endpoints
app.get('/api/storages', async (req, res) => {
  try {
    const storages = await prisma.storage.findMany({
      orderBy: { name: 'asc' }
    })
    res.json(storages)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error retrieving storages' })
  }
})

app.post('/api/storages', async (req, res) => {
  try {
    const { name } = req.body
    if (!name) {
      return res.status(400).json({ error: 'Storage name is required' })
    }
    const storage = await prisma.storage.create({
      data: { name }
    })
    res.status(201).json(storage)
  } catch (error) {
    console.error(error)
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Storage already exists' })
    }
    res.status(500).json({ error: 'Error creating storage' })
  }
})

// Brand endpoints
app.post('/api/brands', async (req, res) => {
  try {
    const { name } = req.body
    if (!name) {
      return res.status(400).json({ error: 'Brand name is required' })
    }
    const brand = await prisma.brand.create({
      data: { name }
    })
    res.status(201).json(brand)
  } catch (error) {
    console.error(error)
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Brand already exists' })
    }
    res.status(500).json({ error: 'Error creating brand' })
  }
})

// Liste des produits avec recherche
app.get('/api/products', async (req, res) => {
  try {
    const { search } = req.query
    const where = {}

    if (search) {
      where.OR = [
        { category: { name: { contains: search } } },
        { subCategory: { name: { contains: search } } },
        { brand: { name: { contains: search } } },
        { rayon: { name: { contains: search } } },
        { barcodes: { some: { code: { contains: search } } } },
      ]
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        barcodes: true,
        category: true,
        subCategory: true,
        brand: true,
        rayon: true,
        storage: true
      },
      orderBy: [
        { category: { name: 'asc' } }
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
    const [product, categories, subcategories, brands, rayons] = await Promise.all([
      prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          subCategory: true,
          brand: true,
          rayon: true,
          barcodes: true
        }
      }),
      prisma.category.findMany({ orderBy: { name: 'asc' } }),
      prisma.subCategory.findMany({ orderBy: { name: 'asc' } }),
      prisma.brand.findMany({ orderBy: { name: 'asc' } }),
      prisma.rayon.findMany({ orderBy: { name: 'asc' } })
    ])

    if (!product) {
      return res.status(404).json({ error: 'Produit non trouvé' })
    }

    res.json({
      product,
      categories,
      subcategories,
      brands,
      rayons
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erreur lors de la récupération du produit' })
  }
})

// Créer un produit
app.post('/api/products', async (req, res) => {
  try {
    const { rayonId, categoryId, subCategoryId, brandId, barcodes, conditionnement, quantite, storageId } = req.body

    // Validate required fields
    if (!rayonId || !categoryId || !barcodes?.create?.length) {
      return res.status(400).json({
        error: 'Les champs rayon, category et au moins un code-barres sont obligatoires'
      })
    }

    const product = await prisma.product.create({
      data: {
        rayonId,
        categoryId,
        subCategoryId: subCategoryId || null,
        brandId: brandId || null,
        storageId: storageId || null,
        conditionnement,
        quantite: quantite || 0,
        barcodes: barcodes
      },
      include: {
        category: true,
        subCategory: true,
        brand: true,
        rayon: true,
        storage: true,
        barcodes: true
      }
    })
    res.status(201).json(product)
  } catch (error) {
    console.error(error)
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Un des codes-barres existe déjà' })
    }
    res.status(500).json({ error: 'Erreur lors de la création du produit' })
  }
})

// Mettre à jour un produit
app.put('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { rayonId, categoryId, subCategoryId, brandId, conditionnement, quantite, storageId } = req.body;

  try {
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        rayonId,
        categoryId,
        subCategoryId: subCategoryId || null,
        brandId: brandId || null,
        storageId: storageId || null,
        quantite,
        conditionnement
      },
      include: {
        category: true,
        subCategory: true,
        brand: true,
        rayon: true,
        storage: true,
        barcodes: true
      }
    });

    res.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete a product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id }
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Error deleting product' });
  }
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
