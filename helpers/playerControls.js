import TrackPlayer, { STATE_BUFFERING, STATE_NONE, STATE_PAUSED, STATE_PLAYING, STATE_READY, STATE_STOPPED } from 'react-native-track-player';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid'

import { getTrackFromYT } from '../API/YouTubeAPI';


export { STATE_BUFFERING, STATE_NONE, STATE_PAUSED, STATE_PLAYING, STATE_READY, STATE_STOPPED }

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

export function playNow(track) {
    return async (dispatch, getState) => {
        const currentTrack = getState().playerState.currentTrack
        if (currentTrack !== undefined && currentTrack.videoId === track.videoId) {
            return TrackPlayer.seekTo(0)
        }
        await dispatch(fetchStart())
        await dispatch(setCurrentTrack(track))
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

export async function getTrack(track, cache) {
    let ytTrack
    if (cache[track.videoId] === undefined || cache[track.videoId].url === undefined) {
        ytTrack = await getTrackFromYT(track.videoId)
    } else {
        ytTrack = cache[track.videoId]
    }

    return {
        ...track,
        ...ytTrack,
        id: uuid()
    }
}

function addToQueue(track) {
    return async dispatch => {
        await TrackPlayer.add(track)
        return dispatch({
            type: 'ADD_TRACK',
            value: track
        })
    }
}

export function autoAddToQueue(track) {
    return async (dispatch, getState) => {
        const { cache } = getState().playerState
        const newTrack = {
            ...await getTrack(track, cache),
            autoPlay: true
        }
        return dispatch(addToQueue(newTrack))
    }
}

export function manualAddToQueue(track) {
    return async (dispatch, getState) => {
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

export function removeFromQueue(track) {
    return async (dispatch) => {
        await TrackPlayer.remove(track.id)
        dispatch({
            type: 'REMOVE_FROM_QUEUE',
            value: track
        })
    }
}

export function setCurrentTrack(track) {
    return dispatch => {
        dispatch({
            type: 'SKIP_TO_TRACK',
            value: track
        })
    }
}

export function autoSetCurrentTrack(track) {
    if (track === undefined) {
        console.error('track is undefined')
    }
    return dispatch => {
        TrackPlayer.seekTo(0)
        dispatch(setCurrentTrack(track))
        dispatch({
            type: 'ADD_TO_HISTORY',
            value: track
        })
    }
}

export function skip(trackId) {
    TrackPlayer.skip(trackId)
    return TrackPlayer.play()
}

export function reset() {
    TrackPlayer.reset()
    return resetQueue()
}

export async function play() {
    return TrackPlayer.play()
}

export async function pause() {
    return TrackPlayer.pause()
}

export async function stop() {
    return TrackPlayer.stop()
}

export async function skipToNext() {
    return TrackPlayer.skipToNext()
}

export async function skipToPrevious() {
    return TrackPlayer.getPosition()
        .then(position => {
            if (position > 1)
                return TrackPlayer.seekTo(0)
            else
                return TrackPlayer.skipToPrevious()
        })
}

export async function seekTo(seconds) {
    return TrackPlayer.seekTo(seconds)
}