// =============================================================================
// test.js
// -----------------------------------------------------------------------------
// Petit programme de démonstration, dans l'esprit du fichier test.js du
// mémoire. Il crée une blockchain, ajoute des transactions, mine des blocs,
// puis vérifie la validité de la chaîne et montre comment une fraude est
// détectée.
//
// Exécution :  node test.js
// =============================================================================

const Blockchain = require("./blockchain");

const bitcoin = new Blockchain();

console.log("=== 1. Bloc Genesis créé automatiquement ===");
console.log(bitcoin.getLastBlock());

console.log("\n=== 2. Création de transactions bancaires ===");
bitcoin.createNewTransaction(500, "COMPTE_ALICE", "COMPTE_BOB");
bitcoin.createNewTransaction(120, "COMPTE_BOB", "COMPTE_CARINE");
console.log("Transactions en attente :", bitcoin.pendingTransactions);

console.log("\n=== 3. Minage d'un bloc (preuve de travail) ===");
let last = bitcoin.getLastBlock();
let data = { transactions: bitcoin.pendingTransactions, index: last.index + 1 };
let nonce = bitcoin.proofOfWork(last.hash, data);
let hash = bitcoin.hashBlock(last.hash, data, nonce);
let bloc = bitcoin.createNewBlock(nonce, last.hash, hash);
console.log("Nonce trouvé :", nonce);
console.log("Nouveau bloc :", bloc);

console.log("\n=== 4. La chaîne est-elle valide ? ===");
console.log("Validité :", bitcoin.chainIsValid(bitcoin.chain));

console.log("\n=== 5. Tentative de FRAUDE : on modifie une transaction passée ===");
// Un fraudeur change le montant d'une transaction déjà enregistrée.
bitcoin.chain[1].transactions[0].amount = 999999;
console.log("Montant falsifié dans le bloc 2.");
console.log("Validité après fraude :", bitcoin.chainIsValid(bitcoin.chain));
console.log("=> La blockchain détecte la falsification (validité = false).");
