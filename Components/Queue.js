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
                    onPress={track => skip(track.id)}
                    keyExtractor={track => track.id}
                />
            </JOScreen>
        )
    }
}

const mapStateToProps = (state) => {
    if (mapStateToProps.queueSize !== state.playerState.queue.size) {
        mapStateToProps.queue = Array.from(state.playerState.queue)
            .map(([queueId, track]) => ({ ...track, id: queueId }))
        mapStateToProps.queueSize = state.playerState.queue.size;
    }

    return {
        queue: mapStateToProps.queue
    }
}

export default connect(mapStateToProps)(Queue)