import { Track } from "react-native-track-player";
import { Action as ReduxAction } from "redux";

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
        results: Track[],
        continuationInfos: ContinuationInfos
    }
}

export interface Playlist {
    tracks: Track[],
    id: string,
    name: string
}

export interface Action extends ReduxAction {
    value?: any
}