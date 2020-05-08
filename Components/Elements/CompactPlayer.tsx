import React from 'react'
import { StyleSheet, View, TouchableHighlight } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { NavigationProp } from '@react-navigation/native'
import JOPlayerControls from './PlayerControls'
import JOProgressBar from './ProgressBar'
import CurrentTitle from './CurrentTitle'
import CurrentArtist from './CurrentArtist'

interface CompactPlayerProps {
    navigation: NavigationProp<any>
}

const CompactPlayer = (props: CompactPlayerProps) => {
    return (
        <View style={styles.main_component} >
            <JOProgressBar
                style={styles.progress_bar}
                thumbImage={require('../../assets/transparentThumbImage.png')}
                showTiming={false}
            />
            <TouchableHighlight onPress={() => props.navigation.navigate('Player')}>
                <View style={styles.inner_component}>
                    <View style={styles.meta}>
                        <CurrentTitle numberOfLines={2} style={styles.title} />
                        <CurrentArtist numberOfLines={1} style={styles.artist} />
                    </View>
                    <JOPlayerControls middleButtonSize={30} buttonSize={20} />
                </View>
            </TouchableHighlight>
        </View>
    )
}

export default function () {
    const navigation = useNavigation();

    return <CompactPlayer navigation={navigation} />;
}

const styles = StyleSheet.create({
    main_component: {
        position: "absolute",
        bottom: 54,
        right: 0,
        left: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        height: 60
    },
    inner_component: {
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    meta: {
        flex: 1,
        marginHorizontal: 10
    },
    artist: {
    },
    title: {
        fontWeight: 'bold'
    },
    progress_bar: {
        position: 'absolute',
        top: -10,
        left: -15,
        right: -15
    }
})
