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

export function playNow(track, cache) {
    return async dispatch => {
        dispatch(fetchStart())
        await TrackPlayer.pause()
        const newTrack = await getTrack(track, cache)
        dispatch(addToQueue(newTrack))
        TrackPlayer.getQueue()
            .then(queue => {
                if (queue.length > 1) TrackPlayer.skip(newTrack.id)
            })
        TrackPlayer.getState()
            .then(state => {
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

export function addToQueue(track) {
    return async dispatch => {
        await TrackPlayer.add(track)
        dispatch({
            type: 'ADD_TRACK',
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
        dispatch({
            type: 'ADD_TO_HISTORY',
            value: track
        })
    }
}

export function skip(trackId) {
    TrackPlayer.skip(trackId)
    TrackPlayer.play()
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