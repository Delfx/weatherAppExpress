const searchInput = document.querySelector('#search-input')
const tableBody = document.querySelector('#table-body')


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
            // let getTemp = await fetch(`/api/v1/weather/places/find/${searchInput.value}/forecasts`)

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

