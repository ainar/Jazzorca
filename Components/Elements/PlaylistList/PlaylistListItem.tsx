import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, GestureResponderEvent, View } from 'react-native'
import { Playlist } from '../../../helpers/types'
import JOText from '../JOText'
import { formatSeconds } from '../../../helpers/utils';

interface PlaylistListItemProps {
    onPress: ((event: GestureResponderEvent) => void) | undefined,
    onLongPress?: ((event: GestureResponderEvent) => void) | undefined,
    playlist: Playlist
}

export default class PlaylistListItem extends Component<PlaylistListItemProps> {
    render() {
        const totalDurationSeconds = this.props.playlist.tracks.reduce((sum, track) => sum + track.duration!, 0);
        const totalDurationText = formatSeconds(totalDurationSeconds)
        return (
            <TouchableOpacity
                onPress={this.props.onPress}
                onLongPress={this.props.onLongPress}
                style={styles.main_container}
            >
                <JOText style={styles.playlist_name}>{this.props.playlist.name}</JOText>
                <View style={styles.meta} >
                    <JOText style={styles.track_count}>{this.props.playlist.tracks.length} titre(s)</JOText>
                    <JOText style={styles.duration}>{totalDurationText}</JOText>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        padding: 10
    },
    playlist_name: {
        fontSize: 20
    },
    meta: {
        flexDirection: 'row'
    },
    track_count: {
        fontSize: 20,
        fontStyle: 'italic',
        flex: 1
    },
    duration: {
        fontSize: 20,
    }
})
