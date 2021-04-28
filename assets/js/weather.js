var tempScale = 'F';
var speedScale = 'mph';
const K = 273.15;
var currentTemperature = 0;
var feelsLike = 0;


var currentLocation = {
    lat: 0,
    lon: 0
}

var locationName = '';

function getCurrentWeatherByCoordinates() {
    fetch(
        'http://api.openweathermap.org/data/2.5/weather?lat='+currentLocation.lat+'&lon='+currentLocation.lon+
        '&appid=655d5689eeeddab12919a0a91fabf64a'
    )
    .then(function(weatherResponse) {
        return weatherResponse.json();
    })
    .then(function(weatherResponse){
        storeWeatherData(weatherResponse);
        return fetch(
            'http://api.openweathermap.org/data/2.5/onecall?lat='+currentLocation.lat+'&lon='+currentLocation.lon+
            '&units=imperial&exclude=minutely,hourly&appid=655d5689eeeddab12919a0a91fabf64a'
        )
        .then(function(weatherResponse) {
            return weatherResponse.json();
        })
        .then(function(weatherResponse){
            paintCurrentWeather(weatherResponse);
            return weatherResponse;
        });
    });
}

function storeWeatherData(weather) {
    locationName = weather.name;
}

function paintCurrentWeather(weather) {
    // Paints current weather in the current weather card
    console.log(weather);

    // Update current weather icon
    var cardImageEl = document.querySelector('#weather-icon');
    cardImageEl.setAttribute('src','./assets/images/' + weather.current.weather[0].icon + '.png');
    cardImageEl.className = 'card-img-top';
    
    // Update the location name
    var locationEl = document.querySelector('#location');
    locationEl.innerText = locationName;
    
    // Convert Kevlin to F or C
    // No need to call the API again for different scales, it's easier to use math
    currentTemperature = tempScale === 'C' ? 
        weather.current.temp * (9 / 5) + 32 :
        weather.current.temp;

    // Update the temperature
    var currentTempEl = document.querySelector('#current-temp');    
    currentTempEl.innerText = Math.round(currentTemperature*10)/10 + '° ' + tempScale;
    
    // Show date on card - Need to finagle the unix timestamp to date
    var currentDate = new Date(weather.current.dt*1000);
    var currentDateEl = document.querySelector('#current-date');
    currentDateEl.innerText = currentDate.toLocaleDateString('en-US',{weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'});
    
    // Add additional weather elements
    //Feels like
    feelsLike = tempScale === 'C' ? 
        weather.current.feels_like * (9 / 5) + 32 :
        weather.current.feels_like;
    var feelsLikeEl = document.querySelector('#feels-like');
    feelsLikeEl.innerHTML = feelsLike + '&deg; ' + tempScale;

    var humidityEl = document.querySelector('#humidity');
    humidityEl.innerText = weather.current.humidity + '%';
    
    var windSpeedEl = document.querySelector('#wind-speed');
    windSpeedEl.innerText = weather.current.wind_speed + ' ' + speedScale;

    var uviEl = document.querySelector('#uv-index');
    uviEl.innerText = weather.current.uvi;
    
    if (weather.current.uvi<3) {
        uviEl.className = 'badge bg-primary rounded-pill bg-success';
    } else if (weather.current.uvi<6) {
        uviEl.className = 'badge bg-primary rounded-pill bg-warning';
    } else if (weather.current.uvi<11) {
        uviEl.className = 'badge bg-primary rounded-pill bg-danger';
    } else {
        uviEl.className = 'badge bg-primary rounded-pill bg-danger';
        uviEl.innerHTML = weather.current.uvi + ' &#128128;';
    }
    
    // Now print the next five days of forecast
    var forecastColumn = document.querySelector('#forecast');
    forecastColumn.innerHTML = '';
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
    // Get geolocation and call the weather API
    getGeoLocation();
}

initialize();
