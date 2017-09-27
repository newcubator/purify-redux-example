import {
    LocateMe,
    GeoLocation,
    LocationError,
    Weather,
    ShowTemperature,
    WeatherError,
    ShowError,
    RequestWeather
} from "./domain";

/**
 * Pure implementation of a domain function which requests the user's geo location, fetches weather data for that
 * location and displays the temperature to the user. This is a sample of a pure, self-contained domain function.
 */
export function showTemperatureNearMe(): LocateMe {
    return {
        type: "LocateMe",
        next: (location: GeoLocation): RequestWeather => ({
            type: "RequestWeather",
            location,
            next: (weather: Weather): ShowTemperature => ({
                type: "ShowTemperature",
                temperature: convertKelvinToCelsius(weather.temperatureInKelvin)
            }),
            fail: (error: WeatherError): ShowError => ({
                type: "ShowError",
                error
            })
        }),
        fail: (error: LocationError): ShowError => ({
            type: "ShowError",
            error
        })
    };
}

export const convertKelvinToCelsius = (kelvin: number): number => kelvin - 273.15;
