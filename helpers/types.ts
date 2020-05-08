import { Track } from "react-native-track-player";
import { Action as ReduxAction } from "redux";

export interface ContinuationInfos {

}

export interface YtTrack extends Track {
    videoId: string,
}

export interface Playlist {
    tracks: Track[],
    id: string,
    name: string
}

export interface Action extends ReduxAction {
    value?: any
}