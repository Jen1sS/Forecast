let latitude = 0;
let longitude = 0;

function setup() {
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(getPosition, showError);
    else console.log("Geolocation is not supported by this browser.");
}

async function getWeatherData() {
    let data = await fetch("https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&current=temperature_2m,apparent_temperature,is_day,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&forecast_days=16");
    data = await data.json();
    console.log(data);

    //City name
    let cityName = await fetch("http://api.openweathermap.org/geo/1.0/reverse?lat=" + latitude + "&lon=" + longitude + "&limit=1&appid=338c368cb25b78485b10801247c80b37");
    cityName = await cityName.json();

    if (cityName[0].name === undefined) document.getElementById("dataPos").innerHTML += "Latitude " + latitude + " | Longitude " + longitude;
    else document.getElementById("dataPos").innerHTML += cityName[0].name + " | " + cityName[0].country;

    //Weather icon
    document.getElementById("top").innerHTML += "<img src=\"./img/weather_codes/" + data.daily.weather_code[0] + ".png\" class=\"status\">";

    //filling next days
    const next = document.getElementById("next");
    const time = data.daily.time;
    const code = data.daily.weather_code;
    const maxTemp = data.daily.temperature_2m_max;
    const minTemp = data.daily.temperature_2m_min;


    for (let i = 1; i < data.daily.time.length; i++) {
        const month = getMonth(time[i].substring(6, 7));
        const day = time[i].substring(8) 

        next.innerHTML += "<div class=\"inside\">  <h3>" + day + " " + month + "</h3> <hr class=\"vertical\"> <p> Max Temperature: <br> " + maxTemp[i] + "</p> <hr class=\"vertical\"> <p> Min Temperature: <br> " + minTemp[i] + "</p> <hr class=\"vertical\"> <img src=\"./img/weather_codes/" + code[i] + ".png\" class=\"status\" > </div>";
    }

    //FILLING NEXT HOURS
    const hours = document.getElementById("a");
    const t = new Date();
    let hour = t.getHours()+1;

    for (let i=hour; i<hour+25;i++){
        hours.innerHTML += "<div class=\"minihour\">"+data.hourly.time[i].substring(11)+" <img src=\"./img/weather_codes/" + data.hourly.weather_code[i] + ".png\" class=\"mini\">"+data.hourly.temperature_2m[i]+"°C </div>"
    }

    //SETTING WIND SPEED
    document.getElementById("windS").innerHTML += "<img src=\"./img/wind.png\" class=\"status\" id=\"wind\"> <p>"+data.current.wind_speed_10m + "km/h </p>";

    //SETTING UV INDEX
    document.getElementById("uv").innerHTML += data.daily.uv_index_max[0]

    //SETTING WIND DIRECTION
    document.getElementById("arrow").style.transform += "rotate("+data.current.wind_direction_10m+"deg)";
    document.getElementById("degree").innerHTML += data.current.wind_direction_10m+" deg";

    //TEMPERATURE
    document.getElementById("temperature").innerHTML += "<p> Current: "+data.current.temperature_2m+"°C</p>";
    document.getElementById("temperature").innerHTML += "<p> Percieved: "+data.current.apparent_temperature+"°C</p>";

    //DAY OR NIGHT
    img = "day";
    if (!data.current.is_day) {
        img = "night";
        darkMode();
    }

    document.getElementById("c").innerHTML += "<img src=\"./img/" + img + ".png\" id=\"day\"> <h1>Weather</h1>";

}

function getPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    console.log("Getting data for:\n(latitude) " + latitude + " \n(longitude) " + longitude)
    getWeatherData();
}

function showError(error) {
    console.log("Geolocation error: " + error.message);
    longitude = 144.9633;
    latitude = -37.814;

    setTimeout(()=>{
        document.getElementById("dataPos").innerHTML += " - Error: " + error.message;
    },1000)

    getWeatherData();
}

function getMonth(date) {
    switch (parseInt(date)) {
        case 1:
            return "January";
        case 2:
            return "Febuary";
        case 3:
            return "March";
        case 4:
            return "April";
        case 5:
            return "May";
        case 6:
            return "June";
        case 7:
            return "July";
        case 8:
            return "August";
        case 9:
            return "September";
        case 10:
            return "October";
        case 11:
            return "November";
        case 12:
            return "December";
    }
}

function darkMode(){
    document.getElementsByTagName("header")[0].style.background = "#031b6a";
    document.getElementsByTagName("header")[0].style.color = "white";
    document.getElementsByTagName("body")[0].style.background = "#010E3A";
    document.getElementsByTagName("body")[0].style.color = "#FFFFFF";
    document.getElementsByTagName("body")[0].style.color = "#FFFFFF";

    for (let i=0;i<document.getElementsByClassName("vertical").length;i++){
        document.getElementsByClassName("vertical")[i].style.background = "white";
    }

    for (let i=0;i<document.getElementsByTagName("hr").length;i++){
        document.getElementsByTagName("hr")[i].style.border = "0.25rem solid rgb(255,255,255)";
    }

    for (let i=0;i<document.getElementsByClassName("status").length;i++){
        document.getElementsByClassName("status")[i].style.filter = "invert(1)";
    }

    for (let i=0;i<document.getElementsByClassName("mini").length;i++){
        document.getElementsByClassName("mini")[i].style.filter = "invert(1)";
    }
}