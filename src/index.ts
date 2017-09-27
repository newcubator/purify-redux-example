import { compose, applyMiddleware, createStore, combineReducers, Store, Reducer } from "redux";
import * as devtools from "redux-devtools-extension";
import { middleware as weatherMiddleware } from "./weather/interpreter";
import { showTemperatureNearMe } from "./weather/show-temperature-near-me";

console.log("Welcome. Have a look at the redux dev tools to inspect the dispatched actions.");

// create the redux store
const store = createStore(
    // dummy reducer, not needed for this example
    (state, action) => null,
    {},
    devtools.composeWithDevTools(
        applyMiddleware(
            // plug in our middleware
            weatherMiddleware
        )
    )
);

// fetch temperature and display it
store.dispatch(showTemperatureNearMe());
