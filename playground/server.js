const express = require('express');
const hbs = require('hbs');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

let app = express();
var visitations;
MongoClient.connect('mongodb://localhost:27017/myApp', (err, client) => {
    if(err) {
        return console.log('error while connecting to db');
    }
    console.log('successfuly connected to db');
    const db = client.db('myApp');

    hbs.registerPartials(__dirname + '/views/partials');
    app.set('view engine', 'hbs');
    app.use(express.static(__dirname + '/public'));

    app.use((req, res, next) => {
        db.collection('numbers').findOne({
            _id: new ObjectID("5c3147db7b193d28fcdf661f")
        }).then((doc) => {
            console.log(doc.visitations);
            visitations = doc.visitations;
        }, (e) => {
            console.log('some error occured while looking for number');
        });
        
        db.collection('numbers').findOneAndUpdate({
            _id: new ObjectID("5c3147db7b193d28fcdf661f")
        }, {
            $inc: {
                visitations: 1
            }
        });
        next();
        
    });

    hbs.registerHelper('getCurrentYear', () => {
        return new Date().getFullYear();
    });

    hbs.registerHelper('getVisitations', () => {
        return visitations+1;
    })

    app.get('/about', (req, res) => {
        res.render('about.hbs', {
            pageTitle: 'About page',
        });
    });

    app.get('/home', (req, res) => {
        res.render('home.hbs', {
            pageTitle: 'Home page',
        });
    });


    app.get('/', (req, res) => {
        res.send({
            name: 'shaviq',
            likes: [
                'biking',
                'cycling'
            ],
            nonlikes: [
                'cigarettes'
            ]
        });
    });

    app.listen(3000, () => {
        console.log('Starting server on port 3000');
    });

});
    

