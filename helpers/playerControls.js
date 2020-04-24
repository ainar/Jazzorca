import TrackPlayer, { STATE_BUFFERING, STATE_NONE, STATE_PAUSED, STATE_PLAYING, STATE_READY, STATE_STOPPED } from 'react-native-track-player';
import { getTrackFromYT } from '../API/YouTubeAPI';

export { STATE_BUFFERING, STATE_NONE, STATE_PAUSED, STATE_PLAYING, STATE_READY, STATE_STOPPED }

export async function playNow(track, dispatch, cache) {
    const fetchStart = {
        type: 'FETCHING',
        value: true
    }

    const fetchStop = {
        type: 'FETCHING',
        value: false
    }

    dispatch(fetchStart)
    return pause()
        .then(() => add(track, dispatch, cache))
        .then(newTrack => skip(newTrack, dispatch))
        .then(() => play())
        .then(() => dispatch(fetchStop))
}

export async function add(track, dispatch, cache) {
    if( typeof add.counter == 'undefined' ) {
        add.counter = 0;
    }
    const id = add.counter
    add.counter++;

    let ytTrack = {}
    if (cache[track.videoId] === undefined || cache[track.videoId].url === undefined) {
        ytTrack = await getTrackFromYT(track.videoId)
    } else {
        ytTrack = cache[track.videoId]
    }

    const newTrack = {
        ...track,
        ...ytTrack,
        id: id.toString()
    }

    dispatch({
        type: 'ADD_TRACK',
        value: newTrack
    })
    await TrackPlayer.add(newTrack)
    return newTrack
}

export async function skip(track, dispatch) {
    TrackPlayer.skip(track.id)
    TrackPlayer.play()
    return track
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