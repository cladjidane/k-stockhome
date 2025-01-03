export const availableLocations = [
  "Placard cuisine",
  "Réfrigérateur",
  "Congélateur",
  "Garde-manger",
  "Boîte à pain",
  "Tiroir cuisine",
  "Dépendance"
];

export const locationMapping: { [key: string]: string[] } = {
    divers: ["Dépendance"],
    frais: ["Réfrigérateur"],
    laitier: ["Réfrigérateur"],
    yaourt: ["Réfrigérateur"],
    fromage: ["Réfrigérateur"],
    surgelé: ["Congélateur"],
    glace: ["Congélateur"],
    conserve: ["Placard cuisine", "Garde-manger"],
    épicerie: ["Placard cuisine", "Garde-manger"],
    fruit: ["Réfrigérateur"],
    légume: ["Réfrigérateur"],
    boulangerie: ["Tiroir cuisine", "Boîte à pain"],
    pâtisserie: ["Tiroir cuisine"],
    boisson: ["Placard cuisine"],
    jus: ["Réfrigérateur"],
    bio: ["Placard cuisine"],
};

export const dietMapping: { [key: string]: string } = {
    vegan: "Convient aux végans",
    végétalien: "Convient aux végétaliens",
    végétarien: "Convient aux végétariens",
    "sans gluten": "Sans gluten",
    "sans lactose": "Sans lactose",
    "faible en sel": "Faible en sel",
    "sans sucre": "Sans sucre",
    bio: "Agriculture biologique",
};

export const allergenMapping: { [key: string]: string } = {
    gluten: "Contient du gluten",
    lactose: "Contient du lactose",
    arachide: "Contient des arachides",
    soja: "Contient du soja",
    "fruits à coque": "Contient des fruits à coque",
};

interface ProductInfo {
    location: string;
    dietInfo: string[];
    allergens: string[];
}

export const getProductInfo = (
    categories?: string,
    labels?: string,
): ProductInfo => {
    // Définir les valeurs par défaut
    const productInfo: ProductInfo = {
        location: "Placard cuisine",
        dietInfo: [],
        allergens: [],
    };

    // Traiter les catégories
    if (categories) {
        const categoryList = categories
            .replace(/\//g, ",")
            .split(",")
            .map((category) => category.trim().toLowerCase());

        // Déterminer la localisation
        for (const category of categoryList) {
            for (const [keyword, location] of Object.entries(locationMapping)) {
                if (category.includes(keyword)) {
                    productInfo.location = location;
                    break;
                }
            }
        }

        // Identifier les informations de régime
        for (const category of categoryList) {
            for (const [keyword, dietInfo] of Object.entries(dietMapping)) {
                if (category.includes(keyword)) {
                    productInfo.dietInfo.push(dietInfo);
                }
            }
        }

        // Identifier les allergènes
        for (const category of categoryList) {
            for (const [keyword, allergenInfo] of Object.entries(
                allergenMapping,
            )) {
                if (category.includes(keyword)) {
                    productInfo.allergens.push(allergenInfo);
                }
            }
        }
    }

    // Traiter les labels (optionnel)
    if (labels) {
        const labelList = labels
            .replace(/\//g, ",")
            .split(",")
            .map((label) => label.trim().toLowerCase());

        // Ajouter des informations de régime et d'allergènes depuis les labels
        for (const label of labelList) {
            for (const [keyword, dietInfo] of Object.entries(dietMapping)) {
                if (
                    label.includes(keyword) &&
                    !productInfo.dietInfo.includes(dietInfo)
                ) {
                    productInfo.dietInfo.push(dietInfo);
                }
            }
            for (const [keyword, allergenInfo] of Object.entries(
                allergenMapping,
            )) {
                if (
                    label.includes(keyword) &&
                    !productInfo.allergens.includes(allergenInfo)
                ) {
                    productInfo.allergens.push(allergenInfo);
                }
            }
        }
    }

    return productInfo;
};
