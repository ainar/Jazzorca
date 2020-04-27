import React from 'react'
import { View, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Modal, Button, TouchableWithoutFeedback } from 'react-native'
import JOText from './JOText'
import Icon from 'react-native-vector-icons/AntDesign'
import JOButton from './JOButton'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux'
import { addToQueue, getTrack } from '../../helpers/playerControls'

class JOTrackListItem extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            modalVisible: false
        }
        this.playerLoading = false
    }
    _nowPlaying() {
        const { nowPlaying, track } = this.props
        return nowPlaying !== undefined && nowPlaying.videoId === track.videoId
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
        this.setState({ loading: true })
        this.props.onPress(this.props.track)
            .then(() => this.setState({ loading: false }))
    }

    _hideModal() {
        this.setState({ modalVisible: false })
    }

    _showModal() {
        this.setState({ modalVisible: true })
    }

    render() {
        return (
            <>
                <Modal
                    visible={this.state.modalVisible}
                    animationType='fade'
                    onRequestClose={() => this._hideModal()}
                    transparent={true}
                    statusBarTranslucent={true}
                    style={styles.modal}
                >
                    <TouchableWithoutFeedback
                        onPress={() => this._hideModal()}
                    >
                        <View style={styles.modal_screen}>
                            <View style={styles.modal_content}>
                                <JOButton
                                    icon={<MaterialCommunityIcon name='playlist-plus' size={30} />}
                                    title={"Ajouter à la file d'attente"}
                                    onPress={async () => {
                                        const { track, cache, dispatch } = this.props
                                        this._hideModal()
                                        const ytTrack = await getTrack(track, cache)
                                        dispatch(addToQueue(ytTrack))
                                    }}
                                />
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                <TouchableOpacity
                    onLongPress={() => this._showModal()}
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

const styles = StyleSheet.create({
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

const mapStateToProps = (state) => ({
    cache: state.playerState.cache
})


export default connect(mapStateToProps)(JOTrackListItem)