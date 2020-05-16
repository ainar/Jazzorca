import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid'

import { Playlist, JOAction, JOTrack, JOThunkAction, RNTPSTATE_PLAYING } from '../helpers/types';

import JOTrackPlayer from '../helpers/trackPlayerWrapper'
import { getTrack } from '../API/YouTubeAPI';

const fetchStart = (): JOAction => ({
    type: 'FETCHING',
    value: true
});

const fetchStop = (): JOAction => ({
    type: 'FETCHING',
    value: false
});

export const resetQueue = (): JOAction => ({
    type: 'RESET_QUEUE'
});

export const removePlaylist = (playlist: Playlist): JOAction => ({
    type: 'REMOVE_PLAYLIST',
    value: playlist.id
});

export const addToPlaylist = (playlistId: string, track: JOTrack): JOAction => ({
    type: 'ADD_TRACK_TO_PLAYLIST',
    value: {
        playlistId: playlistId,
        track: { ...track, id: uuid() }
    }
});

export const removeFromPlaylist = (playlistId: string, trackId: string): JOAction => ({
    type: 'REMOVE_TRACK_FROM_PLAYLIST',
    value: {
        playlistId: playlistId,
        trackId: trackId
    }
});

export const setCurrentTrack = (track: JOTrack): JOAction => ({
    type: 'SKIP_TO_TRACK',
    value: track
});

export const resetCurrentTrack = (): JOAction => ({
    type: 'RESET_CURRENT_TRACK'
});

export function reset(): JOAction {
    JOTrackPlayer.reset()
    return resetQueue()
}

export function addPlaylist(playlistName: string): JOAction {
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


export function playNow(track: JOTrack): JOThunkAction {
    return async (dispatch, getState) => {
        const currentTrack = getState().playerState.currentTrack;
        if (currentTrack !== undefined && currentTrack.videoId === track.videoId) {
            return JOTrackPlayer.seekTo(0); // seek to 0 if already playing
        }
        dispatch(fetchStart());
        dispatch(setCurrentTrack(track));
        await JOTrackPlayer.pause();
        await dispatch(manualAddToQueue(track));
        await JOTrackPlayer.getQueue().then(queue => {
            if (queue.length > 1) {
                JOTrackPlayer.skip(queue[queue.length - 1].id);
            }
        });
        await JOTrackPlayer.getState().then(state => {
            if (state !== RNTPSTATE_PLAYING) {
                JOTrackPlayer.play();
            }
        });
        return dispatch(fetchStop());
    }
}

function addToQueue(track: JOTrack): JOThunkAction {
    return async (dispatch) => {
        await JOTrackPlayer.add(track)
        return dispatch({
            type: 'ADD_TRACK',
            value: track
        });
    }
}

export function autoAddToQueue(track: JOTrack): JOThunkAction {
    return async (dispatch, getState) => {
        const { cache } = getState().playerState
        const newTrack = {
            ...await getTrack(track, cache),
            autoPlay: true
        }
        return dispatch(addToQueue(newTrack))
    }
}

export function manualAddToQueue(track: JOTrack, keepId = false): JOThunkAction {
    return async (dispatch, getState) => {
        const { queue, cache } = getState().playerState;
        const lastInQueue = queue[queue.length - 1]
        if (lastInQueue !== undefined && lastInQueue.autoPlay !== undefined && lastInQueue.autoPlay === true) {
            await dispatch(removeFromQueue(lastInQueue))
        }

        try {
            const ytTrack = await getTrack(track, cache, keepId)
            const newTrack = {
                ...ytTrack,
                autoPlay: false
            };
            console.log(ytTrack)
            return dispatch(addToQueue(newTrack));
        } catch (e) {
            throw "cannot get track";
        }
    }
}

export function removeFromQueue(track: JOTrack): JOThunkAction {
    return async (dispatch) => {
        JOTrackPlayer.remove(track.id)
        return dispatch({
            type: 'REMOVE_FROM_QUEUE',
            value: track
        })
    }
}

export function autoSetCurrentTrack(track: JOTrack): JOThunkAction {
    if (track === undefined) {
        console.error('track is undefined')
    }

    return async (dispatch) => {
        dispatch(setCurrentTrack(track))
        return dispatch({
            type: 'ADD_TO_HISTORY',
            value: track
        })
    }
}

export function playPlaylist(playlist: Playlist, trackId: string): JOThunkAction {
    return async (dispatch) => {
        dispatch(reset());

        for (let track of playlist.tracks) {
            try {
                await dispatch(manualAddToQueue(track, true));
                if (track.id === trackId) {
                    JOTrackPlayer.skip(trackId);
                }
            } catch (error) {
                console.error('cannot add track ' + track.videoId + ' to queue: ' + error);
            }
        };
    }
}