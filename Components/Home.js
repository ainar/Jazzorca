import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import JOTrackList from './JOTrackList'
import JOScreen from './JOScreen'
import JOTitle from './Elements/JOTitle'
import { playNow } from '../helpers/playerControls'

export class Home extends Component {
    _onPress(track) {
        const { cache, queue } = this.props
        return this.props.dispatch(playNow(track, cache, queue))
    }

    render() {
        return (
            <JOScreen>
                <JOTitle>Dernières écoutes</JOTitle>
                <JOTrackList
                    data={this.props.lastListened}
                    onPress={track => this._onPress(track)}
                />
            </JOScreen>
        )
    }
}

const styles = StyleSheet.create({

})

const mapStateToProps = (state) => {
    let lastListened = [], i = 0
    const history = state.history.history
    while (lastListened.length < 20 && i < history.length) {
        const ht = history[i]

        if (lastListened.findIndex(t => t.videoId === ht.videoId) === -1) {
            lastListened.push(ht)
        }

        ++i
    }

    return {
        lastListened: lastListened,
        cache: state.playerState.cache,
        queue: state.playerState.queue
    }
}


export default connect(mapStateToProps)(Home)
