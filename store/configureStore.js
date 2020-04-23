import { createStore, combineReducers } from "redux";
import { playerState } from './reducers/playerStateReducer'


export default createStore(combineReducers({playerState}))