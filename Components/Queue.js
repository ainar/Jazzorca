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
                    onPress={track => skip(track, action => this.props.dispatch(action))}
                    keyExtractor={track => track.id.toString()}
                />
            </JOScreen>
        )
    }
}

const mapStateToProps = (state) => {
    let queue = []
    for (let [queueId, videoId] of state.playerState.queue) {
        queue.push(({
            ...state.playerState.cache[videoId],
            id: queueId
        }))
    }
    return {
        queue: queue
    }
}

export default connect(mapStateToProps)(Queue)