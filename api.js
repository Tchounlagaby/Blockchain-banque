// =============================================================================
// api.js
// -----------------------------------------------------------------------------
// Serveur web (API REST) construit avec Express.js, comme décrit dans le
// mémoire. Il expose la blockchain à travers des "endpoints" que l'on peut
// appeler avec un navigateur ou avec Postman.
//
// Endpoints disponibles :
//   GET  /blockchain    -> renvoie toute la chaîne et les transactions en attente
//   POST /transaction   -> ajoute une nouvelle transaction (amount, sender, recipient)
//   GET  /mine          -> mine un nouveau bloc (exécute la preuve de travail)
//   GET  /valid         -> vérifie que la chaîne n'a pas été falsifiée
//
// Démarrage :  node api.js      puis ouvrir http://localhost:3000/blockchain
// =============================================================================

const express = require("express");
const Blockchain = require("./blockchain");

const app = express();
app.use(express.json());   // pour lire le corps JSON des requêtes POST

const PORT = process.env.PORT || 3000;

// On crée une instance de notre blockchain (avec son bloc Genesis).
const bitcoin = new Blockchain();

// -----------------------------------------------------------------------------
// GET /blockchain : renvoie l'intégralité de la chaîne.
// -----------------------------------------------------------------------------
app.get("/blockchain", (req, res) => {
    res.json(bitcoin);
});

// -----------------------------------------------------------------------------
// POST /transaction : ajoute une transaction en attente.
// Corps attendu (JSON) : { "amount": 500, "sender": "COMPTE_A", "recipient": "COMPTE_B" }
// -----------------------------------------------------------------------------
app.post("/transaction", (req, res) => {
    const { amount, sender, recipient } = req.body;
    if (amount === undefined || !sender || !recipient) {
        return res.status(400).json({
            note: "Champs requis : amount, sender, recipient.",
        });
    }
    const blockIndex = bitcoin.createNewTransaction(amount, sender, recipient);
    res.json({ note: `Transaction ajoutée. Elle sera incluse dans le bloc ${blockIndex}.` });
});

// -----------------------------------------------------------------------------
// GET /mine : crée un nouveau bloc.
// On récupère le dernier bloc, on calcule la preuve de travail, puis le
// hachage, et on ajoute le nouveau bloc à la chaîne.
// -----------------------------------------------------------------------------
app.get("/mine", (req, res) => {
    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock.hash;

    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock.index + 1,
    };

    // Preuve de travail : on cherche le nonce valide (peut prendre un instant).
    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

    res.json({ note: "Nouveau bloc miné avec succès.", block: newBlock });
});

// -----------------------------------------------------------------------------
// GET /valid : vérifie l'intégrité de la chaîne.
// -----------------------------------------------------------------------------
app.get("/valid", (req, res) => {
    const valide = bitcoin.chainIsValid(bitcoin.chain);
    res.json({
        note: valide
            ? "La chaîne est valide : aucune falsification détectée."
            : "ATTENTION : la chaîne n'est PAS valide (falsification détectée).",
        valide: valide,
    });
});

app.listen(PORT, () => {
    console.log(`Serveur blockchain démarré sur http://localhost:${PORT}`);
    console.log("Essayez :  http://localhost:" + PORT + "/blockchain");
});
