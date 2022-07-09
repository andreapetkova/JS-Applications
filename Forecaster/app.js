const weatherSymbols = {
    sunny: '☀',
    partlySunny: '⛅',
    overcast: '☁',
    rain: '☂'
}
const forecastDiv = document.getElementById('forecast')

function attachEvents() {
    document.getElementById('submit').addEventListener('click', getWeatherByLocation);
}

attachEvents();

async function getWeatherByLocation() {
    const url = 'http://localhost:3030/jsonstore/forecaster/locations';
    const currLocation = document.getElementById('location').value;

    forecastDiv.style.display = 'block';
    forecastDiv.querySelector('#current .label').textContent = 'Current conditions';
    forecastDiv.querySelector('#upcoming').style.display = 'block';

    try {
        const response = await fetch(url)

        if (response.ok == false) {
            throw new Error();
          }
        
        const data = await response.json();
        
        const locationCode = data.find(x => x.name == currLocation).code
        
        const todayData = await todayForecast(locationCode)
        const nextData = await upcommingForecast(locationCode)

        displayTodayForecast(todayData);
        displayNextThreeDaysForecast(nextData.forecast)
    } catch(err) {
        forecastDiv.querySelector('.forecasts').remove();
        forecastDiv.querySelector('#current .label').textContent = 'Error';
        forecastDiv.querySelector('#upcoming').style.display = 'none';
    }
}

async function todayForecast(code) {
    const url = 'http://localhost:3030/jsonstore/forecaster/today/' + code;

    try {
        const response = await fetch(url)

        if (response.ok == false) {
            throw new Error();
          }
        
        const data = await response.json();
        
        return data;

    } catch(err) {
        alert(err.message)
    }
}

async function upcommingForecast(code) {
    const url = 'http://localhost:3030/jsonstore/forecaster/upcoming/' + code;

    try {
        const response = await fetch(url)

        if (response.ok == false) {
            throw new Error();
          }
        
        const data = await response.json();
        
        return data;

    } catch(err) {
        alert(err.message)
    }
}

function displayTodayForecast(todayInfo) {
    const currentDiv = document.getElementById('current');
    let currSymbol = ''
    switch (todayInfo.forecast.condition) {
        case "Sunny": currSymbol = weatherSymbols.sunny;break;
        case "Partly Sunny": currSymbol = weatherSymbols.partlySunny;break;
        case "Overcast": currSymbol = weatherSymbols.overcast;break;
        case "Rain": currSymbol = weatherSymbols.rain;break;
        default:break;
    }
    
    const result = e('div', { className: 'forecasts' }, 
                    e('span', { className: 'condition symbol'}, currSymbol),
                    e('span', { className: 'condition'}, 
                        e('span', { className: 'forecast-data'}, todayInfo.name),
                        e('span', { className: 'forecast-data'}, `${todayInfo.forecast.low}°/${todayInfo.forecast.high}°`),
                        e('span', { className: 'forecast-data'}, todayInfo.forecast.condition)
                        ))
    
    currentDiv.appendChild(result)                    
}

function displayNextThreeDaysForecast(upcomingInfo) {
    const containerDiv = e('div', { className: 'forecast-info' }, )
    const currentDiv = document.getElementById('upcoming');
    upcomingInfo.forEach(day => {
        let currSymbol = ''
        switch (day.condition) {
            case "Sunny": currSymbol = weatherSymbols.sunny;break;
            case "Partly Sunny": currSymbol = weatherSymbols.partlySunny;break;
            case "Overcast": currSymbol = weatherSymbols.overcast;break;
            case "Rain": currSymbol = weatherSymbols.rain;break;
            default:break;
        }
        
        const result = e('span', { className: 'upcoming'},
                            e('span', { className: 'symbol'}, currSymbol),
                            e('span', { className: 'forecast-data'}, `${day.low}°/${day.high}°`),
                            e('span', { className: 'forecast-data'}, day.condition))

        
        containerDiv.appendChild(result)
    }) 
    currentDiv.appendChild(containerDiv)                   
}

function e(type, attributes, ...content) {
    const result = document.createElement(type);

    for (let [attr, value] of Object.entries(attributes || {})) {
        if (attr.substring(0, 2) == 'on') {
            result.addEventListener(attr.substring(2).toLocaleLowerCase(), value);
        } else {
            result[attr] = value;
        }
    }

    content = content.reduce((a, c) => a.concat(Array.isArray(c) ? c : [c]), []);

    content.forEach(e => {
        if (typeof e == 'string' || typeof e == 'number') {
            const node = document.createTextNode(e);
            result.appendChild(node);
        } else {
            result.appendChild(e);
        }
    });

    return result;
}