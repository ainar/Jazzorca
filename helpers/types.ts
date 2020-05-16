import { Track } from "react-native-track-player";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { State } from "../store/configureStore";

export interface ContinuationInfos {

}

export interface JOTrack extends Track {
    videoId: string,
    autoPlay?: boolean
}

export interface HistoryJOTrack extends JOTrack {
    videoId: string,
    timestamp: number,
    related: {
        results: JOTrack[],
        continuationInfos: ContinuationInfos
    }
}

export interface Playlist {
    tracks: JOTrack[],
    id: string,
    name: string
}

export type JOAction = { type: string, value?: any }

export type JOThunkAction = ThunkAction<Promise<any>, State, null, JOAction>;

export type JOThunkDispatch = ThunkDispatch<State, null, JOAction>