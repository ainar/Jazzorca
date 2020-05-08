import React from 'react'
import { View, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Linking } from 'react-native'
import { connect } from 'react-redux'
import { Track } from 'react-native-track-player'
import Icon from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { manualAddToQueue, resetCurrentTrack } from '../../store/actions'
import JOText from './JOText'
import JOButton from './JOButton'
import TrackModal from './TrackModal'

interface JOTrackListItemProps {
    nowPlaying: Track,
    track: Track,
    onPress: Function,
    onPlay: Function,
    dispatch: Function,
    loading: boolean
}

class JOTrackListItem extends React.Component<JOTrackListItemProps> {
    state: {
        loading: boolean,
        modalVisible: boolean,
        errorModalVisible: boolean
    }

    playerLoading: boolean;
    modal: TrackModal | null;
    errorModal: TrackModal | null;

    constructor(props: JOTrackListItemProps) {
        super(props);

        this.state = {
            loading: false,
            modalVisible: false,
            errorModalVisible: false
        };

        this.playerLoading = false;
        this.modal = null;
        this.errorModal = null;
    }

    _nowPlaying() {
        const { nowPlaying, track } = this.props;
        return nowPlaying !== undefined && nowPlaying.videoId === track.videoId;
    }

    _displayNowPlaying() {
        if (this._nowPlaying()) {
            return <Icon name='caretright' size={30} style={styles.is_playing_icon} />
        }
    }

    _displayLoading() {
        if (this.state.loading) {
            return <ActivityIndicator style={styles.is_playing_icon} />
        }
    }

    _onPress() {
        this.setState({ loading: true });
        this.props.onPress(this.props.track)
            .catch(() => {
                this.errorModal!._showModal();
                this.props.dispatch(resetCurrentTrack());
            })
            .finally(() => this.setState({ loading: false }));
    }

    _addToQueue() {
        const { track, dispatch } = this.props
        this.modal!._hideModal();
        dispatch(manualAddToQueue(track))
            .catch(() => this.errorModal!._showModal());
    }

    _watchOnYouTube() {
        Linking.openURL('https://youtu.be/' + this.props.track.videoId)
        this.modal!._hideModal();
    }

    render() {
        return (
            <>
                <TrackModal
                    modalStyle={{ backgroundColor: 'red' }} autoHide={2000}
                    ref={ref => { this.errorModal = ref }}
                >
                    <JOText style={{ textAlign: 'center', fontSize: 20 }}>Une erreur est survenue lors de la récupération de la vidéo sur YouTube.</JOText>
                </TrackModal>
                <TrackModal
                    ref={ref => { this.modal = ref }}
                >
                    <JOButton
                        icon={<MaterialCommunityIcon name='playlist-plus' size={30} />}
                        title={"Ajouter à la file d'attente"}
                        onPress={() => this._addToQueue()}
                    />
                    <JOButton
                        icon={<MaterialCommunityIcon name='youtube' size={30} />}
                        title={"Voir sur YouTube"}
                        onPress={() => this._watchOnYouTube()}
                    />
                </TrackModal>
                <TouchableOpacity
                    onLongPress={() => this.modal!._showModal()}
                    onPress={() => this._onPress()}
                    disabled={this.state.loading}
                >
                    <View style={styles.main_component}>
                        <View style={styles.imageBox}>
                            <Image
                                source={this.props.track.artwork}
                                style={styles.thumbnail}
                            />
                            <JOText style={styles.lengthText}>
                                {this.props.track.lengthText}
                            </JOText>
                            {this._displayNowPlaying()}
                            {this._displayLoading()}
                        </View>
                        <View style={styles.meta_block}>
                            <JOText style={[styles.title, styles.meta, this._nowPlaying() ? styles.title_current : undefined]} numberOfLines={2} >{this.props.track.title}</JOText>
                            <JOText style={[styles.artist, styles.meta]} numberOfLines={1} >{this.props.track.artist}</JOText>
                        </View>
                    </View>
                </TouchableOpacity>
            </>
        )
    }
}

const styles: any = StyleSheet.create({
    main_component: {
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: 80,
        flexDirection: 'row',

    },
    meta_block: {
        flex: 1
    },
    meta: {
        fontSize: 15,
    },
    title: {
        marginBottom: 0,
        fontWeight: 'bold'
    },
    title_current: {
        color: '#1c5dff'
    },
    artist: {
        color: 'grey'
    },
    thumbnail: {
        width: 94,
        height: 47,
    },
    is_playing_icon: {
        position: "absolute",
        top: 5,
        left: -5
    },
    imageBox: {
        width: 100,
        marginRight: 10
    },
    lengthText: {
        position: "absolute",
        backgroundColor: 'rgba(0,0,0,0.7)',
        textAlign: 'right',
        right: 6,
        bottom: 0
    },
    modal_screen: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center'
    },
    modal_content: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        margin: 20
    },
})

const mapStateToProps = (state: any) => ({
    cache: state.playerState.cache,
    queue: state.playerState.queue
})


export default connect(mapStateToProps)(JOTrackListItem)