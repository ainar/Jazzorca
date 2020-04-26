import React from 'react'
import { StyleSheet, View, TouchableHighlight } from 'react-native'
import JOProgressBar from './Elements/JOProgressBar'
import JOPlayerControls from './Elements/JOPlayerControls';
import JOScreen from './JOScreen';
import CurrentArtist from './Elements/CurrentArtist';
import CurrentArtwork from './Elements/CurrentArtwork';
import CurrentTitle from './Elements/CurrentTitle';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import JOText from './Elements/JOText';

class JOPlayer extends React.Component {
    render() {
        return (
            <JOScreen style={styles.main_component}>
                <View style={styles.header}>
                    <TouchableHighlight onPress={() => this.props.navigation.goBack()}>
                        <View style={styles.back_button}>
                            <MaterialIcon name='arrow-back' size={30} color={'rgba(255,255,255,0.8)'} />
                            <JOText style={styles.back_text}>Retour</JOText>
                        </View>
                    </TouchableHighlight>
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
                    <CurrentArtist style={styles.track_artist} numberOfLines={1} />
                </View>
                <JOProgressBar />
                <JOPlayerControls />
            </JOScreen>
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
        height: 20,
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
    track_artist: {

    },
    controls: {
        flexDirection: 'row'
    },
    control_button: {
        marginVertical: 10,
        marginHorizontal: 20
    }
})

export default JOPlayer