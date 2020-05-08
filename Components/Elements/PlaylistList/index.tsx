import React, { Component } from 'react'
import { Text, StyleSheet, View, ListRenderItem, GestureResponderEvent } from 'react-native'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import JOText from '../JOText'
import { Playlist } from '../../../helpers/types'
import PlaylistListItem from './PlaylistListItem'

export interface PlaylistListProps {
    data: Playlist[],
    onItemPress: ((playlist: Playlist) => void)
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
                renderItem={({ item }) => (
                    <PlaylistListItem
                        playlist={item}
                        onPress={() => this.props.onItemPress(item)}
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
