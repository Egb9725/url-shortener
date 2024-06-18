const express = require('express');
const shortid = require('shortid');
const QRCode = require('qrcode');

const app = express();




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

const port=3000;
app.listen(port, () => {
  console.log('Le serveur est lancé sur le port 3000');
  console.log(`http://localhost:${port}`);
});
