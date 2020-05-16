import TrackPlayer from 'react-native-track-player'


export async function skipToPrevious() {
    const position = await TrackPlayer.getPosition();
    if (position > 1)
        return TrackPlayer.seekTo(0);
    else
        return TrackPlayer.skipToPrevious();
}

export async function skip(trackId: string) {
    await TrackPlayer.skip(trackId)
    return TrackPlayer.play()
}

const JOTrackPlayer: typeof TrackPlayer = {
    ...TrackPlayer,
    skipToPrevious,
    skip
}

export default JOTrackPlayer