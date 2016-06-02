var express = require('express');
var stripe = require('stripe')('sk_test_B6xXZo7NGReUVsjf8KUukdz6');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var db = req.db;

      var collection = db.get('usercollection');
      var options = {
         "sort": { score: -1 }
      };
      collection.find({}, options, function(e,docs){
          res.render('userlist', {
              "userlist" : docs
          });
      });
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    var db = req.db;

    var collection = db.get('usercollection');
    var options = {
       "sort": { score: -1 }
    };
    collection.find({}, options, function(e,docs){
        res.render('userlist', {
            "userlist" : docs
        });
    });
});


// CHARGE
router.post('/charge', function(req, res) {
    var stripeToken = req.body.stripeToken;
    var amount = req.body.amount;

    stripe.charges.create({
        card: stripeToken,
        currency: 'usd',
        amount: amount
    },
    function(err, charge) {
        if (err) {
            res.sendStatus(500, err);
        } else {
            res.sendStatus(204);
        }
    });
});

/* GET New User page. */
router.get('/userlist', function(req, res) {
    res.render('newuser');
});


/* POST to Add User Service */
router.post('/adduser', function(req, res) {
/*
    //SEND EMAIL
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: '@gmail.com', // Your email id
            pass: '' // Your password
        }
    });

    var text = 'Hello world from \n\n' + req.body.name;
    var email = req.body.email;

    var mailOptions = {
        from: 'highscore@highscore.top', // sender address
        to: email, // list of receivers
        subject: 'Email Example', // Subject line
        text: text //, // plaintext body
        // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
    };*/

    /*transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
            res.json({yo: 'error'});
        }else{
            console.log('Message sent: ' + info.response);
            res.json({yo: info.response});
        }
    });*/

    //ADD USER
    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var name = req.body.name;
    var link = req.body.link;
    var score = req.body.score;

    // Set our collection
    var collection = db.get('usercollection');

    // Submit to the DB
    collection.insert({
        "name" : name,
        "score" : parseInt(score),
        "link" : link
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect(req.get('referer'));
        }
    });
});

module.exports = router;
