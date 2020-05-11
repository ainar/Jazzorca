import React, { Component, ComponentProps } from 'react'
import { connect } from 'react-redux'
import Screen from './Screen'
import PlaylistList from './Elements/PlaylistList'
import { Playlist } from '../helpers/types'
import JOButton from './Elements/JOButton'
import AddPlaylistModal from './Elements/AddPlaylistModal'
import JOModal from './Elements/JOModal'
import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'redux'
import { removePlaylist } from '../store/actions'

interface LibraryProps {
    playlists: Playlist[],
    navigation: any,
    dispatch: ThunkDispatch<any, null, Action>
}

export class Library extends Component<LibraryProps> {
    addPlaylistJOModal: JOModal | null
    removePlaylistJOModal: JOModal | null
    selectedPlaylist: Playlist | null

    state: {
        createPlaylistModalVisible: boolean
    }

    constructor(props: LibraryProps) {
        super(props)

        this.state = {
            createPlaylistModalVisible: false,
        }

        this.addPlaylistJOModal = null;
        this.removePlaylistJOModal = null;
        this.selectedPlaylist = null;
    }

    _showCreatePlaylistModal() {
        this.addPlaylistJOModal?.show();
    }

    _showPlaylist(playlist: Playlist) {
        const { navigation } = this.props;
        navigation.navigate('Playlist', {
            playlist: playlist
        });
    }

    _showRemovePlaylistModal(playlist: Playlist) {
        this.selectedPlaylist = playlist;
        if (this.removePlaylistJOModal !== null) {
            this.removePlaylistJOModal.show();
        }
    }

    _removePlaylist() {
        if (this.selectedPlaylist !== null) {
            this.props.dispatch(removePlaylist(this.selectedPlaylist));
        };
        this.removePlaylistJOModal!.hide();
    }

    render() {
        return (
            <Screen>
                <AddPlaylistModal
                    forwardRef={ref => this.addPlaylistJOModal = ref}
                    visible={this.state.createPlaylistModalVisible}
                />
                <JOModal
                    ref={ref => this.removePlaylistJOModal = ref}
                >
                    <JOButton
                        onPress={() => this._removePlaylist()}
                        title="Supprimer la liste de lecture"
                    />
                </JOModal>
                <JOButton
                    title={"Créer une nouvelle liste"}
                    onPress={() => this._showCreatePlaylistModal()}
                />
                <PlaylistList
                    data={this.props.playlists}
                    onItemPress={(playlist: Playlist) => this._showPlaylist(playlist)}
                    onItemLongPress={(playlist: Playlist) => this._showRemovePlaylistModal(playlist)}
                />
            </Screen>
        )
    }
}

const mapStateToProps = (state: any) => {
    return {
        playlists: state.playlists.playlists
    }
}


export default connect(mapStateToProps)(Library)
