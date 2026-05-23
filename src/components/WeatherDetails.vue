<template>
  <section class="weather-data" aria-live="polite" id="weather-data">
    <div class="weatherData">
      <div class="location-info">
        <h3 class="city_header">
          {{ weatherData!.location.name }},
          {{ weatherData!.location.region }}
        </h3>
        <time
          :datetime="`${currentYear}-${currentMonth}-${currentDate}T${currentHour}:${currentMinute}:00`"
          >{{ currentDayOfWeek }}, {{ currentMonthName }} {{ currentDate }},
          {{ currentYear }} {{ currentHour }}:{{ currentMinute }}</time
        >
      </div>
      <div class="main-weather">
        <div class="current-weather weather-info">
          <h3 class="weather_header current">Current Weather</h3>
          <p class="city_temperature">
            {{ weatherData!.current.temp_f }}&#8457;
          </p>
          <p class="city_conditions">
            {{ weatherData?.current.condition.text }}
          </p>
          <img
            :src="weatherData?.current.condition.icon"
            alt="weather icon"
            class="weather-icon"
            height="50px"
            width="50px"
          />
          <section class="city_details" aria-live="polite">
            <div class="detail-item">
              <p class="detail-label"><span class="fas fa-wind"></span> Wind</p>
              <p class="detail-value">
                {{ weatherData!.current.wind_mph }} mph
                {{ weatherData!.current.wind_dir }}
              </p>
            </div>
            <div class="detail-item">
              <p class="detail-label">
                <span class="fas fa-gauge"></span> Pressure
              </p>
              <p class="detail-value">
                {{ weatherData!.current.pressure_mb }} mb
              </p>
            </div>
            <div class="detail-item">
              <p class="detail-label">
                <span class="fa fa-droplet"></span> Humidity
              </p>
              <p class="detail-value">{{ weatherData!.current.humidity }}%</p>
            </div>
            <div class="detail-item">
              <p class="detail-label">
                <span class="fa fa-eye"></span> Visibility
              </p>
              <p class="detail-value">
                {{ weatherData!.current.vis_miles }} miles
              </p>
            </div>
          </section>
        </div>
        <div class="forecast_weather weather-info">
          <h3 class="weather_header forecast">
            {{ weatherData?.forecast.forecastday.slice(1).length }}
            Day Forecast
          </h3>
          <ul class="forecast_list">
            <li
              class="forecast_item"
              v-for="(
                forecast, index
              ) in weatherData?.forecast.forecastday.slice(1)"
            >
              <p class="day">Day {{ Number(index) + 1 }}</p>
              <p class="day">
                {{ getTimeData(`${forecast.date} 00:00`).dayOfWeek }}
              </p>
              <p class="city_conditions">
                {{ forecast.day.condition.text }}
              </p>
              <p class="city_temperature">
                {{ forecast.day.avgtemp_f }}&#8457;
              </p>
              <img
                :src="forecast.day.condition.icon"
                class="weather-icon"
                alt="condition-image"
              />
              <section class="city_details">
                <div class="detail-item">
                  <p class="detail-label">
                    <span class="fa fa-droplet"></span>
                    Humidity
                  </p>
                  <p class="detail-value">{{ forecast.day.avghumidity }}%</p>
                </div>
                <div class="detail-item">
                  <p class="detail-label">
                    <span class="fas fa-cloud-showers-heavy"></span>
                    Chances of Rain
                  </p>
                  <p class="detail-value">
                    {{ forecast.day.daily_chance_of_rain }}%
                  </p>
                </div>
              </section>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps({
  weatherData: Object,
});
let currentTimeData;
let currentYear,
  currentMonth,
  currentMonthName,
  currentDate,
  currentHour,
  currentMinute,
  currentDayOfWeek;
if (props.weatherData) {
  currentTimeData = getTimeData(props.weatherData?.location.localtime);
  ((currentYear = currentTimeData?.year),
    (currentMonth = currentTimeData?.month),
    (currentMonthName = currentTimeData?.monthName),
    (currentDate = currentTimeData?.dateNum),
    (currentHour = currentTimeData?.hour),
    (currentMinute = currentTimeData?.minute),
    (currentDayOfWeek = currentTimeData?.dayOfWeek));
}
function getTimeData(date: string) {
  let year, month, dayOfWeek, monthName, dateNum, hour, minute;

  let timeParts = date.split(" ");
  let dateClass = new Date(`${timeParts[0]} ${timeParts[1]}`);
  year = dateClass.getFullYear();
  month = dateClass.getMonth();
  switch (month) {
    case 1:
      monthName = "January";
      break;
    case 2:
      monthName = "February";
      break;
    case 3:
      monthName = "March";
      break;
    case 4:
      monthName = "April";
      break;
    case 5:
      monthName = "May";
      break;
    case 6:
      monthName = "June";
      break;
    case 7:
      monthName = "July";
      break;
    case 8:
      monthName = "August";
      break;
    case 9:
      monthName = "September";
      break;
    case 10:
      monthName = "October";
      break;
    case 11:
      monthName = "November";
      break;
    case 12:
      monthName = "December";
      break;
  }
  dateNum = dateClass.getDate();
  let day = dateClass.getDay();
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
    case 0:
      dayOfWeek = "Sunday";
      break;
  }
  hour = dateClass.getHours();
  minute = dateClass.getMinutes();
  return { year, monthName, dayOfWeek, dateNum, hour, minute, month };
}
</script>

<style scoped>
section.weather-data {
  text-align: center;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  align-items: center;
  gap: 0.5em;
}

section.weather-data .weatherData {
  width: 100%;
}

div.location-info {
  text-shadow: 0 0 4px rgba(255, 255, 255, 0.2);
}

section.weather-data .weather-info {
  background: var(--card-bg);
  border-radius: 20px;
  box-shadow:
    0 6px 20px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  transition: transform 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: var(--size-value-big);
  gap: 0.5em;
  max-width: 600px;
  width: 50%;
  overflow: hidden;
}

section.weather-data .weather-info:hover {
  transform: translateY(-5px);
}

.main-weather {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column wrap;
  gap: 1em;
}

.weather-data .weather-icon {
  width: 30%;
  margin-inline: auto;
}

.weather-data .city_temperature {
  font-size: var(--size-value-xl);
  background: #ffb36b;

  font-weight: bolder;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.weather-data .city_conditions {
  font-size: var(--font-size-medium);
}

.weather-data .city_details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--size-value-normal);
  width: 100%;
  padding: 14px 18px;
}

.city_details .detail-item {
  font-family: var(--default-sans-serif-font);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--size-value-big);
  border-radius: var(--border-radius-default);
  background: var(--detail-bg);
}

.detail-item .detail-label {
  font-size: 0.9rem;
  font-weight: 400;
  font-style: italic;
  color: #666;
}

.detail-item .detail-value {
  font-size: 1.1rem;
  font-weight: 700;
}

div.main-weather .forecast_weather {
  max-width: unset;
  width: 80%;
}

.forecast_weather .forecast_list {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  list-style: none;
  width: 100%;
  padding-left: 0;
  gap: 1em;
  position: relative;
}

.forecast_weather ul.forecast_list li.forecast_item {
  background: var(--card-bg-2);
  padding: 25px;
  border-radius: 12px;
  padding: 20px;
  position: relative;
}

.forecast_weather ul.forecast_list li.forecast_item .day {
  font-size: clamp(1.25rem, 0.5rem + 1.2vw, 2.5rem);
}

.forecast_weather ul.forecast_list li.forecast_item::after {
  background: var(--card-bg-2);
  position: absolute;
  content: "";
  display: block;
  left: 0;
}

.forecast_weather ul.forecast_list li.forecast_item:last-child::after {
  display: none;
}

@media (max-width: 1299px) {
  section.weather-data .weather-info {
    width: 65%;
    max-width: 600px;
  }
  .forecast_weather ul.forecast_list li.forecast_item::after {
    width: 100%;
    top: 101%;
    height: 3px;
  }
}

@media (min-width: 1300px) {
  .forecast_weather ul.forecast_list li.forecast_item::after {
    height: 100%;
    width: 3px;
    left: 102%;
    top: 0;
  }
}

@media (max-width: 496px) {
  section.weather-data .weather-info {
    width: 90%;
    max-width: unset;
  }
}
</style>
