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

export function showWeatherNearMe(): LocateMe {
    return {
        type: "LocateMe",
        next: (location: GeoLocation) => ({
            type: "RequestWeather",
            location,
            next: (weather: Weather) => ({
                type: "ShowTemperature",
                temperature: formatTemperature(convertKelvinToCelsius(weather.temperatureInKelvin))
            }),
            fail: (error: WeatherError) => ({
                type: "ShowErrorMessage",
                error
            })
        }),
        fail: (error: LocationError) => ({
            type: "ShowErrorMessage",
            error
        })
    };
}

const convertKelvinToCelsius = (kelvin: number): number => kelvin - 273.15;

const formatTemperature = (temperature: number): string => `${(Math.round(temperature * 100) / 100).toLocaleString(
    undefined,
    {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    }
)} °C`;

// export function showWeatherNearMe(): LocateMe {
//     return {
//         type: "LocateMe",
//         next: requestWeather,
//         fail: showErrorMessage
//     };
// }

// function requestWeather(location: GeoLocation): RequestWeather {
//     return {
//         type: "RequestWeather",
//         location,
//         next: showTemperature,
//         fail: showErrorMessage
//     };
// }

// function showTemperature(weather: Weather): ShowTemperature {
//     return {
//         type: "ShowTemperature",
//         temperature: formatTemperature(convertKelvinToCelsius(weather.temperatureInKelvin))
//     };
// }

// function showErrorMessage(error: LocationError | WeatherError): ShowErrorMessage {
//     return {
//         type: "ShowErrorMessage",
//         error
//     };
// }
