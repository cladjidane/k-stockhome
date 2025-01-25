export const PRODUCT_CATEGORIES = {
  SALLE_DE_BAIN: 'Salle de bain',
  LINGE: 'Linge',
  CUISINE: 'Cuisine',
  NETTOYAGE: 'Nettoyage'
}

export const SUBCATEGORIES = {
  [PRODUCT_CATEGORIES.SALLE_DE_BAIN]: {
    GEL_DOUCHE: 'Gel douche',
    DENTIFRICE: 'Dentifrice',
    SHAMPOOING: 'Shampoing',
    PROTEGES_SLIPS: 'Protèges slips',
    DEODORANT: 'Déodorant',
    MASQUE: 'Masque',
    BB_CREME: 'BB crème',
    SERVIETTE: 'Serviette',
    TAMPAX: 'Tampax',
    BROSSE_A_DENT: 'Brosse à dent',
    EAU_MICELLAIRE: 'Eau micellaire',
    LAIT_DE_CORPS: 'Lait de corps'
  },
  [PRODUCT_CATEGORIES.LINGE]: {
    LESSIVE: 'Lessive'
  },
  [PRODUCT_CATEGORIES.CUISINE]: {
    LAVE_VAISSELLE: 'Lave vaisselle',
    PRODUIT_VAISSELLE: 'Produit vaisselle'
  },
  [PRODUCT_CATEGORIES.NETTOYAGE]: {
    SPRAY: 'Spray',
    CLIP_WC: 'Clip wc',
    EPONGE: 'Eponge',
    SAC_POUBELLE: 'Sac poubelle'
  }
}


export const PRODUCT_VARIANTS = {
  // Types spécifiques
  TUBE: 'Tube',
  JULIETTE: 'Juliette',
  MYA: 'Mya',
  FABIEN: 'Fabien',
  SPRAY: 'Spray',
  STICK: 'Stick',
  CHEVEUX: 'Cheveux',
  ROSE_T3: 'Rose T3',
  VERTE_T1: 'Verte T1',
  SUPER: 'Super',
  MEDIUM: 'Medium',
  NOIX_DE_COCO: 'Noix de coco',
  DOSES: 'Doses',
  LIQUIDE: 'Liquide',
  LIQUIDE_DE_RINCAGE: 'Liquide de rinçage',
  NETTOYANT: 'Nettoyant',
  CAPSULES: 'Capsules',
  MULTI_USAGE: 'Multi usage',
  DESINFECTANT: 'Désinfectant'
}

export const BRANDS = {
  PETIT_MARSEILLAIS: 'Petit Marseillais',
  SIGNAL: 'Signal',
  ULTRA_DOUX: 'Ultra doux',
  ELSEVE: 'Elsève',
  HEAD_AND_SHOULDERS: 'Head&Shoulders',
  VANIA: 'Vania',
  DOVE: 'Dove',
  NARTA: 'Narta',
  GARNIER: 'Garnier',
  ALWAYS: 'Always',
  TAMPAX: 'Tampax',
  NIVEA: 'Nivea',
  LARBRE_VERT: "L'arbre vert",
  DASH: 'Dash',
  ARIEN: 'Arien',
  SUN: 'Sun',
  FINISH: 'Finish',
  MR_PROPRE: 'Mr Propre',
  WC_NET: 'WC net',
  SPONTEX: 'Spontex',
  APTA: 'Apta'
}

/**
 * @typedef {Object} Product
 * @property {string} id - Identifiant unique du produit
 * @property {string} rayon - Rayon du produit (PRODUCT_CATEGORIES)
 * @property {string} categorie - Catégorie du produit (SUBCATEGORIES)
 * @property {string} [sousCategorie] - Sous-catégorie optionnelle du produit (PRODUCT_VARIANTS)
 * @property {string} marque - Marque du produit (BRANDS)
 * @property {string} [conditionnement] - Format du produit (ex: "250 ml", "56", "24 doses")
 * @property {number} quantite - Quantité en stock
 * @property {string} codebar - Code-barres du produit
 */

export const DEFAULT_PRODUCT = {
  rayon: PRODUCT_CATEGORIES.SALLE_DE_BAIN,
  category: '',
  subCategory: '',
  brand: '',
  conditionnement: '',
  quantite: 0,
  barcodes: [],
  codebar: ''
}
