import React, { Component } from 'react'
import { removeFromPlaylist, reset, playPlaylist } from '../store/actions'
import TrackList from './Elements/TrackList'
import Screen from './Screen'
import { Track } from 'react-native-track-player'
import JOSubTitle from './Elements/JOSubTitle'
import { Playlist, Action } from '../helpers/types'
import JOButton from './Elements/JOButton'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux'
import TrackModal from './Elements/TrackModal'
import { ThunkDispatch, ThunkAction } from 'redux-thunk'
import { AnyAction } from 'redux'

interface PlaylistScreenProps {
    playlist: Playlist,
    playlists: Playlist[],
    route: any,
    dispatch: (a: any) => Promise<any>
}

class PlaylistScreen extends Component<PlaylistScreenProps> {
    trackModal: TrackModal | null

    constructor(props:PlaylistScreenProps) {
        super(props);
        this.trackModal = null;
    }

    async _onPress(track: Track) {
        const { dispatch, playlists, route } = this.props;
        const playlist: Playlist = playlists.find(({ id }) => id === route.params.playlist.id)!;
        dispatch(playPlaylist(playlist, track.id))
            .catch((e: string) => console.error(e));
    }

    private _removeFromPlaylist(track: Track) {
        const { dispatch, route } = this.props;
        dispatch(removeFromPlaylist(route.params.playlist.id, track.id));
    }

    render() {
        const { route, playlists } = this.props;
        const playlist: Playlist = playlists.find(({ id }) => id === route.params.playlist.id)!;

        return (
            <Screen>
                <JOSubTitle>{playlist.name}</JOSubTitle>
                <TrackList
                    data={playlist.tracks}
                    onPress={(track: Track) => this._onPress(track)}
                    keyExtractor={(track: Track) => track.id}
                    modalRef={(ref: TrackModal) => this.trackModal = ref}
                    modalExtra={(track: Track) =>
                        <JOButton
                            title="Supprimer de la liste"
                            icon={<Icon name='playlist-remove' size={30} color='black' />}
                            onPress={() => this._removeFromPlaylist(track)}
                        />
                    }
                />
            </Screen>
        )
    }
}

const mapStateToProps = (state: any) => ({
    playlists: state.playlists.playlists
})


export default connect(mapStateToProps)(PlaylistScreen)