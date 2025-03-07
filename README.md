# TD-ArchiWeb

Pour ce TD, vous allez devoir réaliser une application web simple, qui permet de gérer une liste de recettes. Vous allez devoir réaliser cette application en utilisant une des architectures que nous avons vu en cours.

Elle se basera sur une API REST qui permettra de gérer les recettes. Vous devrez réaliser une interface web qui permettra d'interagir avec cette API.

- API : https://gourmet.cours.quimerch.com (elle fournit aussi une interface utilisateur et des routes admin, mais vous n'avez pas besoin de les utiliser)
- OpenAPI (description des routes existantes et disponibles) : https://gourmet.cours.quimerch.com/swagger/index.html

### Fonctionnalités demandées

- PAGE `/` : Afficher la liste des recettes disponibles
- PAGE `/recettes/{recetteID}` : Afficher une recette en particulier
- Se connecter avec son compte utilisateur (un user/mdp vous sera donné)
- Se déconnecter de son compte utilisateur
- Ajouter une recette à ses favoris
- Supprimer une recette de ses favoris
- PAGE `/favorites` Voir la liste de ses recettes favorites

### Contraintes

- Utiliser Docker pour déployer votre application
- Utiliser Git pour versionner votre code
- Utiliser une des architectures vues en cours
  - **Recommendé**
    - React (Dockerfile fourni)
    - Next.js (Dockerfile fourni)
    - Astro (Dockerfile fourni)
  - Je peux **aussi** vous noter sur les technologies suivantes. Cependant, je ne pourrai pas vous aider si vous avez des problèmes avec celles-ci, et je ne fournirai pas de Dockerfile. C'est à vos risques et périls!
    - Vue / Nuxt
    - Svelte / SvelteKit
    - Templating (Django, Go, Ruby on Rails, PHP)

### Évaluation

- 20% Répondre aux exigences (features demandées, pas de crashs)
- 10% Bonne UX/UI
- 10% Code de qualité
- 20% Performance
- 20% Sécurité
- 20% Pratiques professionnelles (tests, CI/CD, documentation, etc...)

Toute initiative est la bienvenue, tant que les fonctionnalités demandées sont bien implémentées. Si vous avez des idées pour améliorer l'application, n'hésitez pas à les implémenter!
