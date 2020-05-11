import React, { Component } from 'react'
import { Text, StyleSheet, View, ListRenderItem, GestureResponderEvent } from 'react-native'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import JOText from '../JOText'
import { Playlist } from '../../../helpers/types'
import PlaylistListItem from './PlaylistListItem'

export interface PlaylistListProps {
    data: Playlist[],
    onItemPress: ((playlist: Playlist) => void)
    onItemLongPress?: ((playlist: Playlist) => void)
}

export default class PlaylistList extends Component<PlaylistListProps> {
    render() {
        return (
            <>
                <View style={styles.meta} >
                    <JOText style={styles.duration}>durée totale</JOText>
                </View>
                <FlatList
                    data={this.props.data}
                    keyExtractor={({ id }) => id}
                    renderItem={({ item: track }) => (
                        <PlaylistListItem
                            playlist={track}
                            onPress={() => this.props.onItemPress(track)}
                            onLongPress={() => { if (this.props.onItemLongPress !== undefined) this.props.onItemLongPress(track) }}
                        />
                    )}
                />
            </>
        )
    }
}

const styles = StyleSheet.create({
    meta: {
        flexDirection: 'row-reverse'
    },
    duration: {
        fontSize: 15,
        marginRight: 10,
    }
})
