import TrackPlayer from 'react-native-track-player'

export default state => {
    switch (state) {
        case TrackPlayer.STATE_PLAYING:
            console.log('STATE_PLAYING')
            break;
        case TrackPlayer.STATE_NONE:
            console.log('STATE_NONE')
            
            break;
        case TrackPlayer.STATE_PAUSED:
            console.log('STATE_PAUSED')
            
            break;
        case TrackPlayer.STATE_STOPPED:
            console.log('STATE_STOPPED')
            
            break;
        case TrackPlayer.STATE_CONNECTING:
            console.log('STATE_CONNECTING')
            
            break;
        case TrackPlayer.STATE_BUFFERING:
            console.log('STATE_BUFFERING')
            
            break;
        default:
            break;
    }
}