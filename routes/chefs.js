const express = require('express');
const router = express.Router();
const Chef = require('../models/chef');
const jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require('../bin/config'); // get our config file

router.post('/', function(req, res) {
    // create a sample chef
    var chef = new Chef({
        name: req.body.name,
    	email: req.body.email,
    	profilePictureURL : req.body.profile_picture_url,
    	fbId : req.body.fb_id,
    	cellphone: req.body.cellphone,
    	address: req.body.address,
    	neighbourhood: req.body.neighbourhood,
    	lat: req.body.lat,
    	long: req.body.long,
    	bio: req.body.bio,

    	idCardNumber: req.body.idCardNumber
    });

    // save the sample user
    chef.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully');
        var token = jwt.sign(user, config.secret, {
            expiresIn: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
            success: true,
            token: token
        });
    });
});


router.post('/login', function(req, res) {
  // find the user
  Chef.findOne({
    fbId: req.body.fb_id
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches
    //   if (user.password != req.body.password) {
    //     res.json({ success: false, message: 'Authentication failed. Wrong password.' });
    //   } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, config.secret, {
          expiresIn: 1440 // expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
    //   }

    }

  });
});

// route middleware to verify a token
router.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }
});


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET me. */
router.get('/me', function(req, res, next) {
  res.send('respond reservations of the week');
});

/* GET current_options. */
router.get('/current_options', function(req, res, next) {
  res.send("menu's array");
});

/* GET make_reservations. */
router.get('/make_reservations', function(req, res, next) {
  res.send("menu's array");
});

module.exports = router;
