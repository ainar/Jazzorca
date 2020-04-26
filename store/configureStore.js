import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createStore, combineReducers, applyMiddleware } from "redux";
import { playerState } from './reducers/playerStateReducer'

const loggerMiddleware = createLogger()

export default createStore(
    combineReducers({ playerState }),
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )
)