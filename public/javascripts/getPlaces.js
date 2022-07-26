const searchInput = document.querySelector('#search-input')
const tableBody = document.querySelector('#table-body')


function todayDate() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;
    return today
}

async function getAvgTemp(event) {
    const getSiblingTdAtributeName = event.target.parentNode.parentNode.firstChild.getAttribute('cityCode');
    const getEventTr =  event.target.parentNode;
    const getTemp = await fetch(`/api/v1/weather/places/find/${getSiblingTdAtributeName}/forecasts`);
    const getTempJSON = await getTemp.json();
    const getTempToday = await getTempJSON.filter(p => p.forecastTimeUtc.startsWith(todayDate()));
    const getTempJSONLenght = getTempToday.length;
    let avgTemp = 0;

    for (const getweather of getTempToday) {
        avgTemp = avgTemp + getweather.airTemperature
    }

    event.target.remove();
    getEventTr.innerText = `${(avgTemp/getTempJSONLenght).toFixed(1)}°C `;

}

function createCityName(valueCity, atributeCode) {
    const createTr = document.createElement('tr');
    const createTd = document.createElement('td');
    const createTdButton = document.createElement('td');
    const createButton = document.createElement('button');

    createButton.setAttribute('type', 'button');
    createButton.classList.add('btn', 'btn-secondary', 'btn-sm');
    createButton.innerText = 'Show Data';


    createTd.textContent = valueCity;
    createTd.setAttribute('cityCode', atributeCode);

    createButton.addEventListener('click', (event) => {
        getAvgTemp(event);
    })

    createTr.appendChild(createTd);
    tableBody.appendChild(createTr);
    createTdButton.appendChild(createButton);
    createTr.appendChild(createTdButton);
}


function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

function getTemperature() {
    const firsTr = document.querySelectorAll('tbody > tr:first-child')
    console.log(firsTr.innerText);
}



let getPlaces = async () => {
    try {
        searchInput.addEventListener('input', debounce(async function (event) {


            const allTr = document.querySelectorAll('tbody > tr')
            allTr.forEach(tr => {
                tr.remove();
            });

            let getPlaces = await fetch(`/api/v1/weather/places/find/${searchInput.value}`)

            if (!getPlaces.ok) {
                throw new Error(getPlaces.statusText);
            } else {
                let cityNames = await getPlaces.json();
                if (event.inputType) {
                    cityNames.forEach(element => {
                        if (!(/\s/).test(element.name)) {
                            createCityName(element.name, element.code);
                        }
                    });
                }
            }
        }))
    } catch (err) {
        console.error(err)
    }
};


getPlaces();

