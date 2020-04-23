import React from 'react'
import { StyleSheet, View } from 'react-native'
import JOProgressBar from './Elements/JOProgressBar'
import JOPlayerControls from './Elements/JOPlayerControls';
import JOScreen from './JOScreen';
import CurrentArtist from './Elements/CurrentArtist';
import CurrentArtwork from './Elements/CurrentArtwork';
import CurrentTitle from './Elements/CurrentTitle';

class JOPlayer extends React.Component {
    render() {
        return (
            <JOScreen style={styles.main_component}>
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