const express = require('express');
const router = express.Router();
const axios = require('axios').default;



function todayDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    return today
}

router.get('/places/find/:name/forecasts/', async function (req, res, next) {
    try {
        todayDate();
        const getAllPlaces = (await axios.get(`https://api.meteo.lt/v1/places/${req.params.name}/forecasts/long-term`)).data.forecastTimestamps;
        const filterPlace = getAllPlaces.filter(p => p.forecastTimeUtc.startsWith(todayDate()));
        res.json(filterPlace);
    } catch (error) {
        res.render('error', { err: error });
        console.error(error);
    }
});

module.exports = router;
