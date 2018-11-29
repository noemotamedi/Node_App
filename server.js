console.log("hello")
// call the packages we need
var express    = require('express')      // call express
var bodyParser = require('body-parser')
var app        = express()     // define our app using express
const MongoClient = require('mongodb').MongoClient
const assert = require('assert');

// configure app to use bodyParser() and ejs
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine','ejs');

// get an instance of the express Router
var router = express.Router();

// a “get” at the root of our web app: http://localhost:3000/api
router.get('/', function(req, res) {
  db.collection('dogs').find({}).toArray((err, result) => {
    if(err) {console.log(err)}
    console.log(result)
    res.render('index.ejs', {dogs: result})
  })
});

router.post('/items', function(req, res) {
  console.log("POST!");  //logs to terminal
  var dogs = req.body.dogs
  var type = req.body.type

  db.collection('dogs').find({}).toArray((err, result) => {
    if(err) {console.log(err)}
    var id=result.length;
    console.log(id)
    db.collection('dogs').insertOne({dogs:dogs, type:type, id:id})
    res.redirect('/api');

  })


});


router.post('/delete', function(req,res){
  var id=parseInt(req.body.id);
  db.collection('dogs').deleteOne({id:id})
  res.redirect('/api');
})


// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
//==========================================================
var db
MongoClient.connect('mongodb://CarlosMatos:bitc0nnect@ds249123.mlab.com:49123/carlosmatosclub',{ useNewUrlParser: true }, (err, client) => {
    if(err) console.log(err)
    console.log("Connected successfully to server");

    db = client.db('carlosmatosclub');
    port= process.env.PORT || 80
    app.listen(port)
})
