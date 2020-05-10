import React, { Component, ComponentProps } from 'react'
import { connect } from 'react-redux'
import TrackList from './Elements/TrackList'
import Screen from './Screen'
import JOTitle from './Elements/JOTitle'
import { playNow } from '../store/actions'
import { Track } from 'react-native-track-player'

export class Home extends Component<ComponentProps<any>> {
    async _onPress(track: Track) {
        return this.props.dispatch(playNow(track))
    }

    render() {
        return (
            <Screen>
                <JOTitle>Dernières écoutes</JOTitle>
                <TrackList
                    data={this.props.lastListened}
                    onPress={(track: Track) => this._onPress(track)}
                    horizontal={true}
                />
                <JOTitle>Recommandations</JOTitle>
                <TrackList
                    data={this.props.lastListened}
                    onPress={(track: Track) => this._onPress(track)}
                />
            </Screen>
        )
    }
}

const mapStateToProps = (state: any) => {
    let lastListened = [], i = 0
    const history = state.history.history
    while (lastListened.length < 20 && i < history.length) {
        const ht = history[i++]
        if (lastListened.findIndex(t => t.videoId === ht.videoId) === -1) {
            lastListened.push(ht)
        }
    }

    return {
        lastListened: lastListened
    }
}


export default connect(mapStateToProps)(Home)
