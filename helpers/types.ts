import StaticServer from 'react-native-static-server';

import { Track, State as RNTPState, STATE_PLAYING, STATE_NONE, STATE_PAUSED } from "react-native-track-player";
import { ThunkAction, ThunkDispatch } from "redux-thunk";
import { JOState } from "../store/configureStore";
import { ContinuationInfos } from "../API/YouTubeAPI";

export type TrackPlayerState = RNTPState

export const RNTPSTATE_PLAYING = STATE_PLAYING;
export const RNTPSTATE_NONE = STATE_NONE;
export const RNTPSTATE_PAUSED = STATE_PAUSED;

export interface ResultJOTrack {
    id?: string,
    videoId: string,
    artwork: { uri: string },
    title: string,
    artist: string,
    duration: number,
    lengthText: string,
    relations?: number
}

export interface RelatedTracks {
    results: ResultJOTrack[],
    continuationInfos: ContinuationInfos
}

export interface JOTrack extends Track {
    videoId: string,
    autoPlay?: boolean,
    downloadJobId?: number
}

export interface HistoryJOTrack extends JOTrack {
    videoId: string,
    timestamp: number,
    related: RelatedTracks
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
            server: StaticServer,
            sonos: any
        }
    }
}