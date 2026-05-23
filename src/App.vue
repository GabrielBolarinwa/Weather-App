<script setup lang="ts">
import { ref, useTemplateRef, watch, type Ref } from "vue";
import Header from "@/components/Header.vue";
import Loader from "@/components/Loader.vue";
import WeatherDetails from "@/components/WeatherDetails.vue";
import Error from "@/components/ErrorDisplay.vue";
type InputType = HTMLInputElement;

const weatherInput = useTemplateRef<InputType>("weatherInput");
let weatherData = ref();
let loadingWeatherData: Ref<boolean, boolean> = ref(false);
let error = ref("");
let timeoutId: number;
const apiKey = "e843c3ec2cc4460abec201140252407";
const controller = new AbortController();
function initiateLoading() {
  error.value = "";
  loadingWeatherData.value = true;
  weatherData.value = undefined;
}

function useCurrentLocation() {
  if ("geolocation" in navigator) {
    let lat;
    let long;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        lat = position.coords.latitude;
        long = position.coords.longitude;
        getWeatherData(`${lat} ${long}`);
      },
      (err) => {
        if (err.code === 0) {
          error.value = "Failed to get location due to unknown error";
        } else if (err.code === 1) {
          error.value =
            "Location Permission denied, allow site to access location in browser settings";
        } else if (err.code === 2) {
          error.value =
            "Failed to get location due to network connectivity issues, please check your network settings";
        } else if (err.code === 3) {
          error.value = "Location fetch timeout due to slow connection";
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  } else {
    error.value =
      "Your browser does not support location detection, please upgrade or try another browser";
  }
}
async function getWeatherData(location: string) {
  if (location.length <= 0) {
    error.value = "Please enter a city";
  } else {
    weatherData.value = await fetchWeatherData(location);
  }
}

async function fetchWeatherData(weatherLocation: string) {
  timeoutId = setTimeout(() => {
    controller.abort();
    loadingWeatherData.value = false;
  }, 10000);

  const apiURL = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${weatherLocation}&days=3&aqi=no&alerts=no`;
  let res = await fetch(apiURL, { signal: controller.signal })
    .then((data) => {
      if (data.status >= 400) {
        error.value =
          "Failed to fetch weather data, check internet connection or enter a correct city name";
      }
      return data.json();
    })
    .catch((e) => {
      console.log(e);
      if (e.name === "AbortError") {
        error.value =
          "Fetching weather data timed out, please check that your internet is working.";
      } else {
        error.value = "Server Connection Failed. Check your network settings";
      }
    })
    .finally(() => {
      loadingWeatherData.value = false;
      clearTimeout(timeoutId);
    });
  return res;
}
</script>

<template>
  <Header />
  <main class="container" id="app_container" role="main">
    <div class="app_heading">
      <h1 class="app_heading_h1">Current Weather</h1>
      <p class="app_heading_p">
        Get Real-Time weather conditions for your location
      </p>
    </div>
    <form
      class="main_form"
      role="search"
      id="app-form"
      @submit.prevent="
        initiateLoading();
        getWeatherData(weatherInput!.value);
      "
    >
      <div class="input-box">
        <label for="form_input" class="offscreen">Search for a city</label>
        <input
          type="text"
          name="form_input"
          placeholder="e.g. New York"
          id="form_input"
          class="form_input"
          :disabled="loadingWeatherData"
          ref="weatherInput"
        />
      </div>
      <div class="weatherButtons">
        <button type="submit" class="form_button">Get Weather</button>
        <button
          class="currentLocation"
          type="button"
          @click="
            initiateLoading();
            useCurrentLocation();
          "
        >
          Use Current Location
        </button>
      </div>
    </form>
    <article class="resultDisplay">
      <Loader v-if="loadingWeatherData && !error" />
      <Error v-if="error" :error="error"></Error>
      <WeatherDetails v-else-if="weatherData" :weatherData="weatherData" />
    </article>
  </main>
</template>

<style>
@import url("assets/variables.css");
@import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
@import url(https://fonts.googleapis.com/css?family=Manrope:200,300,regular,500,600,700,800);
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  transition: 0.5s;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
  overflow-x: hidden;
  color-scheme: dark light;
  forced-color-adjust: none;
}

body {
  background: var(--bg) center/cover fixed no-repeat;
  color: var(--text);
  min-height: 100vh;
  font-family: var(--default-sans-serif);
  font-size: var(--font-size-default);
  position: relative;
  font-weight: 400;
}

body.light {
  --primary: var(--color-blue-light);
  --primary-dark: var(--color-blue);
  --text: var(--color-dark);
  --text-light: var(--color-light);
  --bg: radial-gradient(
    circle at center,
    #ffffff 0%,
    #f3f5f9 55%,
    #e9ecf2 100%
  );
  --loader-border: rgba(0, 0, 0, 0.3);
  --card-bg: var(--color-white);
  --input-border: 1px solid rgba(0, 0, 0, 0.08);
  --card-bg-2: linear-gradient(to bottom, #aacbff, #a0c3ff);
  --detail-bg: rgba(245, 245, 245, 0.7);
}

body.dark {
  --primary: var(--color-blue-light);
  --primary-dark: var(--color-blue);
  --text: var(--color-light);
  --loader-border: rgba(255, 255, 255, 0.3);
  --text-light: var(--color-dark);
  --input-border: 1px solid rgba(255, 255, 255, 0.08);
  --bg: linear-gradient(145deg, #0c1119 0%, #0a141f 50%, #05090f 100%);
  --card-bg: var(--color-dark);
  --card-bg-2: linear-gradient(to bottom, #1a1f27, #14181f);
  --detail-bg: rgba(10, 10, 10, 0.7);
}

body ul {
  padding-left: var(--size-value-big);
}

img {
  display: block;
  max-width: 100%;
  height: auto;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: var(--serif-font-3);
  font-weight: 900;
}

h1 {
  font-size: var(--font-size-large);
}

h2 {
  font-size: var(--font-size-big);
}

h3 {
  font-size: var(--font-size-medium);
}

table,
tr,
td,
th,
caption {
  border: var(--border-default);
  border-collapse: collapse;
  padding: var(--size-value-small);
  font-family: var(--default-sans-serif-font);
}

button {
  font-family: var(--default-sans-serif);
  border: var(--border-default);
  font-size: inherit;
  border-radius: var(--border-radius-default);
  padding: var(--size-value-small);
  transform: scale(1);
  cursor: pointer;
}

button:active {
  transform: scale(0.96);
  transition: 0.25s linear;
}

ul {
  list-style-type: square;
}

ul li::marker {
  color: turquoise;
  font-size: var(--font-size-medium);
}

a {
  color: var(--color-blue-light);
  text-decoration: none;
  transition: none;
}

a:visited {
  color: var(--color-purple);
}

a:hover {
  color: var(--color-light);
  text-decoration: underline;
  transition: 0.25s;
}

a:active {
  color: var(--color-red);
  transition: none;
}

input,
textarea {
  font: inherit;
}

input:is([type="text"], [type="number"]):focus {
  outline: none;
}

input[type="checkbox"] {
  transform: scale(1.5);
  margin: 0 12px 0 3px;
}

/*Reset End*/

/*Utility Classes*/

.nowrap {
  white-space: nowrap;
}

.text-center {
  text-align: center;
}

.hidden {
  visibility: hidden;
}

.offscreen {
  position: absolute !important;
  width: 1px !important;
  margin: -1px !important;
  height: 1px !important;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

.box-center1 {
  display: block;
  margin: auto;
}

.box-center2 {
  display: flex;
  justify-content: center;
  align-items: center;
}

.fa {
  font-size: 1.25rem;
}

/* End Utitlity Classes */

main {
  margin-top: 2.5rem;
}

main .app_heading {
  margin-bottom: var(--size-value-normal);
  text-align: center;
}

main article {
  margin-top: var(--size-value-large);
  position: relative;
  width: 100%;
  height: auto;
}

.container article > * {
  margin-bottom: var(--size-value-big);
}

.container form.main_form {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column wrap;
  gap: var(--size-value-tiny);
  background: var(--card-bg);
  width: 60%;
  margin-inline: auto;
  padding: var(--size-value-big) 0;
  border-radius: var(--border-radius-default);
}

.main_form label.form_label {
  width: min-content;
  padding: 0 var(--size-value-normal) 0 0;
}

.main_form .input-box {
  width: 100%;
  display: flex;
  justify-content: center;
}

.main_form .form_input {
  font-family: var(--default-sans-serif-font);
  font-size: var(--font-size-normal);
  font-weight: normal;
  width: 60%;
  padding: var(--size-value-small);
  padding-left: var(--size-value-big);
  border: var(--input-border);
  border-radius: 10px;
  background: var(--card-bg);
}

.main_form .form_button {
  background: var(--primary-dark);
  border: none;
  color: var(--color-light);
  --size-value-small: 0.75rem;
  padding: var(--size-value-small);
  font-size: var(--font-size-normal);
}

.main_form .weatherButtons {
  margin-top: var(--size-value-small);
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 0.5em;
}

.main_form .currentLocation {
  text-align: center;
  border: none;
  border-radius: 15px;
  background: transparent;
  color: var(--text);
  --size-value-small: 0.75rem;
  font-size: var(--font-size-normal);
  padding: var(--size-value-small);
}

@media (max-width: 425px) {
  div.content {
    padding-top: 1.5rem;
  }
  .container form.main_form {
    width: 90%;
  }
  .main_form .form_input {
    width: 70%;
  }
}

@media (prefers-color-scheme: light) {
  :root {
    --primary: var(--color-blue-light);
    --primary-dark: var(--color-blue);
    --text: var(--color-dark);
    --text-light: var(--color-light);
    --bg: radial-gradient(
      circle at center,
      #ffffff 0%,
      #f3f5f9 55%,
      #e9ecf2 100%
    );
    --card-bg: var(--color-white);
    --input-border: 1px solid rgba(0, 0, 0, 0.08);
    --card-bg-2: linear-gradient(to bottom, #aacbff, #a0c3ff);
    --detail-bg: rgba(245, 245, 245, 0.7);
    --loader-border: rgba(0, 0, 0, 0.3);
  }
}
@media (prefers-color-scheme: dark) {
  :root {
    --primary: var(--color-blue-light);
    --primary-dark: var(--color-blue);
    --text: var(--color-light);
    --text-light: var(--color-dark);
    --bg: linear-gradient(145deg, #0c1119 0%, #0a141f 50%, #05090f 100%);
    --card-bg: var(--color-dark);
    --detail-bg: rgba(10, 10, 10, 0.7);
    --loader-border: rgba(255, 255, 255, 0.3);
    --card-bg-2: linear-gradient(to bottom, #1a1f27, #14181f);
    --input-border: 1px solid rgba(255, 255, 255, 0.08);
  }
}
</style>
