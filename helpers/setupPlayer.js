import TrackPlayer from 'react-native-track-player'

export default async function setupPlayer () {
    const playerOptions = {
        // One of RATING_HEART, RATING_THUMBS_UP_DOWN, RATING_3_STARS, RATING_4_STARS, RATING_5_STARS, RATING_PERCENTAGE
        ratingType: TrackPlayer.RATING_5_STARS,

        // Whether the player should stop running when the app is closed on Android
        stopWithApp: true,

        // An array of media controls capabilities
        // Can contain CAPABILITY_PLAY, CAPABILITY_PAUSE, CAPABILITY_STOP, CAPABILITY_SEEK_TO,
        // CAPABILITY_SKIP_TO_NEXT, CAPABILITY_SKIP_TO_PREVIOUS, CAPABILITY_SET_RATING
        capabilities: [
            TrackPlayer.CAPABILITY_PLAY,
            TrackPlayer.CAPABILITY_PAUSE,
            TrackPlayer.CAPABILITY_SEEK_TO,
            TrackPlayer.CAPABILITY_STOP,
            TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
            TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,

        ],

        // An array of capabilities that will show up when the notification is in the compact form on Android
        compactCapabilities: [
            TrackPlayer.CAPABILITY_PLAY,
            TrackPlayer.CAPABILITY_PAUSE,
            TrackPlayer.CAPABILITY_STOP,
        ],

        maxCacheSize: 200000
    }

    
    return TrackPlayer.updateOptions(playerOptions)
}