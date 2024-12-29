# Test des catégories de produits

## Données de test
Ajouter les produits suivants pour tester le groupement par catégories :

### Produits frais
1. Yaourt nature (Produits laitiers)
2. Steak haché (Viandes)
3. Salade (Fruits et légumes)

### Épicerie
1. Pâtes (Pâtes et riz)
2. Sauce tomate (Conserves)
3. Céréales (Petit-déjeuner)

### Boissons
1. Eau minérale (Eau)
2. Jus d'orange (Jus)

### Non alimentaire
1. Lessive (Entretien)
2. Savon (Hygiène)

## Scénarios de test

### 1. Groupement automatique
- [ ] Vérifier que chaque produit apparaît dans la bonne catégorie
- [ ] Vérifier que les compteurs de produits sont corrects
- [ ] Vérifier qu'aucun produit n'est manquant

### 2. Interface expansible
- [ ] Vérifier que chaque catégorie peut être réduite/expansée
- [ ] Vérifier que l'état expansé/réduit est conservé lors du défilement
- [ ] Vérifier que l'animation est fluide

### 3. Interaction avec les autres fonctionnalités
- [ ] Vérifier que l'alerte de stock bas fonctionne dans chaque catégorie
- [ ] Vérifier que l'ajout à la liste de courses fonctionne depuis n'importe quelle catégorie
- [ ] Vérifier que la mise à jour des quantités fonctionne correctement

### 4. Performance
- [ ] Vérifier que l'interface reste réactive avec plusieurs produits
- [ ] Vérifier que l'expansion/réduction est instantanée
- [ ] Vérifier que le chargement initial est rapide

## Instructions de test

1. Démarrer l'application
2. Ajouter les produits de test un par un
3. Vérifier le groupement automatique
4. Tester l'expansion/réduction de chaque catégorie
5. Tester les interactions (stock bas, liste de courses)
6. Noter tout comportement inattendu
