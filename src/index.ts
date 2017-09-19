import { compose, applyMiddleware, createStore, combineReducers, Store, Reducer } from "redux";
import * as devtools from "redux-devtools-extension";
import { middleware as weatherMiddleware } from "./middleware";
import { showWeatherNearMe } from "./show-weather-near-me";

console.log("Welcome. Have a look at the redux dev tools to inspect the dispatched actions.");

// create the redux store
const store = createStore(
    // dummy reducer
    (state, action) => null,
    {},
    devtools.composeWithDevTools(
        applyMiddleware(
            // plug in our middleware
            weatherMiddleware
        )
    )
);

// fetch weather and display it
store.dispatch(showWeatherNearMe());
