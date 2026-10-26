// =============================================================================
// blockchain.js
// -----------------------------------------------------------------------------
// Implémentation de la blockchain décrite dans le mémoire
// « La technologie blockchain pour la sécurisation des transactions bancaires ».
//
// La classe Blockchain reproduit les méthodes présentées dans le mémoire :
//   - createNewBlock       : crée et ajoute un nouveau bloc à la chaîne
//   - createNewTransaction : crée une nouvelle transaction (en attente)
//   - getLastBlock         : renvoie le dernier bloc de la chaîne
//   - hashBlock            : calcule l'empreinte SHA-256 d'un bloc
//   - proofOfWork          : trouve le "nonce" (preuve de travail)
//   - chainIsValid         : vérifie que la chaîne n'a pas été falsifiée
//
// La sécurité vient de deux idées :
//   1. Chaque bloc contient le hachage du bloc précédent. Si on modifie un
//      ancien bloc, tous les hachages suivants deviennent faux : la fraude
//      est immédiatement détectable.
//   2. La preuve de travail rend la création d'un bloc coûteuse en calcul, ce
//      qui empêche de réécrire l'historique facilement.
// =============================================================================

const sha256 = require("sha256");   // bibliothèque de hachage SHA-256

class Blockchain {
    constructor() {
        this.chain = [];                 // la chaîne de blocs
        this.pendingTransactions = [];   // transactions en attente d'être minées

        // Le tout premier bloc, appelé "Genesis Block", est créé au démarrage.
        // Ses valeurs sont arbitraires car il n'a pas de bloc précédent.
        this.createNewBlock(100, "0", "0");
    }

    // -------------------------------------------------------------------------
    // Crée un nouveau bloc, y place les transactions en attente, puis l'ajoute
    // à la chaîne. Renvoie le bloc créé.
    //   nonce             : la preuve de travail trouvée pour ce bloc
    //   previousBlockHash : le hachage du bloc précédent
    //   hash              : le hachage de ce bloc
    // -------------------------------------------------------------------------
    createNewBlock(nonce, previousBlockHash, hash) {
        const newBlock = {
            index: this.chain.length + 1,          // numéro du bloc
            timestamp: Date.now(),                 // date/heure de création
            transactions: this.pendingTransactions, // transactions incluses
            nonce: nonce,                          // preuve de travail
            hash: hash,                            // empreinte de ce bloc
            previousBlockHash: previousBlockHash,  // empreinte du bloc précédent
        };

        this.pendingTransactions = [];   // on vide la liste d'attente
        this.chain.push(newBlock);       // on ajoute le bloc à la chaîne
        return newBlock;
    }

    // -------------------------------------------------------------------------
    // Renvoie le dernier bloc de la chaîne.
    // -------------------------------------------------------------------------
    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    // -------------------------------------------------------------------------
    // Crée une nouvelle transaction et la met EN ATTENTE. Elle ne sera inscrite
    // dans la blockchain qu'au prochain bloc miné.
    //   amount    : montant de la transaction
    //   sender    : émetteur (numéro de compte, par exemple)
    //   recipient : destinataire
    // Renvoie l'index du bloc qui contiendra cette transaction.
    // -------------------------------------------------------------------------
    createNewTransaction(amount, sender, recipient) {
        const newTransaction = {
            amount: amount,
            sender: sender,
            recipient: recipient,
        };

        this.pendingTransactions.push(newTransaction);
        return this.getLastBlock().index + 1;
    }

    // -------------------------------------------------------------------------
    // Calcule le hachage SHA-256 d'un bloc à partir de :
    //   - le hachage du bloc précédent,
    //   - les données du bloc courant (transactions),
    //   - le nonce.
    // Le résultat est une empreinte unique : la moindre modification d'une
    // donnée change complètement le hachage.
    // -------------------------------------------------------------------------
    hashBlock(previousBlockHash, currentBlockData, nonce) {
        const dataAsString =
            previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
        return sha256(dataAsString);
    }

    // -------------------------------------------------------------------------
    // Preuve de travail (Proof of Work).
    // On essaie des nonces (0, 1, 2, 3, ...) jusqu'à obtenir un hachage qui
    // commence par "0000". Trouver un tel nonce demande beaucoup d'essais,
    // donc du temps de calcul : c'est ce qui sécurise la chaîne.
    // Renvoie le nonce valide trouvé.
    // -------------------------------------------------------------------------
    proofOfWork(previousBlockHash, currentBlockData) {
        let nonce = 0;
        let hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
        while (hash.substring(0, 4) !== "0000") {
            nonce++;
            hash = this.hashBlock(previousBlockHash, currentBlockData, nonce);
        }
        return nonce;
    }

    // -------------------------------------------------------------------------
    // Vérifie que la chaîne est valide (non falsifiée). Pour chaque bloc :
    //   - son "previousBlockHash" doit correspondre au hachage du bloc d'avant ;
    //   - son propre hachage recalculé doit commencer par "0000".
    // Renvoie true si tout est cohérent, false sinon.
    // C'est cette méthode qui détecte une fraude dans l'historique.
    // -------------------------------------------------------------------------
    chainIsValid(blockchain) {
        for (let i = 1; i < blockchain.length; i++) {
            const currentBlock = blockchain[i];
            const previousBlock = blockchain[i - 1];

            // Le lien avec le bloc précédent est-il intact ?
            if (currentBlock.previousBlockHash !== previousBlock.hash) {
                return false;
            }

            // Le hachage du bloc est-il valide (preuve de travail) ?
            const blockHash = this.hashBlock(
                previousBlock.hash,
                { transactions: currentBlock.transactions, index: currentBlock.index },
                currentBlock.nonce
            );
            if (blockHash.substring(0, 4) !== "0000") {
                return false;
            }
        }

        // Vérification du bloc Genesis (valeurs fixées au démarrage).
        const genesis = blockchain[0];
        const genesisOk =
            genesis.nonce === 100 &&
            genesis.previousBlockHash === "0" &&
            genesis.hash === "0";

        return genesisOk;
    }
}

module.exports = Blockchain;
