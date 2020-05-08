import TrackPlayer from 'react-native-track-player'

export async function skipToPrevious() {
    return TrackPlayer.getPosition()
        .then(position => {
            if (position > 1)
                return TrackPlayer.seekTo(0)
            else
                return TrackPlayer.skipToPrevious()
        })
}