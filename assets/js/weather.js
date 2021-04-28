var tempScale = 'F';
var units = 'imperial';
var speedScale = 'mph';
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
            '&units='+units+'&exclude=minutely,hourly&appid=655d5689eeeddab12919a0a91fabf64a'
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

function getCurrentWeatherByCity(target) {
    var city = target.srcElement.innerText;
    fetch(
        'http://api.openweathermap.org/data/2.5/weather?q='+city+
        '&appid=655d5689eeeddab12919a0a91fabf64a'
    )
    .then(function(weatherResponse) {
        return weatherResponse.json();
    })
    .then(function(weatherResponse){
        storeWeatherData(weatherResponse);
        return fetch(
            'http://api.openweathermap.org/data/2.5/onecall?lat='+currentLocation.lat+'&lon='+currentLocation.lon+
            '&units='+units+'&exclude=minutely,hourly&appid=655d5689eeeddab12919a0a91fabf64a'
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

function getCurrentWeatherByQuery (target) {
    var city = target.srcElement.previousElementSibling.value;
    fetch(
        'http://api.openweathermap.org/data/2.5/weather?q='+city+
        '&appid=655d5689eeeddab12919a0a91fabf64a'
    )
    .then(function(weatherResponse) {
        return weatherResponse.json();
    })
    .then(function(weatherResponse){
        storeWeatherData(weatherResponse);
        return fetch(
            'http://api.openweathermap.org/data/2.5/onecall?lat='+currentLocation.lat+'&lon='+currentLocation.lon+
            '&units='+units+'&exclude=minutely,hourly&appid=655d5689eeeddab12919a0a91fabf64a'
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
    currentLocation.lat = weather.coord.lat;
    currentLocation.lon = weather.coord.lon;
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
    currentTemperature = weather.current.temp;

    // Update the temperature
    var currentTempEl = document.querySelector('#current-temp');    
    currentTempEl.innerText = Math.round(currentTemperature*10)/10 + '° ' + tempScale;
    
    // Show date on card - Need to finagle the unix timestamp to date
    var currentDate = new Date(weather.current.dt*1000);
    var currentDateEl = document.querySelector('#current-date');
    currentDateEl.innerText = currentDate.toLocaleDateString('en-US',{weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'});
    
    // Add additional weather elements
    //Feels like
    feelsLike = weather.current.feels_like;
    var feelsLikeEl = document.querySelector('#feels-like');
    feelsLikeEl.innerHTML = Math.round(feelsLike*10)/10 + '&deg; ' + tempScale;

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
    
    var currentWeather = document.querySelector('#current');
    currentWeather.setAttribute('style', '');

    // Now print the next five days of forecast
    var forecastPanel = document.querySelector('#forecast');
    forecastPanel.innerHTML = '';

    var forecastGroup = document.createElement('div');
    forecastGroup.className = 'row content-fluid';
    forecastPanel.appendChild(forecastGroup);
    

    for (i=1; i<weather.daily.length-1; i++) {
        var forecastCard = document.createElement('div');
        forecastCard.className = 'card m-1 shadow';

        var forecastIcon = document.createElement('img');
        forecastIcon.className = 'card-img-top';
        forecastIcon.setAttribute('src', './assets/images/'+weather.daily[i].weather[0].icon + '.png');

        var forecastDetails = document.createElement('div');
        forecastDetails.className = 'card-img-overlay text-light';
        
        var forecastTemp = document.createElement('h2');
        forecastTemp.className = 'header-shadow';
        forecastTemp.innerHTML = Math.round(weather.daily[i].temp.day*10)/10 + '&deg; ' + tempScale;
        
        var forecastTempMin = document.createElement('p');
        forecastTempMin.className = 'header-shadow m-0';
        forecastTempMin.innerHTML = 'Min: ' + Math.round(weather.daily[i].temp.min*10)/10 + '&deg; ' + tempScale;

        var forecastTempMax = document.createElement('p');
        forecastTempMax.className = 'header-shadow m-0';
        forecastTempMax.innerHTML = 'Max: ' + Math.round(weather.daily[i].temp.max*10)/10 + '&deg; ' + tempScale;

        var forecastHumidity = document.createElement('p');
        forecastHumidity.className = 'header-shadow m-0';
        forecastHumidity.innerText = 'Humidity: ' + weather.daily[i].humidity + '%';

        var forecastHeader = document.createElement('div');
        forecastHeader.className = 'card-header';
        
        var forecastDate = new Date(weather.daily[i].dt*1000);

        var forecastDateEl = document.createElement('h6');
        forecastDateEl.innerText = forecastDate.toLocaleDateString('en-US',{weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'});
        forecastHeader.appendChild(forecastDateEl);

        forecastCard.appendChild(forecastIcon);
        forecastCard.appendChild(forecastDetails);
        forecastDetails.appendChild(forecastTemp);
        forecastDetails.appendChild(forecastTempMin);
        forecastDetails.appendChild(forecastTempMax);
        forecastDetails.appendChild(forecastHumidity);
        forecastCard.appendChild(forecastHeader);

        forecastGroup.appendChild (forecastCard);
    }
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

function switchTemperatureUnits() {
    var switchUnitsBtn = document.querySelector('#switch-temp');

    if (units === 'imperial') {
        tempScale = 'C';
        units = 'metric';
        speedScale = 'm/s';
        switchUnitsBtn.innerText = 'Switch to imperial';
    } else {
        tempScale = 'F';
        units = 'imperial';
        speedScale = 'mph';
        switchUnitsBtn.innerText = 'Switch to metric';
    }
    
    getCurrentWeatherByCoordinates(currentLocation);
}

function initialize() {
    // Add event listener to city list items
    var cities = document.querySelectorAll('.city');
    
    Array.from(cities).forEach(function(element){
        element.addEventListener('click', getCurrentWeatherByCity);
    })

    // Add event listener to search bar
    var searchBar = document.querySelector('#search-button');
    searchBar.addEventListener('click', getCurrentWeatherByQuery);

    // Add event listener to switch units
    var switchUnitsBtn = document.querySelector('#switch-temp');
    switchUnitsBtn.addEventListener('click', switchTemperatureUnits);
    // Get geolocation and call the weather API
    getGeoLocation();
}

initialize();
