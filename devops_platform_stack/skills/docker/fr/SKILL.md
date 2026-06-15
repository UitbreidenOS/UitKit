# Optimisation Docker

## Quand activer

Construire des images de conteneurs, réduire la taille de l'image ou optimiser le comportement d'exécution des conteneurs.

## Quand ne pas utiliser

Pour l'orchestration ou le déploiement multi-conteneur — utilisez plutôt la compétence kubernetes-deployment.

## Instructions

1. Examinez le Dockerfile pour détecter les inefficacités de couches
2. Suggérez des constructions multi-étapes et des stratégies de mise en cache
3. Exécutez des analyses de sécurité sur les images
4. Validez la configuration d'exécution

## Exemple

Réduisez l'image d'application de 800 Mo à 120 Mo en utilisant une base distroless et une consolidation de couches.
