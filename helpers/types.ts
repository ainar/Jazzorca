import { Track } from "react-native-track-player";

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