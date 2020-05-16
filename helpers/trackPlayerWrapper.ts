import RNTrackPlayer, { Track } from 'react-native-track-player'

namespace JOTrackPlayer {
    export async function skipToPrevious() {
        return RNTrackPlayer.getPosition()
            .then(position => {
                if (position > 1) {
                    return RNTrackPlayer.seekTo(0);
                } else {
                    return RNTrackPlayer.skipToPrevious();
                }
            });
    }

    export async function skip(trackId: string) {
        return RNTrackPlayer.skip(trackId)
            .then(() => RNTrackPlayer.play())
    }

    export async function play() {
        return RNTrackPlayer.play()
    }

    export async function pause() {
        return RNTrackPlayer.pause()
    }

    export async function skipToNext() {
        return RNTrackPlayer.skipToNext()
    }

    export async function add(tracks: Track | Track[]) {
        return RNTrackPlayer.add(tracks)
    }

    export async function reset() {
        return RNTrackPlayer.reset()
    }

    export async function getQueue() {
        return RNTrackPlayer.getQueue()
    }

    export async function getState() {
        return RNTrackPlayer.getState()
    }

    export async function remove(trackId: string | string[]) {
        return RNTrackPlayer.remove(trackId)
    }

    export async function seekTo(seconds: number) {
        return RNTrackPlayer.seekTo(seconds)
    }

    export type State = RNTrackPlayer.State
}

export default JOTrackPlayer