var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send({nombre: 'The name of the user'})
  // res.render('index', { title: 'Touchef' });
});

module.exports = router;
