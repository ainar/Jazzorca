import React, { Component } from 'react'
import { StyleSheet, View, TouchableHighlight, ActivityIndicator } from 'react-native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import JOProgressBar from './Elements/ProgressBar'
import JOPlayerControls from './Elements/PlayerControls';
import CurrentArtist from './Elements/CurrentArtist';
import CurrentArtwork from './Elements/CurrentArtwork';
import CurrentTitle from './Elements/CurrentTitle';
import JOText from './Elements/JOText';
import Screen from './Screen';
import { PlayerTabNavigationProp } from '../Navigation/Navigation'

import { search } from 'react-native-sonos'
import JOModal from './Elements/JOModal'
import JOButton from './Elements/JOButton'
import { JOThunkDispatch } from '../helpers/types'
import { switchSonos, resetQueue } from '../store/actions'
import { connect } from 'react-redux'
import { JOState } from '../store/configureStore'
import { Device } from '../store/reducers/playerStateReducer'

interface PlayerProps {
    navigation: PlayerTabNavigationProp,
    dispatch: JOThunkDispatch,
    device: Device
}

type SonosSpeaker = {
    sonos: any,
    name: string,
    serialNum: string
}

class Player extends Component<PlayerProps> {

    _sonosSpeakerModal: JOModal | null

    state: {
        sonosSpeakers: SonosSpeaker[],
        searchingSonosSpeakers: boolean,
    }

    constructor(props: PlayerProps) {
        super(props);

        this.state = {
            sonosSpeakers: [],
            searchingSonosSpeakers: false
        }

        this._sonosSpeakerModal = null;
    }

    _searchSonos() {
        this.setState({
            searchingSonosSpeakers: true
        });
        setTimeout(() => {
            this.setState({
                searchingSonosSpeakers: false
            })
        }, 5000);

        this._sonosSpeakerModal?.show();
        return search(null, (sonos: any, model: string) => this._processDevice(sonos, model))
    }


    _processDevice(sonos: any, model: string) {
        console.log(model);
        if (model.split(' ')[2].startsWith("Sonos")) {
            sonos.deviceDescription((_: null, deviceDescription: any) => this._addDevice(sonos, deviceDescription))
        }
    }

    _addDevice(sonos: any, deviceDescription: any) {
        console.log(deviceDescription);
        const name = deviceDescription.roomName;
        const serialNum = deviceDescription.serialNum;
        const sonosSpeakers = [...this.state.sonosSpeakers];
        if (sonosSpeakers.findIndex(s => s.sonos.host === sonos.host) === -1) {
            sonosSpeakers.push({ sonos, name, serialNum });
            this.setState({
                sonosSpeakers,
                searchingSonosSpeakers: false
            });
        }
    }

    _displaySonosButton() {
        if (this.state.searchingSonosSpeakers) {
            return <ActivityIndicator size={40} />
        } else {
            if (this.props.device === Device.Sonos) {
                return <TouchableHighlight onPress={() => this._setDevice(undefined)}>
                    <MaterialCommunityIcon name='speaker-off' size={40} />
                </TouchableHighlight>
            } else {
                return <TouchableHighlight onPress={() => this._searchSonos()}>
                    <MaterialCommunityIcon name='speaker' size={40} />
                </TouchableHighlight>
            }
        }
    }

    _setDevice(sonos: any) {
        const { dispatch } = this.props;
        this._sonosSpeakerModal?.hide();

        this.setState({
            searchingSonosSpeakers: false
        });

        if (sonos !== undefined) {
            dispatch(resetQueue());
        }

        dispatch(resetQueue());
        dispatch(switchSonos(sonos));
    }

    _displaySonosSpeakers() {
        return this.state.sonosSpeakers.map(({ sonos, name, serialNum }) => (
            <JOButton
                title={name}
                key={serialNum}
                onPress={() => this._setDevice(sonos)}
            />
        ));
    }

    render() {
        return (
            <Screen style={styles.main_component}>
                <JOModal
                    ref={ref => this._sonosSpeakerModal = ref}
                >
                    {this._displaySonosSpeakers()}
                </JOModal>
                <View style={styles.header}>
                    <TouchableHighlight onPress={() => this.props.navigation.goBack()}>
                        <View style={styles.back_button}>
                            <MaterialIcon name='arrow-back' size={30} color={'rgba(255,255,255,0.8)'} />
                            <JOText style={styles.back_text}>Retour</JOText>
                        </View>
                    </TouchableHighlight>
                    {this._displaySonosButton()}
                </View>
                <View style={styles.footer}>
                    <TouchableHighlight onPress={() => this.props.navigation.navigate('Queue')}>
                        <MaterialCommunityIcon name='playlist-play' size={40} />
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => this.props.navigation.navigate('Related')}>
                        <MaterialIcon name='casino' size={40} />
                    </TouchableHighlight>
                </View>
                <View style={styles.artwork_container}>
                    <CurrentArtwork style={styles.artwork} size={250} />
                </View>
                <View style={styles.meta_container}>
                    <CurrentTitle style={styles.track_title} numberOfLines={2} />
                    <CurrentArtist numberOfLines={1} />
                </View>
                <JOProgressBar />
                <JOPlayerControls />
            </Screen>
        )
    }
}

const styles = StyleSheet.create({
    main_component: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        position: 'absolute',
        top: 40,
        left: 20,
        right: 20,
        height: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    back_text: {
        fontWeight: 'bold',
        opacity: 0.8,
        fontSize: 20,
        marginLeft: 10
    },
    back_button: {
        flexDirection: 'row'
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        height: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        left: 20,
        right: 20
    },
    artwork_container: {
        width: 250,
        height: 250,
        margin: 10,
        alignItems: 'stretch',
        justifyContent: 'center'
    },
    artwork: {
        flex: 1
    },
    meta_container: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10
    },
    track_title: {
        fontSize: 20,
        textAlign: 'center',
        marginHorizontal: 10
    },
    controls: {
        flexDirection: 'row'
    },
    control_button: {
        marginVertical: 10,
        marginHorizontal: 20
    }
})

const mapStateToProps = (state: JOState) => ({
    device: state.playerState.device
})

export default connect(mapStateToProps)(Player)