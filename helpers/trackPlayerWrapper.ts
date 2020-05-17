import RNTrackPlayer, { Track } from 'react-native-track-player'
import { JOTrack, RNTPSTATE_NONE } from './types';

namespace JOTrackPlayer {
    export async function skipToPrevious() {
        return RNTrackPlayer.getPosition()
            .then(position => {
                if (position > 1) {
                    return JOTrackPlayer.seekTo(0);
                }

                if (global.sonos !== undefined) {
                    return new Promise((resolve) => {
                        global.sonos.previous((err: any, movedToPrevious: boolean) => resolve({ err, movedToPrevious }))
                    })
                }

                return RNTrackPlayer.skipToPrevious();
            });
    }

    export async function skip(trackId: string) {
        if (global.sonos !== undefined) {
            return new Promise((resolve, reject) => {
                // global.sonos.next((err: any, movedToPrevious: boolean) => resolve({ err, movedToPrevious }))
                reject("non implemented");
            })
        }
        return RNTrackPlayer.skip(trackId)
            .then(() => RNTrackPlayer.play())
    }

    export async function play() {
        if (global.sonos !== undefined) {
            return new Promise((resolve) => {
                global.sonos.play(undefined, (err: any, playing: boolean) => resolve({ err, playing }));
            });
        }
        return RNTrackPlayer.play();
    }

    export async function pause() {
        if (global.sonos !== undefined) {
            return new Promise((resolve) => {
                global.sonos.pause((err: any, paused: boolean) => resolve({ err, paused }));
            });
        }
        return RNTrackPlayer.pause();
    }

    export async function skipToNext() {
        if (global.sonos !== undefined) {
            return new Promise((resolve) => {
                global.sonos.next((err: any, movedToNext: boolean) => resolve({ err, movedToNext }));
            });
        }
        return RNTrackPlayer.skipToNext();
    }

    export async function add(tracks: Track | Track[]) {
        if (global.sonos !== undefined) {
            return new Promise((resolve, reject) => {
                if (Array.isArray(tracks)) {
                    reject("non implemented");
                    return;
                }
                global.sonos.queue(
                    tracks.url.uri,
                    0,
                    (err: any, movedToNext: boolean) => resolve({ err, movedToNext })
                );
            });
        }

        return RNTrackPlayer.add(tracks)
    }

    export async function reset() {
        if (global.sonos !== undefined) {
            return new Promise((resolve) => {
                global.sonos.flush((err: any, flushed: boolean) => resolve({ err, flushed }));
            });
        }
        return RNTrackPlayer.reset()
    }

    export async function getQueue() {
        if (global.sonos !== undefined) {
            return new Promise<JOTrack[]>((resolve, reject) => {
                console.warn("non implemented")
                resolve([]);
            });
        }
        return RNTrackPlayer.getQueue()
    }

    export async function getState() {
        if (global.sonos !== undefined) {
            return new Promise((resolve, reject) => {
                console.warn("non implemented");
                resolve(RNTPSTATE_NONE);
            });
        }
        return RNTrackPlayer.getState();
    }

    export async function remove(trackId: string | string[]) {
        if (global.sonos !== undefined) {
            return new Promise((resolve, reject) => {
                reject("non implemented")
            });
        }
        return RNTrackPlayer.remove(trackId)
    }

    export async function seekTo(seconds: number) {
        return RNTrackPlayer.seekTo(seconds)
    }

    export type State = RNTrackPlayer.State
}

export default JOTrackPlayer