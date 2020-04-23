import React from 'react'
import { View, StatusBar } from 'react-native'
import Navigation from './Navigation/Navigation'
import { connect } from 'react-redux'
import TrackPlayer from 'react-native-track-player'
import { add, seekTo } from './helpers/playerControls'

class ConnectedApp extends React.Component {
    constructor(props) {
        super(props)

        // Init
        TrackPlayer.getState()
            .then(state => this._setPlayerState(state))

        TrackPlayer.getCurrentTrack()
            .then(trackId => this._setCurrentTrack(trackId))

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
        this.props.dispatch({
            type: 'SET_STATE',
            value: state
        })
    }

    _setCurrentTrack(queueId) {
        if (queueId !== undefined) {
            seekTo(0)
            const track = this.props.cache[this.props.queue.get(queueId)]
            this.props.dispatch({
                type: 'SKIP_TO_TRACK',
                value: track
            })

            // if it's the last track, add a related track
            if (this.props.currentTrack !== undefined) {
                TrackPlayer.getQueue()
                    .then(queue => {
                        if (queue.findIndex(t => t.videoId === this.props.currentTrack) === queue.length - 1) {
                            const related = this.props.cache[this.props.currentTrack].related.results
                            const unseenRelatedTrack = related.find(t => queue.findIndex(tq => tq.videoId === t.videoId) === -1)
                            add(unseenRelatedTrack, this.props.dispatch, this.props.cache)
                        }
                    })
            }
        }
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
