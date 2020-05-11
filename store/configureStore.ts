import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware } from "redux";
import { playerState, PlayerState } from './reducers/playerStateReducer'
import { history, HistoryState } from './reducers/historyReducer'
import { playlists, PlaylistsState } from './reducers/playlistsReducer'
import { persistCombineReducers } from 'redux-persist'
import AsyncStorage from '@react-native-community/async-storage'

const rootPersistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['history', 'playlists'] // only navigation will be persisted
}
const loggerMiddleware = createLogger()

export interface State {
    playerState: PlayerState,
    history: HistoryState,
    playlists: PlaylistsState
}

export default createStore(
    persistCombineReducers(
        rootPersistConfig,
        { playerState, history, playlists }
    ),
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )
)