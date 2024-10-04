// Utiliser 'import' au lieu de 'require'
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // Pour obtenir le chemin du fichier actuel
import { dirname } from 'path'; // Pour obtenir le répertoire du fichier actuel

const __filename = fileURLToPath(import.meta.url); // Obtenir le chemin du fichier actuel
const __dirname = dirname(__filename); // Obtenir le répertoire du fichier actuel

const app = express();
const port = 3000;

// Middleware pour servir les fichiers statiques (facultatif)
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Changez le chemin si nécessaire
});

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
