import React from 'react'
import { View, StatusBar } from 'react-native'
import Navigation from './Navigation/Navigation'
import { connect } from 'react-redux'
import TrackPlayer from 'react-native-track-player'
import { getTrack, addToQueue, resetQueue, setCurrentTrack } from './helpers/playerControls'

class ConnectedApp extends React.Component {
    constructor(props) {
        super(props)

        // Event
        TrackPlayer.addEventListener(
            'playback-state',
            ({ state }) => this._setPlayerState(state)
        )

        TrackPlayer.addEventListener(
            'playback-track-changed',
            ({ nextTrack }) => this._setCurrentTrack(nextTrack)
        )
    }

    _setPlayerState(state) {
        const { dispatch } = this.props
        
        dispatch({
            type: 'SET_STATE',
            value: state
        })
    }

    _setCurrentTrack(queueId) {
        const { queue, dispatch } = this.props
        console.log('playback-track-changed')
    
        if (queueId !== undefined) {
            const track = queue.get(queueId)
            dispatch(setCurrentTrack(track))

            // if it's the last track, add a related track
            if (queue.size > 0 && Array.from(queue)[queue.size - 1][0] === queueId) {
                this._addRelatedTrackToQueue(track)
            }
        }
    }

    async _addRelatedTrackToQueue(track) {
        const { queue, dispatch, cache } = this.props
        const related = track.related.results
        const unseenRelatedTrack = related.find(
            t => Array.from(queue)
                .findIndex(tq => tq[1].videoId === t.videoId) === -1
        )
        const newTrack = await getTrack(unseenRelatedTrack, cache)
        dispatch(addToQueue(newTrack))
    }

    componentWillUnmount() {
        console.log('will unmount')
        const { dispatch } = this.props
        dispatch(resetQueue())
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'black' }}>
                <StatusBar translucent={true} backgroundColor={'rgba(0,0,0,0.5)'} />
                <Navigation />
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    currentTrack: state.playerState.currentTrack,
    cache: state.playerState.cache,
    queue: state.playerState.queue
})


export default connect(mapStateToProps)(ConnectedApp)
