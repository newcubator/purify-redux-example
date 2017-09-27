import { Dispatch, Middleware } from "redux";
import "whatwg-fetch";
import {
    LocateMe,
    GeoLocation,
    LocationError,
    Weather,
    ShowTemperature,
    WeatherError,
    ShowError,
    RequestWeather,
    WeatherAction
} from "./domain";

// backend constants
const OPEN_WEATHER_MAP_WEATHER_ENDPOINT = "http://samples.openweathermap.org/data/2.5/weather";
const OPEN_WEATHER_MAP_APP_ID = "b1b15e88fa797225412429c1c50c122a1";

/**
 * Translates WeatherActions into Promises and performs side effects
 */
export function interpret(action: WeatherAction): Promise<WeatherAction | void> {
    switch (action.type) {
        case "LocateMe":
            return getGeoLocation().then(
                location => interpret(action.next(location)),
                error => interpret(action.fail(error))
            );
        case "RequestWeather":
            return requestWeather(action.location).then(
                weather => interpret(action.next(weather)),
                error => interpret(action.fail(error))
            );
        case "ShowTemperature":
            return showTemperature(action.temperature);
        case "ShowError":
            return showError(action.error);
    }
}

/**
 * Redux middleware which interprets WeatherActions, alternative impl of the interpret function
 */
export const middleware: Middleware = (api) => (next): any => (action: WeatherAction) => {
    next(action);

    switch (action.type) {
        case "LocateMe":
            return getGeoLocation().then(
                location => api.dispatch(action.next(location)),
                error => api.dispatch(action.fail(error))
            );
        case "RequestWeather":
            return requestWeather(action.location).then(
                weather => api.dispatch(action.next(weather)),
                error => api.dispatch(action.fail(error))
            );
        case "ShowTemperature":
            return showTemperature(action.temperature);
        case "ShowError":
            return showError(action.error);
    }
};

// helper function to get the geo location
export function getGeoLocation(): Promise<GeoLocation> {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition
            navigator.geolocation.getCurrentPosition(
                position => resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }),
                error => reject({
                    name: "LocationError",
                    message: { // error mapping table
                        [error.PERMISSION_DENIED]: "User denied the request for Geolocation.",
                        [error.POSITION_UNAVAILABLE]: "The request to get user location timed out.",
                        [error.TIMEOUT]: "The request to get user location timed out."
                    }[error.code]
                })
            );
        } else {
            reject({
                name: "LocationError",
                message: "Geo location tracking not supported."
            });
        }
    });
}

// helper function to fetch weather data
export function requestWeather(location: GeoLocation): Promise<Weather> {
    // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
    // https://openweathermap.org/current#geo
    return window.fetch(
        OPEN_WEATHER_MAP_WEATHER_ENDPOINT +
        `?lat=${location.latitude}` +
        `&lon=${location.longitude}` +
        `&appid=${OPEN_WEATHER_MAP_APP_ID}`
    ).then(
        response => response.json()
    ).then(
        (json) => ({
            temperatureInKelvin: parseFloat(json.main.temp)
        })
    );
}

// helper function to access view element
export function showTemperature (temperature: number): Promise<void> {
    const tempElement = document.getElementById("temp");
    if (tempElement) {
        tempElement.innerHTML = `${
            (Math.round(temperature * 100) / 100).toLocaleString(
                undefined,
                {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1
                }
            )} °C`;
    }
    return Promise.resolve();
}

// helper function to display an error
export function showError (error: Error): Promise<void> {
    alert(`Error: ${error.message}`);
    console.error(error.message);
    return Promise.resolve();
}
