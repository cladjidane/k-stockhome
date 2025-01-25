import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const initialCategories = [
  { name: 'Gel douche' },
  { name: 'Dentifrice' },
  { name: 'Shampoing' },
  { name: 'Lave vaisselle' },
  { name: 'Produit vaisselle' },
  { name: 'Spray' },
  { name: 'Déodorant' },
  { name: 'Lessive' },
  { name: 'Sac poubelle' },
  { name: 'Brosse à dent' }
]

const initialSubCategories = [
  { name: 'Tube' },
  { name: 'Juliette' },
  { name: 'Liquide de rinçage' },
  { name: 'Multi usage' },
  { name: 'Spray' },
  { name: 'Capsules' }
]

const initialBrands = [
  { name: 'Petit Marseillais' },
  { name: 'Signal' },
  { name: 'Ultra doux' },
  { name: 'Sun' },
  { name: "L'arbre vert" },
  { name: 'Mr Propre' },
  { name: 'Narta' },
  { name: 'Dash' },
  { name: 'Apta' }
]

const initialProducts = [
  {
    rayon: 'Salle de bain',
    category: 'Gel douche',
    brand: 'Petit Marseillais',
    conditionnement: '250 ml',
    quantite: 15,
    barcodes: ['3574661198033', '3574661198040']
  },
  {
    rayon: 'Salle de bain',
    category: 'Dentifrice',
    subCategory: 'Tube',
    brand: 'Signal',
    conditionnement: '75 ml',
    quantite: 8,
    barcodes: ['8717163702468']
  },
  {
    rayon: 'Salle de bain',
    category: 'Shampoing',
    subCategory: 'Juliette',
    brand: 'Ultra doux',
    conditionnement: '300 ml',
    quantite: 3,
    barcodes: ['3600541954649']
  },
  {
    rayon: 'Cuisine',
    category: 'Lave vaisselle',
    subCategory: 'Liquide de rinçage',
    brand: 'Sun',
    conditionnement: '500 ml',
    quantite: 2,
    barcodes: ['8710908641015']
  },
  {
    rayon: 'Cuisine',
    category: 'Produit vaisselle',
    brand: "L'arbre vert",
    conditionnement: '500 ml',
    quantite: 4,
    barcodes: ['3450601032516']
  },
  {
    rayon: 'Nettoyage',
    category: 'Spray',
    subCategory: 'Multi usage',
    brand: 'Mr Propre',
    conditionnement: '750 ml',
    quantite: 1,
    barcodes: ['5410076769384']
  },
  {
    rayon: 'Salle de bain',
    category: 'Déodorant',
    subCategory: 'Spray',
    brand: 'Narta',
    conditionnement: '200 ml',
    quantite: 2,
    barcodes: ['3600550223434']
  },
  {
    rayon: 'Linge',
    category: 'Lessive',
    subCategory: 'Capsules',
    brand: 'Dash',
    conditionnement: '24 doses',
    quantite: 1,
    barcodes: ['8001841661117']
  },
  {
    rayon: 'Nettoyage',
    category: 'Sac poubelle',
    brand: 'Apta',
    conditionnement: '20 L',
    quantite: 5,
    barcodes: ['3257983276521']
  },
  {
    rayon: 'Salle de bain',
    category: 'Brosse à dent',
    brand: 'Signal',
    conditionnement: 'Medium',
    quantite: 3,
    barcodes: ['8717163702123']
  }
]

async function main() {
  console.log('Start seeding...')

  // Create categories
  const categories = {}
  for (const categoryData of initialCategories) {
    const category = await prisma.category.create({
      data: categoryData
    })
    categories[category.name] = category.id
  }

  // Create subcategories
  const subCategories = {}
  for (const subCategoryData of initialSubCategories) {
    const subCategory = await prisma.subCategory.create({
      data: subCategoryData
    })
    subCategories[subCategory.name] = subCategory.id
  }

  // Create brands
  const brands = {}
  for (const brandData of initialBrands) {
    const brand = await prisma.brand.create({
      data: brandData
    })
    brands[brand.name] = brand.id
  }

  // Create products with relationships
  for (const productData of initialProducts) {
    const { barcodes, category, subCategory, brand, ...rest } = productData
    const createdProduct = await prisma.product.create({
      data: {
        ...rest,
        categoryId: categories[category],
        subCategoryId: subCategory ? subCategories[subCategory] : null,
        brandId: brand ? brands[brand] : null,
        barcodes: {
          create: barcodes.map(code => ({ code }))
        }
      }
    })
    console.log(`Created product with ID: ${createdProduct.id}`)
  }

  console.log('Seeding finished')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
