# Mettre ce dossier en ligne sur GitHub — guide pas à pas

Même méthode que pour votre dépôt `pqc-wifi-benchmark` : la plus simple est le
**glisser-déposer** sur le site GitHub, sans ligne de commande.

---

## Étape 1 — Créer le dépôt

1. Sur <https://github.com>, en haut à droite : **+** → **New repository**.
2. **Repository name** : `blockchain-banque`
3. **Description** : *Blockchain pour la sécurisation des transactions bancaires (mémoire de master, Node.js)*
4. Cochez **Public**. Ne cochez rien d'autre.
5. **Create repository**.

---

## Étape 2 — IMPORTANT : ne pas envoyer le dossier `node_modules`

Avant d'envoyer, **supprimez le dossier `node_modules`** s'il existe dans votre
copie : il est lourd, inutile à partager, et se réinstalle tout seul avec
`npm install`. Le fichier `.gitignore` est là pour l'exclure, mais si vous
faites un glisser-déposer manuel, évitez simplement de le sélectionner.

Les fichiers à envoyer sont : `README.md`, `LICENSE`, `package.json`,
`.gitignore`, et les dossiers `src` et `docs`.

---

## Étape 3 — Envoyer les fichiers

1. Sur la page du dépôt vide, cliquez sur le lien
   **« uploading an existing file »** (ou **« en télécharger un fichier existant »**).
2. Glissez les fichiers de la racine (`README.md`, `LICENSE`, `package.json`,
   `.gitignore`) **et** les dossiers `src` et `docs`.
3. Attendez que la liste s'affiche, puis cliquez en bas sur **Commit changes**.

---

## Étape 4 — Vérifier

Rechargez la page : vous devez voir les fichiers, les dossiers `src` et `docs`,
et le README affiché en bas. Votre lien à partager :

```
https://github.com/VOTRE-COMPTE/blockchain-banque
```

---

## Pour mettre à jour plus tard

Bouton **Add file → Upload files**, glissez les fichiers modifiés, puis
**Commit changes**. (Ou, si vous utilisez Git en ligne de commande :
`git add .` puis `git commit -m "..."` puis `git push`.)

---

## Conseil

Dans votre CV, vous pouvez présenter ce projet ainsi :
*« Blockchain à preuve de travail pour la sécurisation de transactions bancaires
(Node.js, Express, SHA-256) — https://github.com/VOTRE-COMPTE/blockchain-banque »*.
