
export interface DomainAction {
    type: string;
}

export interface LocateMe extends DomainAction {
    type: "LocateMe";
    next: (location: GeoLocation) => DomainAction;
    fail: (error: LocationError) => DomainAction;
}

export interface GeoLocation {
    latitude: number;
    longitude: number;
}

export interface RequestWeather extends DomainAction {
    type: "RequestWeather";
    location: GeoLocation;
    next: (weather: Weather) => DomainAction;
    fail: (error: WeatherError) => DomainAction;
}

export interface Weather {
    temperatureInKelvin: number;
}

export interface ShowTemperature extends DomainAction {
    type: "ShowTemperature";
    temperature: string;
}

export interface LocationError extends Error {
    name: "LocationError";
}

export interface WeatherError extends Error {
    name: "WeatherError";
}

export interface ShowErrorMessage extends DomainAction {
    type: "ShowErrorMessage";
    error: LocationError | WeatherError;
}
