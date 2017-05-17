const express = require('express');
const router = express.Router();
const jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require('../bin/config'); // get our config file
const request = require('request');
const async = require('async');

const User = require('../models/user');
const Reservation = require('../models/reservation');
const Chefs = require('../models/chef');
const Menu = require('../models/chef');

router.post('/', function(req, res) {
    // create a sample user
    var user = new User({
        name: req.body.name,
    	email: req.body.email,
    	profilePictureURL : req.body.profile_picture,
    	fbId : req.body.fb_id,
        cellphone : req.body.cellphone
    });

    // save the sample user
    user.save(function(err) {
        if (err) throw err;

        console.log('User saved successfully');
        var token = jwt.sign(user, config.secret, {
            expiresIn: 1440 * 60  // expires in 24 hours
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
      request('https://graph.facebook.com/app/?access_token='+req.body.fb_id, function (error, response, body) {
        console.log('error:', error); // Print the error if one occurred
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
      });

    //   if (user.password != req.body.password) {
    //     res.json({ success: false, message: 'Authentication failed. Wrong password.' });
    //   } else {

        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, config.secret, {
          expiresIn: 1440 * 60 // expires in 24 hours
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
    console.log(req.decoded);

    res.send('respond reservations of the week');
});

/* GET current_options. */
router.get('/current_options', (req, res, next) => {
    async.waterfall([
      function (done) {

          Chefs.find({}, (err, chefs) => {
              if (err)
                  throw err;

              let chefs_a = chefs.map( chef => {

                  //http://www.geodatasource.com/developers/javascript
                  
                  const lat1 = parseFloat(req.query.lat);
                  const lon1 = parseFloat(req.query.long);
                  const lat2 = parseFloat(chef.address.lat);
                  const lon2 = parseFloat(chef.address.long);

                  const radlat1 = Math.PI * lat1/180
              	const radlat2 = Math.PI * lat2/180
              	const theta = lon1-lon2
              	const radtheta = Math.PI * theta/180

                  let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
              	dist = Math.acos(dist)
              	dist = dist * 180/Math.PI
              	dist = dist * 60 * 1.1515
                  dist = dist * 1.609344;
                  chef.distance = dist;

                  return {
                      chef : chef
                  }
              });

              done(null, chefs_a);
          })
      },
      function (chefs, done) {


        // const chefs_n = chefs.map( chef => {
        //     return {
        //         chef : chef,
        //         menu : chef.currentMenu()
        //     }
        // })

        res.send(chefs);

        done(null, 'done');
    },
    function (chefs,done) {

    }
    ], function (err) {
      if (err) throw new Error(err);
    });

});

/* GET make_reservations. */
router.get('/make_reservations', function(req, res, next) {
  res.send("menu's array");
});

module.exports = router;
