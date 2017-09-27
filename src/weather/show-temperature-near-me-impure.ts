import {
    getGeoLocation,
    requestWeather,
    showTemperature,
    showError
} from "./interpreter";

import {
    convertKelvinToCelsius
} from "./show-temperature-near-me";

/**
 * Impure implementation of showTemperatureNearMe with mixed up concerns (domain logic, network communication,
 * ui interaction).
 * Violates Single Responsibility Principle because it requires changes not only when the domain logic changes
 * Violates Open/Closed Principle because you cannot plug in anything "in between" the side effects (e.g. dispatch)
 */
export function showTemperatureNearMe(): Promise<void> {
    return getGeoLocation().then(
        location => requestWeather(location)
    ).then(
        weather => showTemperature(
            convertKelvinToCelsius(weather.temperatureInKelvin)
        ),
        error => showError(error)
    );
}
