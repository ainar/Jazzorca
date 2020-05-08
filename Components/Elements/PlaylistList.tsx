import React, { Component } from 'react'
import { Text, StyleSheet, View, ListRenderItem, GestureResponderEvent } from 'react-native'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import JOText from './JOText'
import { Playlist } from '../../helpers/types'

export interface PlaylistListProps {
    data: Playlist[],
    onItemPress: ((playlist: Playlist) => void)
}

export default class PlaylistList extends Component<PlaylistListProps> {
    render() {
        return (
            <FlatList
                data={this.props.data}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => this.props.onItemPress(item)}
                    >
                        <JOText>{item.name}</JOText>
                    </TouchableOpacity>
                )}
            />
        )
    }
}

const styles = StyleSheet.create({

})
