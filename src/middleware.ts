import { Dispatch, Middleware } from "redux";
import "whatwg-fetch";
import {
    LocateMe,
    GeoLocation,
    LocationError,
    Weather,
    ShowTemperature,
    WeatherError,
    ShowErrorMessage,
    RequestWeather
} from "./domain";

const OPEN_WEATHER_MAP_WEATHER_ENDPOINT = "http://samples.openweathermap.org/data/2.5/weather";
const OPEN_WEATHER_MAP_APP_ID = "b1b15e88fa797225412429c1c50c122a1";

// helper type for type inference inside switch statement
type Action = LocateMe | RequestWeather | ShowTemperature | ShowErrorMessage;

// redux middleware
export const middleware: Middleware = (api) => (next): any => (action: Action) => {
    next(action);

    switch (action.type) {
        case "LocateMe":
            // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition
            if (navigator.geolocation) {
                return navigator.geolocation.getCurrentPosition(
                    (position: Position) => api.dispatch(
                        action.next({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        })
                    ),
                    (error: PositionError) => api.dispatch({
                        type: "ShowErrorMessage",
                        error: {
                            name: "LocationError",
                            message: { // error mapping table
                                [error.PERMISSION_DENIED]: "User denied the request for Geolocation.",
                                [error.POSITION_UNAVAILABLE]: "The request to get user location timed out.",
                                [error.TIMEOUT]: "The request to get user location timed out."
                            }[error.code]
                        }
                    })
                );
            } else {
                return api.dispatch(action.fail({
                    name: "LocationError",
                    message: "Geo location tracking not supported."
                }));
            }
        case "RequestWeather":
            // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
            // https://openweathermap.org/current#geo
            return window.fetch(
                OPEN_WEATHER_MAP_WEATHER_ENDPOINT +
                `?lat=${action.location.latitude}` +
                `&lon=${action.location.longitude}` +
                `&appid=${OPEN_WEATHER_MAP_APP_ID}`
            ).then(
                response => response.json()
            .then(
                json => json && json.main && json.main.temp ? json.main.temp : Promise.reject({
                    name: "OpenWeatherMapRequestError",
                    message: "Unexpected response format"
                })
            )
            ).then(
                temp => api.dispatch(
                    action.next({
                        temperatureInKelvin: temp
                    })
                ),
                error => api.dispatch(
                    action.fail({
                        name: "WeatherError",
                        message: error.toString()
                    })
                )
            );
        case "ShowTemperature":
            const tempElement = document.getElementById("temp");
            if (tempElement) {
                tempElement.innerHTML = action.temperature;
            }
            return;
        case "ShowErrorMessage":
            alert(`Error: ${action.error.message}`);
            console.error(action.error.message);
            return;
    }
};
