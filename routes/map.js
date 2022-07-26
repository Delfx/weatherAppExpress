const express = require('express');
const router = express.Router();
const axios = require('axios').default;


/* GET home page. */
router.get('/', async function(req, res, next) {
  res.render('map', { title: `Hello` });
});

module.exports = router;
