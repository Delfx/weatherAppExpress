const express = require('express');
const router = express.Router();
const axios = require('axios').default;


router.get('/places/find/:name/', async function (req, res, next) {
    try {
        const getAllPlaces = (await axios.get('https://api.meteo.lt/v1/places/')).data;
        const filterPlace = getAllPlaces.filter(p => p.name.toLowerCase().startsWith(req.params.name.toLowerCase()));
		res.json(filterPlace.slice(0, 10));
    } catch (error) {
        res.render('error', {err: error.response.status});
        console.error(error);
    }
});

module.exports = router;
