# 🚀 Lancer le projet (Carnet de contacts)

L'erreur **« Impossible de charger (json-server est-il lancé sur :3000 ?) »**
signifie que l'application Angular tourne, mais que l'**API n'est pas démarrée**.
Il faut **deux terminaux** lancés en même temps.

## 1️⃣ Terminal 1 — l'API (json-server)

À la racine du dossier `TP4 CRUD API` (là où se trouve `db.json`) :

```bash
npm run api
```

> Équivaut à `npx json-server db.json`.
> ✅ L'API tourne sur **http://localhost:3000**.
> Teste dans le navigateur : http://localhost:3000/contacts → tu dois voir les contacts en JSON.

⚠️ **Garde ce terminal ouvert** pendant toute la durée d'utilisation.

## 2️⃣ Terminal 2 — l'application Angular

Dans un **second** terminal, au même endroit :

```bash
npm start
```

> ✅ L'app tourne sur **http://localhost:4200**.

## ✅ Vérifier que tout fonctionne

1. Ouvre http://localhost:4200 → la liste des contacts se charge (GET).
2. Ajoute un contact → il apparaît (POST).
3. Clique ✏️ → modifie → « Mettre à jour » (PUT).
4. Clique 🗑️ → confirme → il disparaît (DELETE).
5. Rafraîchis la page → les changements ont persisté dans `db.json`. 🎉

## 🩺 En cas de souci

- **L'erreur revient ?** Vérifie que le Terminal 1 (json-server) est toujours actif.
- **Port 3000 déjà pris ?** Lance `npx json-server db.json --port 3001` et change l'URL
  dans `src/app/services/contact.ts` (`private url = 'http://localhost:3001/contacts'`).
- **`npx` demande d'installer json-server ?** Réponds `y` (oui), c'est normal au 1er lancement.
