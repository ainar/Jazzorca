import React from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import TrackPlayer from 'react-native-track-player'

import Navigation from './Navigation/Navigation'
import setupPlayer from './helpers/setupPlayer';
import { autoAddToQueue, resetQueue, autoSetCurrentTrack } from './helpers/playerControls'

class ConnectedApp extends React.Component {
    constructor(props) {
        super(props)

        setupPlayer()

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

        if (queueId !== undefined) {
            if (queue === undefined) {
                console.error('queue should be defined here')
            } else {
                const track = queue.find(t => t.id === queueId)
                if (track !== undefined) {
                    dispatch(autoSetCurrentTrack(track))
                }

                // if it's the last track, add a related track
                if (queue.length > 0 && queue[queue.length - 1].id === queueId) {
                    this._addRelatedTrackToQueue(track)
                }
            }
        }
    }

    async _addRelatedTrackToQueue(track) {
        const { queue, dispatch } = this.props
        const related = track.related.results
        const unseenRelatedTrack = related.find(
            t => queue.findIndex(tq => tq.videoId === t.videoId) === -1
        )
        dispatch(autoAddToQueue(unseenRelatedTrack))
    }

    componentDidMount() {
        const { dispatch, queue: queueState } = this.props
        TrackPlayer.getQueue()
            .then(queue => {
                if (queue !== undefined && queue.length === 0 && queueState.length > 0) {
                    dispatch(resetQueue())
                }
            })
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'black' }}>
                <Navigation />
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    currentTrack: state.playerState.currentTrack,
    queue: state.playerState.queue
})


export default connect(mapStateToProps)(ConnectedApp)
