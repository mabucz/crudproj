const express = require('express');
//czytanie z formularzy dzieki body-parser
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;


const app = express();


// app.listen(3000, function () {
//     console.log("hello crud, server listening on 3000");
// });

//extract data from the <form> element and add them to the body request
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(bodyParser.json());


app.set('view engine', 'ejs');

var url = 'mongodb://localhost:27017/crud_proj1',
    db;

MongoClient.connect(url, (err, database) => {
    if (err) return console.log(err)
    db = database
    //start apki jesli mamy db connection
    app.listen(3000, () => {
        console.log('listening on 3000')
    });
});

//app.get(path, callback)
// app.get('/', function (req,res) {
//     res.send('Hello world');
// });

//ES6
// app.get('/', (req, res) => {
//       res.send('hello world');
//});

// app.get('/', (req, res) => {
//       res.sendFile(__dirname + '/index.html');
//
// });

app.post('/quotes', (req, res) => {
   db.collection('quotes').save(req.body, (err, result) => {
         if (err) return console.log(err)
         res.redirect('/')
     })
 })


app.get('/', (req, res) => {
    var cursor = db.collection('quotes').find().toArray(function (err, result) {
        if (err) return console.log(err)
        res.render('index.ejs', {quotes: result})

    })
})

app.put('/quotes', (req, res) => {
    db.collection('quotes').findOneAndUpdate({name: 'Yoda'},
    {
        $set: {
            name: req.body.name,
            quote: req.body.quote
        }
    },
    {
        sort: {_id: -1},
        upsert: true
    }, (err, result) => {
            if (err) return res.send(err)
            res.send(result)
        });
})

app.delete('/quotes', (req, res) => {
    db.collection('quotes').findOneAndDelete({name: req.body.name},
        (err, result) => {
            if (err) return res.send(500, err)
            res.send('A darth vadar quote got deleted')
        })
})
