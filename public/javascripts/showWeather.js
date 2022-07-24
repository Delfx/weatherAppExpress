const searchInput = document.querySelector('#search-input')

let getPlaces = async (place) => {
    try {
        let response = await fetch(`/api/v1/weather/places/find/${place}`)
        if (!response.ok)
            throw new Error(response.statusText);
        let body = await response.json();
        return body;
    } catch (err) {
        console.log(err)
    }
};

export default getPlaces;