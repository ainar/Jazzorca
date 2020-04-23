import TrackPlayer from 'react-native-track-player'
import { appendTracksWithoutDuplicate } from '../../helpers/utils'

const initState = {
    playerState: TrackPlayer.STATE_NONE,
    loading: false,
    currentTrack: undefined,
    cache: {},
    queue: new Map()
}

export function playerState(state = initState, action) {
    let newState, newCache
    switch (action.type) {
        case 'SET_STATE':
            if (action.value === TrackPlayer.STATE_BUFFERING ||
                action.value === TrackPlayer.STATE_CONNECTING) {

                newState = {
                    ...state,
                    loading: true
                }
            } else {
                newState = {
                    ...state,
                    loading: false,
                    playerState: action.value
                }
            }
            return newState || state

        case 'SKIP_TO_TRACK':
            if (action.value !== undefined)
                newState = {
                    ...state,
                    currentTrack: action.value.videoId,
                    currentPositionInQueue: action.value.id
                }
            return newState || state


        case 'ADD_TRACK':
            newCache = { ...state.cache }
            if (newCache[action.value.videoId] === undefined)
                newCache[action.value.videoId] = action.value
            else
                newCache[action.value.videoId] = { ...newCache[action.value.videoId], ...action.value }

            let newQueue = new Map(state.queue)
            newQueue.set(action.value.id, action.value.videoId)

            newState = {
                ...state,
                cache: newCache,
                queue: newQueue
            }
            return newState || state

        case 'ADD_RELATED':
            newCache = { ...state.cache }
            newCache[state.currentTrack].related = {
                results: appendTracksWithoutDuplicate(newCache[state.currentTrack].related.results, action.value.results),
                continuationInfos: action.value.continuationInfos
            }

            newState = {
                ...state,
                cache: newCache
            }
            return newState || state

        default:
            return state
    }
}