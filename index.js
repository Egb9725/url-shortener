/*------Importation des modules------ */
const express = require('express');
const shortid = require('shortid');
const QRCode = require('qrcode');
const { body, validationResult } = require('express-validator');
const fs = require('fs');

/*------configuration d'express------ */
const app = express();
const port = 3000;

app.use(express.static('public'));  // Pour servir des fichiers statiques
app.set('view engine', 'ejs');      // Moteur de template EJS
app.use(express.urlencoded({ extended: false }));

// Fonction de validation des URLs
function urlValidations() {
  return [
    body('fullUrl').isURL().withMessage('Veuillez entrer une URL valide'),
    body('shortUrl').notEmpty().withMessage('Short URL cannot be empty.'),
  ];
}

// Stockage des URLs
let urlData = [];

// Afficher les URLs raccourcies
app.get('/', (req, res) => {
  res.render('index', { urls: urlData });
});

// Ajouter une nouvelle URL raccourcie
app.post('/shorten', async (req, res) => {
  const fullUrl = req.body.fullUrl;
  const shortUrl = shortid.generate();
  const qrCodeUrl = await QRCode.toDataURL(`http://localhost:${port}/${shortUrl}`);

  urlData.push({ full: fullUrl, short: shortUrl, qrCode: qrCodeUrl });
  res.redirect('/');
});

// Redirection vers l'URL originale depuis l'URL raccourcie
app.get('/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl;
  const url = urlData.find(url => url.short === shortUrl);
  if (url) {
    res.redirect(url.full);
  } else {
    res.sendStatus(404);
  }
});

// Supprimer une URL raccourcie
app.delete('/delete/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl;
  urlData = urlData.filter(url => url.short !== shortUrl);
  res.sendStatus(200);
});

// Afficher le formulaire d'édition pour une URL raccourcie
app.get('/edit/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl;
  const urlEntry = urlData.find(url => url.short === shortUrl);
  if (urlEntry) {
    res.render('edit', { url: urlEntry });
  } else {
    res.sendStatus(404);
  }
});

// Mettre à jour une URL raccourcie
app.post('/update/:shortUrl', async (req, res) => {
  const oldShortUrl = req.params.shortUrl;
  const fullUrl = req.body.fullUrl;
  const newShortUrl = req.body.shortUrl;

  const urlIndex = urlData.findIndex(url => url.short === oldShortUrl);
  if (urlIndex !== -1) {
    const qrCodeUrl = await QRCode.toDataURL(`http://localhost:${port}/${newShortUrl}`);
    urlData[urlIndex] = { full: fullUrl, short: newShortUrl, qrCode: qrCodeUrl };
  }
  res.redirect('/');
});

// Téléchargement du QR code en image
app.get('/download/:shortUrl', (req, res) => {
  // À implémenter
});

// Démarrage du serveur
app.listen(port, () => {
  console.log('Le serveur est lancé sur le port 3000');
  console.log(`http://localhost:${port}`);
});
