# Rick & Morty Explorer

Application Angular 21 (SPA) pour explorer l'univers **Rick & Morty** via l'API officielle [rickandmortyapi.com](https://rickandmortyapi.com).

## Lancer le projet

```bash
npm install
npm start
```

Ouvrir [http://localhost:4200](http://localhost:4200).

Build production : `npm run build`

## Fonctionnalités réalisées

- [x] **5 modèles** (`models/`) : Info, ApiResponse, Character, Location, Episode
- [x] **5 services** (`services/`) : Character, Location, Episode, Favoris, Storage (+ Stats pour le dashboard)
- [x] **10 pages** avec routes, relations entre ressources, lazy loading (`favoris`, `contact`), page 404
- [x] **5 composants dumb** : CharacterCard, SearchBar, Paginator, Loader, ErrorMessage
- [x] **2 pipes** : Status, Truncate
- [x] Recherche RxJS (`debounceTime`, `distinctUntilChanged`, `switchMap`) + filtre statut
- [x] Pagination sur les 3 listes
- [x] Favoris persistants (`localStorage` via `StorageService`)
- [x] Dashboard avec `computed` (totaux API + favoris par statut)
- [x] Formulaire de contact réactif avec validateurs
- [x] `OnPush` sur composants dumb et pages liste/détail
- [x] `withComponentInputBinding()` + `input.required()` sur les pages détail
- [x] **Bonus GraphQL** : liste des personnages via Apollo (`CharacterGraphqlService`)

## Structure du projet

```
src/
├── environments/          # URLs API REST + GraphQL
└── app/
    ├── models/
    ├── services/
    ├── graphql/
    ├── components/
    ├── pages/
    ├── pipes/
    ├── utils/
    ├── app.routes.ts
    └── app.config.ts
```

## Design patterns utilisés

| Pattern | Où | Pourquoi |
|---------|-----|----------|
| **Singleton** | `providedIn: 'root'` sur les services | Une seule instance partagée (ex. `CharacterService`) |
| **Smart / Dumb** | Pages vs `CharacterCardComponent` | La page charge les données ; la carte affiche et émet des événements |
| **Observer** | RxJS + `async` pipe | Flux HTTP réactifs sans `subscribe()` manuel dans les templates |
| **State local réactif** | `signal` / `computed` dans `FavorisService` | État favoris simple et performant |
| **Lazy loading** | Routes `favoris` et `contact` | Réduit le bundle initial |
| **Repository-like** | Services HTTP | Centralise les appels API, aucun HTTP dans les composants |

## GraphQL vs REST (bonus)

La liste **Personnages** utilise GraphQL (`CHARACTERS_QUERY`) pour récupérer en **un seul appel** : pagination, filtre nom/statut, et pour chaque personnage le **lieu** et les **épisodes**.

En REST, il faudrait : `GET /character` puis, pour chaque fiche détail, des appels supplémentaires vers `/location/:id` et `/episode/:id,...` (under-fetching). GraphQL permet de demander exactement les champs nécessaires à l'écran.

Configuration : `provideApollo` + `InMemoryCache` dans `app.config.ts`, URI = `environment.graphqlUrl`.

## Captures d'écran

Placez vos captures dans le dossier `screenshots/` :

- `01-characters-list.png` … `10-arborescence.png`
- `11-graphql.png` (bonus)

## Réponses aux questions (soutenance)

### 1. Composant smart vs dumb ?

Un composant **smart** gère la logique (services, état, routing) : ex. `CharactersListComponent` qui appelle `CharacterGraphqlService` et gère la pagination. Un composant **dumb** reçoit des `input()`, émet des `output()` et affiche : ex. `CharacterCardComponent` qui affiche un personnage et émet `toggleFavori` sans appeler l'API.

### 2. Pourquoi OnPush ? Lien avec l'immutabilité ?

`OnPush` ne vérifie le template que si les `@Input` changent, un événement se produit, ou un signal lié change. On évite des re-rendus inutiles. Cela fonctionne bien quand on passe de **nouvelles références** (objets/tableaux immuables) plutôt que de muter les mêmes objets en place.

### 3. Pourquoi le pipe async plutôt qu'un subscribe() ?

Le `async` pipe s'abonne et **se désabonne automatiquement** à la destruction du composant. Un `subscribe()` oublié provoque des fuites mémoire et des mises à jour sur un composant déjà détruit.

### 4. `providedIn: 'root'` : quel pattern ? Combien d'instances ?

C'est le pattern **Singleton** : Angular crée **une seule instance** de `CharacterService` pour toute l'application.

### 5. Signal vs BehaviorSubject pour les favoris ?

Un **signal** est intégré au cycle Angular, lisible dans les templates/computed, sans RxJS pour un état local simple. Un **BehaviorSubject** convient aux flux asynchrones multi-abonnés ; ici la liste de favoris est un état synchrone persisté → signal + `computed` est plus direct.

### 6. Pourquoi switchMap ? Rôle de debounceTime ?

`switchMap` **annule** la requête précédente si l'utilisateur tape encore (évite les résultats obsolètes). `mergeMap` lancerait plusieurs requêtes en parallèle. `debounceTime(300)` attend 300 ms après la dernière frappe avant de chercher, pour ne pas surcharger l'API.

### 7. Reactive Forms vs Template-driven ?

Le TP impose le **réactif** car la validation est définie en TypeScript (`Validators`), testable, et le bouton *Envoyer* se lie proprement à `form.invalid` — idéal pour des règles précises (minLength, email).

### 8. Relations via les URLs ?

Les champs `episode`, `residents`, `characters` sont des **URLs**. On extrait l'id avec `url.split('/').filter(Boolean).pop()` (voir `extractIdFromUrl`), puis on appelle `getMany(ids)` sur le service concerné.

### 9. Lazy loading `favoris` et `contact` ?

Ces pages sont chargées **à la demande** (chunks séparés). L'utilisateur qui ne va pas sur Contact ou Favoris télécharge moins de JavaScript au démarrage → démarrage plus rapide.

### 10. (Bonus) GraphQL vs REST avec notre requête

Notre requête `characters { results { location { id name } episode { id name } } }` renvoie personnages **avec** lieu et épisodes en un aller-retour. En REST, la liste `/character` ne contient que des URLs d'épisodes ; il faudrait des appels `getMany` supplémentaires pour afficher les noms sur une vue enrichie.

---

**Auteur** : GERARD Sébastien  
**Angular** : 21.x  
**API** : [Rick and Morty API](https://rickandmortyapi.com)
# TP-PROJET-Rick-Morty-Explorer
