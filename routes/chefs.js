const express = require('express');
const router = express.Router();
const jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
const config = require('../bin/config'); // get our config file

const Chef = require('../models/chef');
const Menu = require('../models/menu');

router.post('/', function(req, res) {
    // create a sample chef
    var chef = new Chef({
        name: req.body.name,
    	email: req.body.email,
    	profilePictureURL : req.body.profilePictureURL,
    	fbId : req.body.fbId,
    	fbAccessToken: req.body.fbAccessToken,
    	cellphone: req.body.cellphone,
    	address: {
    		lat : req.body.lat,
    		long : req.body.long,
            neighbourhood: req.body.neighbourhood,
            longName : req.body.address_long,
    		shortName : req.body.address_short
    	},
    	attendingSchedule :{
    		hours : req.body.attendingHours
    	},
    	bio: req.body.bio,
    	idCardNumber: req.body.idCardNumber
    });

    // save the sample user
    chef.save(function(err) {
        console.log(err);
        if (err) throw err;

        console.log('Chef saved successfully');
        var token = jwt.sign(chef, config.secret, {
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
router.post('/new_menu', (req, res, next) => {

    Chef.findOne({
        _id: req.decoded._doc._id
    }, function(err, chef) {
        if (chef) {
            var menu = new Menu({
                name: req.body.name,
            	menuPictureURL: req.body.menuPictureURL,
            	description: req.body.description,
            	attendingSchedule :{
            		hour : req.body.hours,
                    reservations : req.body.reservations,
                    date : req.body.dates,
            	},
            	price : req.body.price,
                chef: chef._id
            });

            // save the sample user
            menu.save( err => {
                console.log(err);
                if (err) throw err;

                console.log('Menu saved successfully');
                res.send(menu);
            });
        } else {
            res.json({
                error:1,
                msg: "That user it's not a chef"
            })
        }
    });
});
module.exports = router;
