import React, { Component, ComponentProps } from 'react'
import { connect } from 'react-redux'
import Screen from './Screen'
import JOTitle from './Elements/JOTitle'
import PlaylistList from './Elements/PlaylistList'
import { Playlist } from '../helpers/types'
import JOButton from './Elements/JOButton'
import CreatePlaylistModal from './Elements/CreatePlaylistModal'
import JOModal from './Elements/JOModal'

interface LibraryProps {
    playlists: Playlist[]
}

export class Library extends Component<LibraryProps> {
    createPlaylistJOModal: JOModal | null

    state: {
        createPlaylistModalVisible: boolean
    }

    constructor(props: LibraryProps) {
        super(props)

        this.state = {
            createPlaylistModalVisible: false,
        }

        this.createPlaylistJOModal = null;
    }

    _showCreatePlaylistModal() {
        this.createPlaylistJOModal?.show();
    }

    _showPlaylist(playlist: Playlist) {
        /* Todo */  
    }

    render() {
        return (
            <Screen>
                <JOTitle>Listes de lecture</JOTitle>
                <CreatePlaylistModal
                    forwardRef={ref => this.createPlaylistJOModal = ref}
                    visible={this.state.createPlaylistModalVisible}
                />
                <JOButton
                    title={"Créer une nouvelle liste"}
                    onPress={() => this._showCreatePlaylistModal()}
                />
                <PlaylistList
                    data={this.props.playlists}
                    onItemPress={(playlist: Playlist) => this._showPlaylist(playlist)}
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
