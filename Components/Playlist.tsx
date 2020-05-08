import React, { Component } from 'react'
import { LayoutChangeEvent } from 'react-native'
import { skip, playNow } from '../store/actions'
import JOTitle from './Elements/JOTitle'
import TrackList from './Elements/TrackList'
import Screen from './Screen'
import { Track } from 'react-native-track-player'
import JOSubTitle from './Elements/JOSubTitle'
import { Playlist } from '../helpers/types'

interface PlaylistScreenProps {
    playlist: Playlist
}

class PlaylistScreen extends Component<PlaylistScreenProps> {
    constructor(props: PlaylistScreenProps) {
        super(props)
    }

    _onPress(track: Track) {
        /*todo*/
    }

    render() {
        return (
            <Screen>
                <JOTitle>Playlist</JOTitle>
                <JOSubTitle>{this.props.playlist.name}</JOSubTitle>
                <TrackList
                    data={this.props.playlist.tracks}
                    onPress={(track: Track) => this._onPress(track)}
                    keyExtractor={(track: Track) => track.id}
                />
            </Screen>
        )
    }
}

export default PlaylistScreen