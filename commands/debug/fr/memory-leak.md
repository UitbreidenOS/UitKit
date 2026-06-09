---
description: Diagnostiquer et localiser une fuite mémoire en fonction d'une description de symptômes ou d'un chemin de code
argument-hint: "[symptom description, file, or function name]"
---
Enquêter sur une fuite mémoire en fonction de : $ARGUMENTS

Travaillez systématiquement. Ne devinez pas — tracez les chemins d'allocation.

1. **Établir la signature de la fuite**
   - L'utilisation du tas augmente-t-elle sans limites, ou s'agit-il d'une augmentation unique qui ne se libère jamais ?
   - La fuite concerne-t-elle l'ensemble du processus ou est-elle isolée à un sous-système (par exemple, un gestionnaire de requête, un thread de travail) ?
   - Notez le langage/runtime — les langages avec GC (JS, Python, Go, JVM) ont des fuites différentes des langages à mémoire manuelle (C, C++, Rust unsafe).

2. **Identifier les sites candidats** — scannez le chemin de code dans $ARGUMENTS pour :
   - Collections longues durées (caches, registres, cartes de écouteurs d'événements) qui croissent sans éviction
   - Fermetures ou lambdas capturant de grands objets qui survivent à leur portée utile
   - Références circulaires qui contournent les GC par comptage de références (Python, Swift, ObjC)
   - Finaliseurs ou destructeurs jamais appelés (handles de ressources, descripteurs de fichiers, sockets)
   - État `static` ou au niveau du module accumulé à travers les requêtes/appels
   - Buffers ou streams alloués mais jamais fermés/drainés

3. **Instrumenter pour vérification** — avant de prétendre que c'est corrigé :
   - Ajoutez un snapshot de tas ou un compteur d'allocation au site suspect
   - Écrivez une boucle qui exerce le chemin suspect N fois et affirmez que la croissance du tas est limitée
   - Dans les langages avec GC, forcez une collection avant de mesurer pour éviter les faux positifs

4. **Localiser la référence retenue** — suivez la chaîne de références de l'objet fuyard jusqu'à une racine GC :
   - Qu'est-ce qui maintient une référence à l'objet fuyard ?
   - Est-ce intentionnel (cache) ou involontaire (écouteur oublié, fermeture obsolète) ?

5. **Proposer la correction** — une fois que vous avez la référence retenue :
   - Cache limité avec éviction LRU/TTL
   - Appel de désenregistrement/nettoyage explicite dans un finally/defer/destructeur
   - WeakRef ou WeakMap où la propriété forte n'est pas nécessaire
   - Réduction de portée pour que l'objet soit libéré à la fin du bloc

6. **Écrire un test de régression** — un test qui alloue/libère N fois et affirme que le pic de RSS ou le nombre d'objets reste plat. Les tests de fuite instables sont pires que rien ; rendez-le déterministe.

Résultat : le(s) site(s) de fuite suspect(s) avec les références fichier:ligne, la chaîne de références retenue,
et la correction proposée. Si vous ne pouvez pas confirmer sans exécuter le code, dites-le explicitement.
