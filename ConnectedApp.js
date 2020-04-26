import React from 'react'
import { View, StatusBar } from 'react-native'
import Navigation from './Navigation/Navigation'
import { connect } from 'react-redux'
import TrackPlayer from 'react-native-track-player'
import { add, seekTo, reset } from './helpers/playerControls'

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
            ({ nextTrack, position }) => this._setCurrentTrack(nextTrack, position)
        )
    }

    _setPlayerState(state) {
        this.props.dispatch({
            type: 'SET_STATE',
            value: state
        })
    }

    _setCurrentTrack(queueId, position) {
        if (queueId !== undefined) {
            seekTo(0)
            const track = this.props.cache[this.props.queue.get(queueId)]
            this.props.dispatch({
                type: 'SKIP_TO_TRACK',
                value: track.videoId
            })

            // if it's the last track, add a related track
            if (this.props.queue.size > 0) {
                if (Array.from(this.props.queue)[this.props.queue.size - 1][0] === queueId) {
                    const related = track.related.results
                    const unseenRelatedTrack = related.find(t => Array.from(this.props.queue).findIndex(tq => tq[1] === t.videoId) === -1)
                    add(unseenRelatedTrack, this.props.dispatch, this.props.cache)
                }
            }
        }
    }

    componentWillUnmount() {
        const { dispatch } = this.props
        dispatch(reset())
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
