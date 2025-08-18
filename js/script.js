const userInput = document.getElementById("form_input");
const weatherForm = document.getElementById("weather-form");
const card = document.getElementById("weather_container");
const weatherData = document.getElementById("weather-data");
const apiKey = "e843c3ec2cc4460abec201140252407";
weatherForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    let city = userInput.value;
    if (city) {
        try {
            const weatherData = await getWeatherData(city);
            displayWeatherInfo(weatherData);
        } catch (error) {
            console.error(error);
            displayError(
                "Failed to fetch data either due to an incorrect city or a failed internet connection",
            );
        }
    } else {
        displayError("Please enter a city");
    }
});

async function getWeatherData(city) {
    const apiURL = `https://api.weatherapi.com/v1/current.json?key=e843c3ec2cc4460abec201140252407&q=${city}&aqi=yes`;
    const response = await fetch(apiURL);
    let data = await response.json();
    if (!response.ok) {
        displayError("Could not fetch weather data");
        throw new Error("Could not fetch weather data");
    }
    return data;
}

async function displayWeatherInfo(data) {
    let {
        location: { name: city, country: country, localtime: fullDate },
        current: {
            temp_f: temp,
            condition: { text: condition, icon: image },
            wind_mph: windSpeed,
            wind_dir: direction,
            pressure_mb: pressure,
            humidity: humidity,
            vis_miles: visibility,
        },
    } = data;
    weatherData.innerHTML = "";
    weatherData.style.display = "flex";
    let cityName = document.createElement("h2");
    cityName.classList.add("city_h2");
    cityName.textContent = `${city}, ${country}`;
    let timeElem = document.createElement("time");
    let timeParts = fullDate.split("-");
    let dateTime = timeParts[2];
    let timeParts2 = dateTime.split(" ");
    let dateClass = new Date(
        `${timeParts[0]}-${timeParts[1]}-${timeParts2[0]} ${timeParts2[1]}`,
    );
    let year = dateClass.getFullYear();
    year = year.toString();
    let month = dateClass.getMonth();
    month = month.toString();
    switch (month) {
        case "1":
            month = "January";
            break;
        case "2":
            month = "February";
            break;
        case "3":
            month = "March";
            break;
        case "4":
            month = "April";
            break;
        case "5":
            month = "May";
            break;
        case "6":
            month = "June";
            break;
        case "7":
            month = "July";
            break;
        case "8":
            month = "August";
            break;
        case "9":
            month = "September";
            break;
        case "10":
            month = "October";
            break;
        case "11":
            month = "November";
            break;
        case "12":
            month = "December";
            break;
    }
    let date = dateClass.getDate();
    date = date.toString().padStart(2, "0");
    let day = dateClass.getDay();
    let dayOfWeek;
    switch (day) {
        case 1:
            dayOfWeek = "Monday";
            break;
        case 2:
            dayOfWeek = "Tuesday";
            break;
        case 3:
            dayOfWeek = "Wednesday";
            break;
        case 4:
            dayOfWeek = "Thursday";
            break;
        case 5:
            dayOfWeek = "Friday";
            break;
        case 6:
            dayOfWeek = "Saturday";
            break;
        case 7:
            dayOfWeek = "Sunday";
            break;
    }
    let hour = dateClass.getHours();
    let minute = dateClass.getMinutes();
    timeElem.setAttribute(
        "datetime",
        `${year}-${month}-${date}T${hour}:${minute}:00`,
    );
    timeElem.classList.add("city_time");
    timeElem.textContent = `${dayOfWeek}, ${month} ${date}, ${year} ${hour
        .toString()
        .padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
    let tempElem = document.createElement("p");
    tempElem.classList.add("city_temperature");
    tempElem.textContent = `${temp}°F`;
    let conditionElem = document.createElement("p");
    conditionElem.classList.add("city_conditions");
    conditionElem.textContent = condition;
    let iconElem = document.createElement("img");
    iconElem.src = image;
    iconElem.alt = condition;
    iconElem.classList.add("weather-icon");
    iconElem.height = "50px";
    iconElem.width = "50px";
    let cityDetails = document.createElement("section");
    cityDetails.classList.add("city_details");
    cityDetails.setAttribute("aria-live", "polite");
    let detailItem1 = document.createElement("div");
    let windElem = document.createElement("p");
    windElem.classList.add("detail-label");
    windElem.textContent = `Wind`;
    let windSpeedElem = document.createElement("p");
    windSpeedElem.classList.add("detail-value");
    windSpeedElem.textContent = `${windSpeed} mph ${direction}`;
    detailItem1.classList.add("detail-item");
    detailItem1.append(windElem, windSpeedElem);
    let detailItem2 = document.createElement("div");
    let pressureElem = document.createElement("p");
    pressureElem.classList.add("detail-label");
    pressureElem.textContent = `Pressure`;
    let pressureValueElem = document.createElement("p");
    pressureValueElem.classList.add("detail-value");
    pressureValueElem.textContent = `${pressure} mb`;
    detailItem2.append(pressureElem, pressureValueElem);
    detailItem2.classList.add("detail-item");
    let detailItem3 = document.createElement("div");
    let humidityElem = document.createElement("p");
    humidityElem.classList.add("detail-label");
    humidityElem.textContent = `Humidity`;
    let humidityValueElem = document.createElement("p");
    humidityValueElem.classList.add("detail-value");
    humidityValueElem.textContent = `${humidity}%`;
    detailItem3.append(humidityElem, humidityValueElem);
    detailItem3.classList.add("detail-item");
    let detailItem4 = document.createElement("div");
    let visibilityElem = document.createElement("p");
    visibilityElem.classList.add("detail-label");
    visibilityElem.textContent = `Visibility`;
    let visibilityValueElem = document.createElement("p");
    visibilityValueElem.classList.add("detail-value");
    visibilityValueElem.textContent = `${visibility} miles`;
    detailItem4.append(visibilityElem, visibilityValueElem);
    detailItem4.classList.add("detail-item");
    cityDetails.append(detailItem1, detailItem2, detailItem3, detailItem4);
    weatherData.append(
        cityName,
        timeElem,
        iconElem,
        tempElem,
        conditionElem,
        cityDetails,
    );
    card.appendChild(weatherData);
}
function displayError(message) {
    const errorDisplay = document.createElement("p");
    errorDisplay.textContent = message;
    errorDisplay.classList.add("errorDisplay");
    weatherData.innerHTML = "";
    weatherData.style.display = "flex";
    weatherData.append(errorDisplay);
}
