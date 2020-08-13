const express = require('express');
//const hbs = require('hbs');
const fileUpload = require('express-fileupload');
const path = require('path');
const QRCode = require('qrcode');

const port = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload({
    debug: false,
    createParentPath: true,
    uploadTimeout: 0
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'hbs'));

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/upload', function (req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    const file = req.files.filesInput;

    file.mv(path.join(__dirname, 'public/files', file.name), function (err) {
        if (err) {
            return res.status(500).send(err);
        }

        const url = req.protocol + '://' + req.get('host') + '/files/' + file.name;

        QRCode.toDataURL(url, function (err, img) {
            res.send({url, img});
        });
    });
});

app.listen(port);