import TrackPlayer, { STATE_PLAYING, Track } from 'react-native-track-player';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid'

import { getTrackFromYT } from '../API/YouTubeAPI';
import { ThunkAction } from 'redux-thunk';


type ThunkResult<R> = ThunkAction<R, any, undefined, any>;

const fetchStart = () => ({
    type: 'FETCHING',
    value: true
})

const fetchStop = () => ({
    type: 'FETCHING',
    value: false
})

export const resetQueue = () => ({
    type: 'RESET_QUEUE'
})

export function playNow(track: Track) {
    return async (dispatch: Function, getState: Function) => {
        const currentTrack = getState().playerState.currentTrack
        if (currentTrack !== undefined && currentTrack.videoId === track.videoId) {
            return TrackPlayer.seekTo(0)
        }
        dispatch(fetchStart())
        dispatch(setCurrentTrack(track))
        await TrackPlayer.pause()
        await dispatch(manualAddToQueue(track))
        await TrackPlayer.getQueue().then(queue => {
            if (queue.length > 1) TrackPlayer.skip(queue[queue.length - 1].id)
        })
        await TrackPlayer.getState().then(state => {
            if (state !== STATE_PLAYING) TrackPlayer.play()
        })
        return dispatch(fetchStop())
    }
}

export async function getTrack(track: Track, cache: { [k: string]: Track }) {
    let ytTrack
    if (cache[track.videoId] === undefined || cache[track.videoId].url === undefined) {
        ytTrack = await getTrackFromYT(track.videoId);
    } else {
        ytTrack = cache[track.videoId];
    }

    return {
        ...track,
        ...ytTrack,
        id: uuid()
    }
}

function addToQueue(track: Track) {
    return async (dispatch: Function) => {
        await TrackPlayer.add(track)
        return dispatch({
            type: 'ADD_TRACK',
            value: track
        })
    }
}

export function autoAddToQueue(track: Track) {
    return async (dispatch: Function, getState: Function) => {
        const { cache } = getState().playerState
        const newTrack = {
            ...await getTrack(track, cache),
            autoPlay: true
        }
        return dispatch(addToQueue(newTrack))
    }
}

export function manualAddToQueue(track: Track) {
    return async (dispatch: Function, getState: Function) => {
        const { queue, cache } = getState().playerState
        const lastInQueue = queue[queue.length - 1]
        if (lastInQueue !== undefined && lastInQueue.autoPlay !== undefined && lastInQueue.autoPlay === true) {
            await dispatch(removeFromQueue(lastInQueue))
        }
        const newTrack = {
            ...await getTrack(track, cache),
            autoPlay: false
        }
        return dispatch(addToQueue(newTrack))
    }
}

export function removeFromQueue(track: Track) {
    return async (dispatch: Function) => {
        await TrackPlayer.remove(track.id)
        dispatch({
            type: 'REMOVE_FROM_QUEUE',
            value: track
        })
    }
}

export function setCurrentTrack(track: Track) {
    return {
            type: 'SKIP_TO_TRACK',
            value: track
    }
}

export function resetCurrentTrack() {
    return {
            type: 'RESET_CURRENT_TRACK'
    }
}

export function autoSetCurrentTrack(track: Track): ThunkResult<void> {
    if (track === undefined) {
        console.error('track is undefined')
    }
    return (dispatch: Function) => {
        TrackPlayer.seekTo(0)
        dispatch(setCurrentTrack(track))
        dispatch({
            type: 'ADD_TO_HISTORY',
            value: track
        })
    }
}

export function skip(trackId: string) {
    TrackPlayer.skip(trackId)
    return TrackPlayer.play()
}

export function reset() {
    TrackPlayer.reset()
    return resetQueue()
}