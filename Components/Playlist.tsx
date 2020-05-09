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
    playlist: Playlist,
    route: any
}

class PlaylistScreen extends Component<PlaylistScreenProps> {
    _onPress(track: Track) {
        /*todo*/
    }

    render() {
        const { route } = this.props;
        return (
            <Screen>
                <JOSubTitle>{route.params.playlist.name}</JOSubTitle>
                <TrackList
                    data={route.params.playlist.tracks}
                    onPress={(track: Track) => this._onPress(track)}
                    keyExtractor={(track: Track) => track.id}
                />
            </Screen>
        )
    }
}

export default PlaylistScreen