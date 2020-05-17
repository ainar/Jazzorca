import StaticServer from 'react-native-static-server';

import { Track, State as RNTPState, STATE_PLAYING } from "react-native-track-player";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { JOState } from "../store/configureStore";
import { ContinuationInfos } from "../API/YouTubeAPI";

export type TrackPlayerState = RNTPState

export const RNTPSTATE_PLAYING = STATE_PLAYING

export interface ResultJOTrack {
    videoId: string,
    artwork: { uri: string },
    title: string,
    artist: string,
    duration: number,
    lengthText: string,
    relations?: number
}

export interface JOTrack extends Track {
    videoId: string,
    autoPlay?: boolean
}

export interface HistoryJOTrack extends JOTrack {
    videoId: string,
    timestamp: number,
    related: {
        results: ResultJOTrack[],
        continuationInfos: ContinuationInfos
    }
}

export interface Playlist {
    tracks: JOTrack[],
    id: string,
    name: string
}

export type JOAction = { type: string, value?: any };

export type JOThunkAction = ThunkAction<Promise<any>, JOState, null, JOAction>;

export type JOThunkDispatch = ThunkDispatch<JOState, null, JOAction>;

declare global {
    namespace NodeJS {
        interface Global {
            server: StaticServer
        }
    }
}