
/**
 * Weather DSL
 */
export type WeatherAction = LocateMe | RequestWeather | ShowTemperature | ShowError;

export interface LocateMe {
    type: "LocateMe";
    next: (location: GeoLocation) => WeatherAction;
    fail: (error: LocationError) => WeatherAction;
}

export interface GeoLocation {
    latitude: number;
    longitude: number;
}

export interface RequestWeather {
    type: "RequestWeather";
    location: GeoLocation;
    next: (weather: Weather) => WeatherAction;
    fail: (error: WeatherError) => WeatherAction;
}

export interface Weather {
    temperatureInKelvin: number;
}

export interface ShowTemperature {
    type: "ShowTemperature";
    temperature: number;
}

export interface LocationError extends Error {
    name: "LocationError";
}

export interface WeatherError extends Error {
    name: "WeatherError";
}

export interface ShowError {
    type: "ShowError";
    error: LocationError | WeatherError;
}
