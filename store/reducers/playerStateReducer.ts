import TrackPlayer, { Track, State } from 'react-native-track-player'
import { appendTracksWithoutDuplicate } from '../../helpers/utils'
import { JOAction, JOTrack } from '../../helpers/types'

export enum Device {
    Local = "local",
    Sonos = "sonos"
}

export enum PLAYER_STATE_ACTION_TYPES {
    SET_STATE = "SET_STATE",
    SKIP_TO_TRACK = "SKIP_TO_TRACK",
    RESET_CURRENT_TRACK = "RESET_CURRENT_TRACK",
    ADD_TRACK = "ADD_TRACK",
    REMOVE_FROM_QUEUE = "REMOVE_FROM_QUEUE",
    ADD_RELATED = "ADD_RELATED",
    RESET_QUEUE = "RESET_QUEUE",
    FETCHING = "FETCHING",
    SWITCH_SONOS = "SWITCH_SONOS"
}

export interface PlayerState {
    playerState: State,
    loading: boolean,
    currentTrack: JOTrack | undefined,
    cache: { [k: string]: JOTrack },
    queue: JOTrack[],
    device: Device
}

const initState: PlayerState = {
    playerState: TrackPlayer.STATE_NONE,
    loading: false,
    currentTrack: undefined,
    cache: {},
    queue: [],
    device: Device.Local
}

export function playerState(state = initState, action: JOAction): PlayerState {
    let newState, newCache, newQueue
    switch (action.type) {
        case PLAYER_STATE_ACTION_TYPES.SET_STATE:
            if (action.value === TrackPlayer.STATE_BUFFERING) {
                newState = {
                    ...state,
                    loading: true
                };
            } else {
                newState = {
                    ...state,
                    loading: false,
                    playerState: action.value
                };
            };
            return newState || state;

        case PLAYER_STATE_ACTION_TYPES.SKIP_TO_TRACK:
            if (action.value !== undefined) {
                newState = {
                    ...state,
                    currentTrack: action.value
                };
            }
            return newState || state;

        case PLAYER_STATE_ACTION_TYPES.RESET_CURRENT_TRACK:
            newState = {
                ...state,
                currentTrack: undefined
            };
            return newState || state;

        case PLAYER_STATE_ACTION_TYPES.ADD_TRACK:
            newCache = { ...state.cache }
            if (newCache[action.value.videoId] === undefined) {
                newCache[action.value.videoId] = action.value;
            } else {
                newCache[action.value.videoId] = { ...newCache[action.value.videoId], ...action.value };
            }

            newQueue = [...state.queue];
            newQueue.push({ ...action.value, id: action.value.id });

            newState = {
                ...state,
                cache: newCache,
                queue: newQueue
            };
            return newState || state;

        case PLAYER_STATE_ACTION_TYPES.REMOVE_FROM_QUEUE:
            newQueue = [...state.queue.filter(t => t.id !== action.value.id)];
            newState = {
                ...state,
                queue: newQueue
            };
            return newState || state;

        case PLAYER_STATE_ACTION_TYPES.ADD_RELATED:
            if (state.currentTrack === undefined) {
                console.error('current track is undefined');
                return state;
            }

            newCache = { ...state.cache };
            const currentTrackVideoId = state.currentTrack.videoId;
            newCache[currentTrackVideoId].related = {
                results: appendTracksWithoutDuplicate(
                    newCache[currentTrackVideoId].related.results,
                    action.value.results
                ),
                continuationInfos: action.value.continuationInfos
            };

            newState = {
                ...state,
                cache: newCache
            };
            return newState || state;

        case PLAYER_STATE_ACTION_TYPES.RESET_QUEUE:
            newState = {
                ...state,
                queue: [],
                currentTrack: undefined,
                cache: {}
            };
            return newState || state;

        case PLAYER_STATE_ACTION_TYPES.FETCHING: {
            newState = {
                ...state,
                loading: action.value
            }
            return newState || state;
        }

        case PLAYER_STATE_ACTION_TYPES.SWITCH_SONOS: {
            if (state.device === Device.Local) {
                newState = {
                    ...state,
                    device: Device.Sonos
                };
            } else {
                newState = {
                    ...state,
                    device: Device.Local
                };
            }
            return newState || state;
        }

        default:
            return state;
    }
}