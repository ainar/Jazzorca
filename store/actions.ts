import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid'
import RNFS from 'react-native-fs';
import { NetworkInfo } from "react-native-network-info";

import { Playlist, JOAction, JOTrack, JOThunkAction, RNTPSTATE_PLAYING, HistoryJOTrack, ResultJOTrack } from '../helpers/types';

import JOTrackPlayer from '../helpers/trackPlayerWrapper'
import { getTrack } from '../API/YouTubeAPI';
import { JOACTION_TYPES } from './configureStore';
import { Device } from './reducers/playerStateReducer';

const fetchStart = (): JOAction => ({
    type: 'FETCHING',
    value: true
});

const fetchStop = (): JOAction => ({
    type: 'FETCHING',
    value: false
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

export function resetQueue(): JOThunkAction {
    JOTrackPlayer.reset();
    return async (dispatch, getState) => {
        getState().playerState.queue.forEach(t => {
            if (t.downloadJobId !== undefined) {
                RNFS.stopDownload(t.downloadJobId); // Stop downloads from queue.
                RNFS.unlink(RNFS.DocumentDirectoryPath + '/sonos/' + t.videoId + '.mp4');
            }
        })
        return dispatch({
            type: 'RESET_QUEUE'
        });
    };
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

        try {
            await JOTrackPlayer.pause();
        } catch (e) {
            throw 'error while pausing:\n' + e;
        }

        if (global.sonos === undefined) {
            JOTrackPlayer.reset();
        }

        try {
            await dispatch(manualAddToQueue(track));
        } catch (e) {
            throw 'error while adding to queue:\n' + e;
        }

        if (global.sonos !== undefined) {
            // buffering time
            setTimeout(() => JOTrackPlayer.play(), 5000);
        } else {
            try {
                await JOTrackPlayer.getQueue().then((queue) => {
                    if (queue.length > 1) {
                        JOTrackPlayer.skip(queue[queue.length - 1].id);
                    }
                });
            } catch (e) {
                throw 'error while retrieving the queue:\n' + e;
            }
            try {
                await JOTrackPlayer.getState().then(state => {
                    if (state !== RNTPSTATE_PLAYING) {
                        JOTrackPlayer.play();
                    }
                });
            } catch (e) {
                throw 'error while playing:\n' + e;
            }
        }

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

function addToDeviceQueue(track: JOTrack | ResultJOTrack , autoPlay: boolean, keepId: boolean): JOThunkAction {
    return async (dispatch, getState) => {
        const { cache, device } = getState().playerState;
        const quality = (device === Device.Sonos) ? [141, 140, 139] : undefined; // mp4 audio only

        let ytTrack;
    
        try {
            ytTrack = await getTrack(track, cache, keepId, quality)
        } catch(e) {
            throw "failed to get track:\n" + e;
        }
    
        let newTrack = {
            ...ytTrack,
            autoPlay
        };

        if (device === Device.Sonos) {
            const directory = RNFS.DocumentDirectoryPath + '/sonos/';
            RNFS.mkdir(directory);

            const toFile = directory + ytTrack.videoId + '.mp4';
            const { jobId } = RNFS.downloadFile({
                fromUrl: ytTrack.url.uri,
                toFile
            });

            newTrack = {
                ...newTrack,
                downloadJobId: jobId,
                url: { uri: global.server._origin + "/sonos/" + ytTrack.videoId + '.mp4' }
            };
        }

        return dispatch(addToQueue(newTrack));
    }
}

export function autoAddToQueue(track: JOTrack | ResultJOTrack): JOThunkAction {
    return async (dispatch) => {
        return dispatch(addToDeviceQueue(track, true, false))
    }
}

export function manualAddToQueue(track: JOTrack, keepId = false): JOThunkAction {
    return async (dispatch, getState) => {
        const { queue } = getState().playerState;
        const lastInQueue = queue[queue.length - 1];
        if (lastInQueue !== undefined && lastInQueue.autoPlay !== undefined && lastInQueue.autoPlay === true) {
            await dispatch(removeFromQueue(lastInQueue));
        }

        return dispatch(addToDeviceQueue(track, false, true));
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
        throw 'track is undefined\n';
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
        dispatch(resetQueue());

        for (let track of playlist.tracks) {
            try {
                await dispatch(manualAddToQueue(track, true));
                if (track.id === trackId) {
                    JOTrackPlayer.skip(trackId);
                }
            } catch (error) {
                throw 'cannot add track ' + track.videoId + ' from playlist ' + playlist.id + ' to queue:\n' + error;
            }
        };
    }
}

export function switchSonos(sonos: any): JOThunkAction {
    console.log(global.server);
    return async (dispatch, getState) => {
        const currentDevice = getState().playerState.device;
        let device;
        if (currentDevice !== Device.Sonos) {
            device = Device.Sonos;
            global.sonos = sonos;
            if (!global.server.started) {
                global.server.start();
            }
        } else {
            device = Device.Local;
            global.sonos = undefined;
            if (global.server.started) {
                global.server.stop();
            }
        }
        const localhost = await NetworkInfo.getIPV4Address();
        return dispatch({
            type: JOACTION_TYPES.SET_DEVICE,
            value: { device, localhost }
        });
    }
}

export const setPlayerState = (state: JOTrackPlayer.State) => ({
    type: 'SET_STATE',
    value: state
});