const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const redis = require('redis');

const port = process.env.PORT || 3000;
const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const app = express();
const redisClient = redis.createClient({
    host: redisHost
});

redisClient.on('error', function (error) {
    console.error(`Redis error: ${error}`);
});

redisClient.on('connect', function () {
    // console.log('Redis connected');
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload({
    debug: false,
    createParentPath: true,
    uploadTimeout: 0
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'hbs'));

app.get('/', (req, res) => {
    let uploads = [];

    redisClient.smembers('uploads', (err, values) => {
        if (err) {
            console.log(`Redis error: ${err}`);
        } else {
            // console.log(`Redis response: ${values}`);
            uploads = encodeURIComponent(JSON.stringify(values));
        }

        res.render('index', {
            uploads
        });
    });
});

app.get('/ar', (req, res) => {
    res.render('ar', {
        file: req.protocol + '://' + req.get('host') + '/files/' + req.query.f
    });
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

        const url = req.protocol + '://' + req.get('host') + '/ar/?f=' + file.name;

        redisClient.sadd('uploads', url);

        let uploads = [];

        redisClient.smembers('uploads', (err, values) => {
            if (err) {
                console.log(`Redis error: ${err}`);
            } else {
                // console.log(`Redis response: ${values}`);
                uploads = values;
            }

            res.send({
                uploads
            });
        });
    });
});

app.listen(port);
