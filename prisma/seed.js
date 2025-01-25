import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const initialProducts = [
  {
    rayon: 'Salle de bain',
    categorie: 'Gel douche',
    marque: 'Petit Marseillais',
    conditionnement: '250 ml',
    quantite: 15,
    codebar: '11002200334'
  },
  {
    rayon: 'Salle de bain',
    categorie: 'Dentifrice',
    sousCategorie: 'Tube',
    marque: 'Signal',
    conditionnement: '75 ml',
    quantite: 8,
    codebar: '11002200334'
  },
  {
    rayon: 'Salle de bain',
    categorie: 'Shampoing',
    sousCategorie: 'Juliette',
    marque: 'Ultra doux',
    conditionnement: '300 ml',
    quantite: 3,
    codebar: '11002200334'
  },
  {
    rayon: 'Cuisine',
    categorie: 'Lave vaisselle',
    sousCategorie: 'Liquide de rinçage',
    marque: 'Sun',
    conditionnement: '500 ml',
    quantite: 2,
    codebar: '11002200334'
  },
  {
    rayon: 'Cuisine',
    categorie: 'Produit vaisselle',
    marque: "L'arbre vert",
    conditionnement: '500 ml',
    quantite: 4,
    codebar: '11002200334'
  },
  {
    rayon: 'Nettoyage',
    categorie: 'Spray',
    sousCategorie: 'Multi usage',
    marque: 'Mr Propre',
    conditionnement: '500 ml',
    quantite: 2,
    codebar: '11002200334'
  },
  {
    rayon: 'Nettoyage',
    categorie: 'Sac poubelle',
    marque: 'Apta',
    conditionnement: '30 l',
    quantite: 6,
    codebar: '11002200334'
  },
  {
    rayon: 'Linge',
    categorie: 'Lessive',
    sousCategorie: 'Doses',
    marque: "L'arbre vert",
    conditionnement: '24 doses',
    quantite: 1,
    codebar: '11002200334'
  }
]

async function main() {
  console.log('Start seeding...')
  
  // Supprimer toutes les données existantes
  await prisma.product.deleteMany()
  
  // Insérer les nouvelles données
  for (const product of initialProducts) {
    await prisma.product.create({
      data: product
    })
  }
  
  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
