import TrackPlayer, { STATE_PLAYING, Track } from 'react-native-track-player';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid'

import { getTrackFromYT } from '../API/YouTubeAPI';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { Playlist, Action } from '../helpers/types';
import { Dispatch } from 'react';
import { AnyAction } from 'redux';


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
    let ytTrack, id;
    if (cache[track.videoId] === undefined || cache[track.videoId].url === undefined) {
        ytTrack = await getTrackFromYT(track.videoId);
    } else {
        ytTrack = cache[track.videoId];
    }

    if (track.id !== undefined) {
        id = track.id;
    } else {
        id = uuid();
    }

    return {
        ...track,
        ...ytTrack,
        id: id,
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
        const ytTrack = await getTrack(track, cache)
            .catch(e => console.error('cannot get track ' + track.videoId));

        if (ytTrack === undefined)
            return

        const newTrack = {
            ...ytTrack,
            autoPlay: false
        };

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

export async function skip(trackId: string) {
    await TrackPlayer.skip(trackId)
    return TrackPlayer.play()
}

export function reset() {
    TrackPlayer.reset()
    return resetQueue()
}

export function addPlaylist(playlistName: string) {
    const playlist: Playlist = {
        tracks: [],
        name: playlistName,
        id: uuid()
    }

    return {
        type: 'ADD_PLAYLIST',
        value: playlist
    }
}

export function addToPlaylist(playlistId: string, track: Track) {
    return {
        type: 'ADD_TRACK_TO_PLAYLIST',
        value: {
            playlistId: playlistId,
            track: track
        }
    }
}

export function removeFromPlaylist(playlistId: string, trackId: string) {
    return {
        type: 'REMOVE_TRACK_FROM_PLAYLIST',
        value: {
            playlistId: playlistId,
            trackId: trackId
        }
    }
}

export function playPlaylist(playlist: Playlist, trackId: string) {
    return async (dispatch: (a: any) => Promise<any>) => {
        await dispatch(reset());
        for (let track of playlist.tracks) {
            await dispatch(manualAddToQueue(track))
                .catch(e => console.error('cannot add track ' + track.videoId + ' to queue'));
        };
        await skip(trackId);
    }
}