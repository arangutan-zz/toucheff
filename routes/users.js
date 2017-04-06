const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require('../bin/config'); // get our config file

router.post('/', function(req, res) {
    // create a sample user
    var user = new User({
        name: req.body.name,
    	email: req.body.email,
    	profilePictureURL : req.body.profile_picture,
    	password: req.body.password,
    	fbId : req.body.fb_id
    });

    // save the sample user
    user.save(function(err) {
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
  User.findOne({
    fbId: req.body.fb_id
  }, function(err, user) {

    if (err) throw err;

    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // validate the access token with the graph API.
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
