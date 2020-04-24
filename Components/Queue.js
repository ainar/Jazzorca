import React, { Component } from 'react'
import JOTitle from './Elements/JOTitle'
import JOTrackList from './JOTrackList'
import JOScreen from './JOScreen'
import { connect } from 'react-redux'
import { skip } from '../helpers/playerControls'

class Queue extends Component {
    render() {
        return (
            <JOScreen>
                <JOTitle>File d'attente</JOTitle>
                <JOTrackList
                    data={this.props.queue}
                    onPress={async track => skip(track, action => this.props.dispatch(action))}
                    keyExtractor={track => track.id.toString()}
                />
            </JOScreen>
        )
    }
}

const mapStateToProps = (state) => {
    if (mapStateToProps.queueSize !== state.playerState.queue.size) {
        mapStateToProps.queue = Array.from(state.playerState.queue)
            .map(([queueId, videoId]) => ({ ...state.playerState.cache[videoId], id: queueId }))
        mapStateToProps.queueSize = state.playerState.queue.size;
    }

    return {
        queue: mapStateToProps.queue
    }
}

export default connect(mapStateToProps)(Queue)