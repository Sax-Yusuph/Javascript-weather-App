const notification = document.getElementById('notification');
const weatherIcon = document.getElementById('weatherIcon');
const temperatureValue = document.getElementById('temperatureValue');
const tempDescription = document.getElementById('temperatureDescription');
const locationElement = document.getElementById('location');

const key = '82005d27a116c2880c8f0fcb866998a0';

const weather={};

weather.temperature ={
    unit: 'celcius'
}



// if it supports, set position or show error
let setPosition = (position) =>{
    const lat = position.coords.latitude;
    const long = position.coords.longitude
    getWeather(lat,long);
}

let showError = (err)=>{
    notification.style.display = 'block';
    notification.innerText = err.message;
    console.log(err);
}


// display weather to ui
let displayWeather =()=>{
    weatherIcon.innerHTML =`<img src="../icons/${weather.iconId}.png" class="img-fluid"/>`
    temperatureValue.innerHTML = `${weather.temperature.value} °<span>C</span>`;
    tempDescription.innerHTML = weather.description;
    locationElement.innerHTML =`${weather.name}, ${weather.countryCode}`
}

// ping user on network status every 1s
function timePings(data){
    if (data == undefined){
        console.log('fetching data...');
    }else(
        clearInterval(ping)
    )
}
// use position to get date from api

let getWeather = async (lat, long) =>{
    const api = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${key}`
    let res = await fetch(api);
    let data = await res.json();
    console.log(data);
    let ping = setInterval(timePings(data), 1000);
    weather.temperature.value = Math.floor(data.main.temp - 273);
    weather.description = data.weather[0].description;
    weather.iconId = data.weather[0].icon;
    weather.name = data.name;
    weather.countryCode = data.sys.country;

    displayWeather();
   

}



// checks if browser supports geolocation

if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else{
    notification.style.display = 'block';
    notification.innerText = 'Oops!! your app doesn\'t support geolocation'
}

let toFarenheit = (t)=> (t*5/9) + 32;

temperatureValue.addEventListener('click', ()=>{
        if(weather.temperature.value!== undefined){
            if (weather.temperature.unit === 'celcius'){
                let farenheit = toFarenheit(weather.temperature.value);
                farenheit = Math.floor(farenheit);
                temperatureValue.innerHTML = `${fahrenheit}°<span>F</span>`;
                weather.temperature.unit = "fahrenheit"
            }else{
                temperatureValue.innerHTML = `${weather.temperature.value}°<span>C</span>`;
                weather.temperature.unit = "celsius"
            }
            
        }
})