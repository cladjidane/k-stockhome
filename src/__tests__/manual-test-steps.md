# Test manuel des fonctionnalités de la liste de courses

## Scénario 1 : Alerte de stock bas
1. Ajouter un nouveau produit avec une quantité > 1
2. Diminuer la quantité jusqu'à 1
3. Vérifier que l'alerte apparaît
4. Vérifier que l'alerte est visuellement visible et compréhensible

## Scénario 2 : Ajout à la liste de courses
1. Cliquer sur le bouton "Ajouter à la liste de courses" dans l'alerte
2. Vérifier que le produit apparaît dans la liste de courses
3. Vérifier que la quantité par défaut est de 1
4. Essayer d'ajouter le même produit plusieurs fois
5. Vérifier que la quantité s'incrémente au lieu de créer des doublons

## Scénario 3 : Gestion de la liste de courses
1. Modifier la quantité d'un produit dans la liste
2. Vérifier que la mise à jour est instantanée
3. Diminuer la quantité à 0
4. Vérifier que le produit est automatiquement supprimé
5. Utiliser le bouton de suppression
6. Vérifier que le produit est bien retiré de la liste

## Scénario 4 : Persistance des données
1. Ajouter plusieurs produits à la liste de courses
2. Rafraîchir la page
3. Vérifier que la liste est conservée
4. Vérifier que les quantités sont correctes
5. Vérifier que les alertes de stock bas sont toujours présentes

## Scénario 5 : Interface utilisateur
1. Vérifier que le compteur d'articles est correct
2. Vérifier que l'interface est responsive
3. Vérifier que les animations et transitions sont fluides
4. Vérifier que les icônes et les couleurs sont cohérentes
