const yourWeather=document.querySelector(".tab1");
const searchWeather=document.querySelector(".tab2")

const apiKey = 'b3aa9d9496c3448c855200415230407';

const locationAccess = document.querySelector(".location-access");
const searchBar = document.querySelector(".search-bar");
const loadingScreen = document.querySelector(".loading-screen");
const weatherInfo = document.querySelector(".your-weather");
const errorScreen = document.querySelector(".error")

const searchButton = document.querySelector("#search-button");
const grantAccessButton = document.querySelector("#grant-access");

let currentTab=yourWeather;

currentTab.classList.add("tab-background");
getFromStorage();


function switchTab(clickedTab){

    if(currentTab!=clickedTab){
        currentTab.classList.remove("tab-background");
        currentTab=clickedTab;
        currentTab.classList.add("tab-background");

        if(!searchBar.classList.contains("active")){
            searchBar.classList.add("active");
            weatherInfo.classList.remove("active");
            locationAccess.classList.remove("active");
        }

        else{
            searchBar.classList.remove("active");


            getFromStorage();
        }
    }



}

function getFromStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");

    if(!localCoordinates){
        locationAccess.classList.add("active");
    }

    else{
        const coordinates=JSON.parse(localCoordinates);
        weatherInfo.classList.add("active");
        fetchWeatherInfo(coordinates);
    }
}


yourWeather.addEventListener("click" , ()=>
    switchTab(yourWeather),
)


searchWeather.addEventListener("click" , ()=>
    switchTab(searchWeather)
)


async function fetchWeatherInfo(coordinates){

    const {lat,long} = coordinates;

    locationAccess.classList.remove("active");
    loadingScreen.classList.add("active");
    weatherInfo.classList.remove("active");

    try{
        const resp = await fetch(
            `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${long}`
            )
        let data = await resp.json() ; 

        loadingScreen.classList.remove("active");
        weatherInfo.classList.add("active");

        renderData(data);
        
    }

    catch(err){
        // locationAccess.classList.add("active");
        // alert("location access unabled")
    }
}


function renderData(weatherInfo){

    
    
    const placeName=document.querySelector("#place-name");
    // const placeFlag=document.querySelector("#place-Flag");
    const weatherType = document.querySelector("#weather-type");
    const weatherImage = document.querySelector("#weather-image");
    const temprature = document.querySelector("#temprature");
    const windSpeed = document.querySelector(".windspeed");  
    const humidityData = document.querySelector(".humidity");
    const cloudsData = document.querySelector(".clouds");

    


    placeName.innerText = weatherInfo?.location?.name;
    weatherType.innerText = weatherInfo?.current?.condition?.text;
    
    weatherImage.src = weatherInfo?.current?.condition?.icon;
    
    temprature.innerText = weatherInfo?.current?.temp_c;
    
    windSpeed.innerText= weatherInfo?.current?.wind_kph;
    
    humidityData.innerText = `${weatherInfo?.current?.humidity}%`;
    cloudsData.innerText = `${weatherInfo?.current?.cloud}%`;

   
}


async function fetchWeatherInfoCity(city){

    loadingScreen.classList.add("active");
    weatherInfo.classList.remove("active");
    locationAccess.classList.remove("active");
    errorScreen.classList.remove("active");

    try{
        const resp = await fetch(
            `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
            );



        let data = await resp.json() ; 

        if(data?.location?.name===undefined){
            // alert("invalid input");
            loadingScreen.classList.remove("active"),
            errorScreen.classList.add("active")
        }

        else{

        loadingScreen.classList.remove("active");
        weatherInfo.classList.add("active");

        renderData(data);        
        }
    }

    catch(err){

        alert("Invalid Input")
    }
}

const searchInput = document.querySelector("[data-searchbar]")


searchBar.addEventListener("submit" , (e)=>{

    e.preventDefault();
    cityName = searchInput.value;

    if(cityName===""){
        return;
    }

    else{
        fetchWeatherInfoCity(cityName);
    }
}
)


function getlocation(){
    if(navigator.geolocation){

        navigator.geolocation.getCurrentPosition(showPosition);
        locationAccess.classList.remove("active");
        loadingScreen.classList.add("active");
        weatherInfo.classList.remove("active");

    }

    else(
        locationAccess.classList.add("active"),
        alert("Location Access Denied")
    )
}

function showPosition(position){

    const usercoordinates = {
    lat: position.coords.latitude,
    long: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates" , JSON.stringify(usercoordinates));

    fetchWeatherInfo(usercoordinates);
}

grantAccessButton.addEventListener("click" , getlocation);







