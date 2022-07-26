const map = document.querySelectorAll('[data-city]');
const kaunasTemp = document.querySelector('#kaunasTemp');
const getTbody = document.querySelector('tbody');
const deleteButton = document.querySelector('#delete-button')

function todayDate(numberOfDate) {
    let today = new Date();
    let dd = String(today.getDate() + numberOfDate).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    return today;
}

async function getAvgTemp(cityCode, numberOfDate) {
    const getTemp = await fetch(`/api/v1/weather/places/find/${cityCode}/forecasts`);
    const getTempJSON = await getTemp.json();
    const getWeatherToday = await getTempJSON.filter(p => p.forecastTimeUtc.startsWith(todayDate(numberOfDate)));
    const getTempJSONLenght = getWeatherToday.length;
    let avgTemp = 0;
    let avgwindSpeed = 0;
    let avgHumidity = 0;

    function countUnique(iterable) {
        return new Set(iterable).size;
    }

    for (const getWeather of getWeatherToday) {
        avgTemp = avgTemp + getWeather.airTemperature;
        avgwindSpeed = avgwindSpeed + getWeather.windSpeed;
        avgHumidity = avgHumidity + getWeather.relativeHumidity;
    }

    let dataTodayAll = {
        date: getWeatherToday[0].forecastTimeUtc.split(' ')[0],
        temp: `${(avgTemp / getTempJSONLenght).toFixed(1)}°C `,
        windSpeed: `${(avgwindSpeed / getTempJSONLenght).toFixed(1)} m/s`,
        relativeHumidity: `${(avgHumidity / getTempJSONLenght).toFixed(1)} %`,
        dateLength: `${countUnique(getTempJSON.map(x => x.forecastTimeUtc.split(' ')[0]))}`

    }

    return dataTodayAll;

}

deleteButton?.addEventListener('click', ()=>{
    const getTrInTbody = document.querySelectorAll('tbody > tr');

    getTrInTbody.forEach(element => {
        element.remove()
    });
})

map.forEach(async element => {
    let numberOfDate = 1;
    const getCityAvgTemp = await getAvgTemp(element.getAttribute('data-city'), numberOfDate);
    const createH4 = document.createElement('h4');
    createH4.setAttribute('id', `${element.getAttribute('data-city')}Temp`);
    createH4.innerText = getCityAvgTemp.temp;
    element.appendChild(createH4);

    element.addEventListener('click', async () => {

        for (let numberOfDate = 1; numberOfDate < getCityAvgTemp.dateLength; numberOfDate++) {

            const getCityAvgDataClickedOnManp = await getAvgTemp(element.getAttribute('data-city'), numberOfDate);

            const createTr = document.createElement('tr');
            const createTdCity = document.createElement('td');
            const createTdData = document.createElement('td');
            const createTdTemp = document.createElement('td');
            const createTdHumidity = document.createElement('td');
            const createTdWindSpeed = document.createElement('td');

            createTdCity.innerText = element.getAttribute('data-city').charAt(0).toUpperCase() + element.getAttribute('data-city').slice(1);;
            createTdData.innerText = getCityAvgDataClickedOnManp.date;
            createTdTemp.innerText = getCityAvgDataClickedOnManp.temp;
            createTdWindSpeed.innerText = getCityAvgDataClickedOnManp.windSpeed;
            createTdHumidity.innerText = getCityAvgDataClickedOnManp.relativeHumidity;

            createTr.appendChild(createTdCity);
            createTr.appendChild(createTdData);
            createTr.appendChild(createTdTemp);
            createTr.appendChild(createTdHumidity);
            createTr.appendChild(createTdWindSpeed);
            getTbody.appendChild(createTr);


            deleteButton.classList.remove('d-none');
        }
    })

});


