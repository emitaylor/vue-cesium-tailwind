const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware pour servir les fichiers statiques (facultatif)
app.use(express.static('public'));

// Point de terminaison pour renvoyer les données des drones
app.get('/api/drones', (req, res) => {
  fs.readFile(path.join(__dirname, 'data', 'drones.json'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read data' });
    }
    res.json(JSON.parse(data)); // Envoi de la réponse JSON
  });
});

// Écoute sur le port spécifié
app.listen(port, () => {
  console.log(`API listening at http://localhost:${port}`);
});