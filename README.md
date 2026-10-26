# Blockchain pour la sécurisation des transactions bancaires

Implémentation du système décrit dans le mémoire de master
**« La technologie blockchain pour la sécurisation des transactions bancaires »**
(Institut Universitaire du Golfe de Guinée, Université de Douala).

Une blockchain simple, écrite en **Node.js** avec **Express.js**, qui montre
comment enregistrer des transactions bancaires de façon **infalsifiable** :
chaque bloc est lié au précédent par un hachage SHA-256, et la création d'un
bloc demande une **preuve de travail** (proof of work). Toute modification d'une
transaction passée est aussitôt détectée.

> Auteure : Gaby Béatrice Tchounla Nguenle — Université de Douala, Cameroun.

---

## 1. Ce que fait le programme

- **Créer des transactions** entre comptes (montant, émetteur, destinataire).
- **Miner des blocs** : regrouper les transactions en attente dans un bloc,
  calculer la preuve de travail, puis l'ajouter à la chaîne.
- **Vérifier l'intégrité** de la chaîne : détecter toute falsification.
- Le tout est accessible par une **API REST** (serveur web) testable avec un
  navigateur ou avec Postman.

---

## 2. Contenu du dépôt

```
blockchain-banque/
├── README.md
├── LICENSE
├── package.json          ← liste des dépendances (Express, sha256)
├── .gitignore
├── src/
│   ├── blockchain.js      ← la classe Blockchain (cœur du système)
│   ├── api.js             ← le serveur web (API REST)
│   └── test.js            ← démonstration : transactions, minage, détection de fraude
└── docs/
    └── GUIDE_GITHUB.md    ← comment mettre ce dossier en ligne sur GitHub
```

**Les méthodes de `blockchain.js`** (celles du mémoire) :

| Méthode | Rôle |
| --- | --- |
| `createNewBlock` | crée un nouveau bloc et l'ajoute à la chaîne |
| `createNewTransaction` | crée une transaction en attente |
| `getLastBlock` | renvoie le dernier bloc |
| `hashBlock` | calcule l'empreinte SHA-256 d'un bloc |
| `proofOfWork` | trouve le nonce (preuve de travail) |
| `chainIsValid` | vérifie que la chaîne n'a pas été falsifiée |

---

## 3. Installation

Nécessite **Node.js 18 ou plus** (<https://nodejs.org>).

```bash
git clone https://github.com/<votre-compte>/blockchain-banque.git
cd blockchain-banque
npm install            # installe Express et sha256
```

---

## 4. Utilisation

### 4.1 Démonstration rapide (sans serveur)

```bash
npm test          # équivaut à : node src/test.js
```

Ce script crée une blockchain, ajoute des transactions, mine un bloc, vérifie
la validité, **puis falsifie une transaction passée** et montre que la
blockchain le détecte (validité = false). C'est la démonstration clé du mémoire.

### 4.2 Lancer le serveur (API REST)

```bash
npm start         # équivaut à : node src/api.js
```

Le serveur démarre sur <http://localhost:3000>. Les endpoints :

| Méthode | URL | Rôle |
| --- | --- | --- |
| GET | `/blockchain` | afficher toute la chaîne |
| POST | `/transaction` | ajouter une transaction |
| GET | `/mine` | miner un nouveau bloc |
| GET | `/valid` | vérifier l'intégrité de la chaîne |

**Exemples avec Postman** (ou avec le navigateur pour les GET) :

- Ouvrir dans le navigateur : <http://localhost:3000/blockchain>
- Ajouter une transaction (POST sur `/transaction`), corps **JSON** :
  ```json
  { "amount": 500, "sender": "COMPTE_A", "recipient": "COMPTE_B" }
  ```
- Miner le bloc : <http://localhost:3000/mine>
- Vérifier : <http://localhost:3000/valid>

---

## 5. Comment la blockchain sécurise les transactions

1. **Chaînage par hachage.** Chaque bloc contient `previousBlockHash`,
   l'empreinte du bloc précédent. Modifier une transaction ancienne change son
   bloc, donc son hachage, donc le lien avec tous les blocs suivants : la chaîne
   devient invalide.
2. **Preuve de travail.** Pour qu'un bloc soit accepté, son hachage doit
   commencer par `0000`. Trouver le `nonce` qui donne ce résultat demande de
   nombreux essais (du temps de calcul). Réécrire l'historique obligerait à
   refaire ce travail pour tous les blocs : c'est pratiquement impossible.

C'est ce qui empêche le vol et la fraude dans le réseau bancaire étudié par le
mémoire.

---

## 6. Licence

Code publié sous licence **MIT** (voir `LICENSE`). Réutilisation et citation
libres. Merci de citer le mémoire associé.
