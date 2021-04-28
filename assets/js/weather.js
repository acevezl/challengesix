var tempScale = 'F';
const K = 273.15;

var currentLocation = {
    lat: 0,
    lon: 0
}

function getCurrentWeatherByCoordinates() {
    fetch(
        'http://api.openweathermap.org/data/2.5/weather?lat='+currentLocation.lat+'&lon='+currentLocation.lon+'&appid=655d5689eeeddab12919a0a91fabf64a'
    )
    .then(function(weatherResponse) {
        return weatherResponse.json();
    })
    .then(function(weatherResponse){
        paintCurrentWeather(weatherResponse);
        return weatherResponse;
    });
}

function paintCurrentWeather(weather) {
    // Paints current weather in the current weather card
    console.log(weather);

    // Select the current weather card and clear its contents
    var currentWeatherEl = document.querySelector('#current-weather-card');
    currentWeatherEl.innerHTML = '';

    // Create an image element to display the image corresponding with the weather returned
    var cardImageEl = document.createElement('img');
    cardImageEl.setAttribute('src','./assets/images/' + weather.weather[0].icon + '.png');
    cardImageEl.className = 'card-img-top';
    currentWeatherEl.appendChild(cardImageEl);
    
    // Create the card body
    var cardBodyEl = document.createElement('div');
    cardBodyEl.className = 'card-body';
    currentWeatherEl.appendChild(cardBodyEl);
    
    // Create a container for the city name and temperature
    var cityTempEl = document.createElement('div');
    cityTempEl.className = 'container';
    

    var cityTempRowEl = document.createElement('div');
    cityTempRowEl.className = 'row justify-content-between';
    

    var cityNameEl = document.createElement('h3');
    cityNameEl.className = 'text-light';
    cityNameEl.setAttribute('id','location');
    cityNameEl.innerText = weather.name;

    var currentTempEl = document.createElement ('h3');
    currentTempEl.className = 'text-light';
    currentTempEl.setAttribute('id','current-temp');
    
    // Get current temp in Kelvin
    var kelvinTemp = weather.main.temp;

    // Convert Kevlin to F or C
    // No need to call the API again for different scales, it's easier to use math
    var temperature = tempScale === 'F' ? 
        (kelvinTemp - K) * (9 / 5) + 32 :
        kelvinTemp - K;

    currentTempEl.innerText = Math.round(temperature*10)/10 + '° ' + tempScale;
    
    // Add elements to the card
    cityTempRowEl.appendChild(cityNameEl);
    cityTempRowEl.appendChild(currentTempEl);
    cityTempEl.appendChild(cityTempRowEl);
    cardBodyEl.appendChild(cityTempEl);
    
    
    // Show date on card - Need to finagle the unix timestamp to date
    var currentDate = new Date(weather.dt*1000);
    var dateEl = document.createElement('h6');
    dateEl.className = 'card-title mb-2 text-muted';
    dateEl.innerText = currentDate.toLocaleDateString('en-US',{weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'});
    cardBodyEl.appendChild(dateEl);
    
    // Add additional weather elements
    var additionalWeatherEl = document.createElement('ul');
    additionalWeatherEl.className = 'list-group list-group-flush';

    // For each element in the weather.main object, add a li element with the data
    Object.entries(weather.main).forEach(element => {
        const [key, value] = element;

        var label = key;
        var displayValue = 0;
        if (label === 'feels_like' || label === 'temp_max' || label === 'temp_min') {
            var displayValue = tempScale === 'F' ? 
                (value - K) * (9 / 5) + 32 :
                value - K;

            displayValue = Math.round(displayValue*10)/10 + '° ' + tempScale;
        } else if (label === 'humidity') {
            displayValue = value + '%'
        } 

        if (displayValue) {
            var additionalItemEl = document.createElement('li');
            additionalItemEl.className = 'list-group-item fs-6';
            additionalItemEl.innerText = key.toUpperCase().replace('_',' ') + ': ' + displayValue;
            additionalWeatherEl.appendChild(additionalItemEl);
        }
    });
    
    cardBodyEl.appendChild(additionalWeatherEl);
    

    currentWeatherEl.appendChild (cardBodyEl);
    
}

function getGeoLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    currentLocation.lat = position.coords.latitude;
    currentLocation.lon = position.coords.longitude;
    getCurrentWeatherByCoordinates(currentLocation);
}

function initialize() {
    // Select current weather card and empty it
    var currentWeatherEl = document.querySelector('#current-weather-card');
    currentWeatherEl.innerHTML='';

    // Create a card title that reads "Loading Weather"
    var cardTitle = document.createElement('h6');
    cardTitle.className = 'card-title m-2 text-light';
    cardTitle.innerText = 'Loading Weather...';
    currentWeatherEl.appendChild(cardTitle);

    // Create a spinner to show while API retrieves data
    var spinnerHolder = document.createElement('div');
    spinnerHolder.className='d-flex justify-content-center m-5';
    var spinnerEl = document.createElement('div');
    spinnerEl.className='spinner-grow text-light';
    spinnerHolder.appendChild(spinnerEl);
    currentWeatherEl.appendChild(spinnerHolder);

    

    // Get geolocation and call the weather API
    getGeoLocation();
}

initialize();
