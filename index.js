const express = require('express');
const shortid = require('shortid');
const QRCode = require('qrcode');

const{body,validationResult} = require("express-validator"); //validation 

const app = express();

app.use(express.static('public'));  // Pour servir des fichiers statiques comme JavaScript

function urlValidations(){
  return [
    body('fullUrl').isURL().withMessage('Veuillez entrer une URL valide')
  ]
}

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

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
app.delete('/delete/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl;
  urlData = urlData.filter(url => url.short!== shortUrl);
  res.redirect('/');
});


//modifier les urls
app.put('/update/:shortUrl', async (req, res) => {
  const shortUrl = req.params.shortUrl;
  const fullUrl = req.body.full;
  const qrCodeUrl = await QRCode.toDataURL(`http://localhost:3000/${shortUrl}`);
  const urlIndex = urlData.findIndex(url => url.short===shortUrl);

  if (urlIndex!==-1) {
    urlData[urlIndex] = { full: fullUrl, short: shortUrl, qrCode: qrCodeUrl };
  }else{
    res.redirect('/');
  }

});



const port=3000;
app.listen(port, () => {
  console.log('Le serveur est lancé sur le port 3000');
  console.log(`http://localhost:${port}`);
});
