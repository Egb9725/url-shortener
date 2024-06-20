const express = require('express');
const shortid = require('shortid');
const QRCode = require('qrcode');

const{body,validationResult} = require("express-validator"); //validation 
const fs = require('fs');


const app = express();


app.use(express.static('public'));  // Pour servir des fichiers statiques comme JavaScript
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));


function urlValidations(){
  return [
    body('fullUrl').isURL().withMessage('Veuillez entrer une URL valide'),
    body('shortUrl').notEmpty().withMessage('Short URL cannot be empty.'),
  ]
}



app.get('/', (req, res) => {
  res.render('index', { urls: urlData });
});

// ----------------stockage des urls------------------------
let urlData = [];// Variable pour stocker les URLs en mémoire

// ajouter les urls dans le tableau
app.post('/shorten', async (req, res) => {
  const fullUrl = req.body.fullUrl;
  const shortUrl = shortid.generate();
  const qrCodeUrl = await QRCode.toDataURL(`http://localhost:3000/${shortUrl}`);

  urlData.push({ full: fullUrl, short: shortUrl, qrCode: qrCodeUrl });
  res.redirect('/');
});

// afficher les urls 
app.get('/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl;
  const url = urlData.find(url => url.short === shortUrl);
  if (url) {
    res.redirect(url.full);
  } else {
    res.sendStatus(404);
  }
});

//supprimer les urls
/*app.delete('/delete/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl;

  if (urlIndex !== -1) {
    urlData.splice(urlIndex, 1);

    // Redirection vers la page d'accueil '/'
    res.redirect('/');
  } else {
    // un code d'erreur 404 Not Found
    res.sendStatus(404);
  }
});*/

//Endpoint pour supprimer une URL courte
app.delete('/delete/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl;

  // Filtrer les données pour retirer l'URL correspondante
  urlData = urlData.filter(url => url.short !== shortUrl);

  // Envoyer une réponse indiquant que la suppression a réussi
  res.sendStatus(200);
});


//afficher le formulaire de modification
app.get('/edit/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl;
  const urlEntry = urlData.find(url => url.short === shortUrl);
  if (urlEntry) {
    res.render('edit', { url: urlEntry });
  } else {
    res.sendStatus(404);
  }
});

// Mettre à jour une URL courte
app.post('/update/:shortUrl', async (req, res) => {
  
  const oldShortUrl = req.params.shortUrl;
  const fullUrl = req.body.fullUrl;
  const newShortUrl = req.body.shortUrl;


  // Trouver l'index de l'URL à mettre à jour
  const urlIndex = urlData.findIndex(url => url.short === oldShortUrl);
  if (urlIndex !== -1) {

    // Générer le QR code pour la nouvelle URL courte
    const qrCodeUrl = await QRCode.toDataURL(`http://localhost:3000/${newShortUrl}`); 
    
    // Mettre à jour l'URL dans urlData
    urlData[urlIndex] = { full: fullUrl, short: newShortUrl, qrCode: qrCodeUrl };
  }
  res.redirect('/');
});

//downloads le QR code en image
app.get('/download/:shortUrl', (req, res) => {
  
});

const port=3000;
//Lance le serveur
app.listen(port, () => {
  console.log('Le serveur est lancé sur le port 3000');
  console.log(`http://localhost:${port}`);
});