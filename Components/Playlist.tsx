import React, { Component } from 'react'
import { removeFromPlaylist, playPlaylist } from '../store/actions'
import TrackList from './Elements/TrackList'
import Screen from './Screen'
import JOSubTitle from './Elements/JOSubTitle'
import { Playlist, JOThunkDispatch, JOTrack } from '../helpers/types'
import JOButton from './Elements/JOButton'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux'
import TrackModal from './Elements/TrackModal'
import { PlaylistScreenRouteProp } from '../Navigation/Navigation'
import { JOState } from '../store/configureStore'

interface PlaylistScreenProps {
    playlist: Playlist,
    playlists: Playlist[],
    route: PlaylistScreenRouteProp,
    dispatch: JOThunkDispatch
}

class PlaylistScreen extends Component<PlaylistScreenProps> {
    trackModal: TrackModal | null

    constructor(props:PlaylistScreenProps) {
        super(props);
        this.trackModal = null;
    }

    async _onPress(track: JOTrack) {
        const { dispatch, playlists, route } = this.props;
        const playlist: Playlist = playlists.find(({ id }) => id === route.params.playlist.id)!;
        dispatch(playPlaylist(playlist, track.id))
            .catch((e: string) => console.error(e));
    }

    private _removeFromPlaylist(track: JOTrack) {
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
                    onPress={(track: JOTrack) => this._onPress(track)}
                    keyExtractor={(track: JOTrack) => track.id}
                    modalRef={(ref: TrackModal) => this.trackModal = ref}
                    modalExtra={(track: JOTrack) =>
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

const mapStateToProps = (state: JOState) => ({
    playlists: state.playlists.playlists
})


export default connect(mapStateToProps)(PlaylistScreen)