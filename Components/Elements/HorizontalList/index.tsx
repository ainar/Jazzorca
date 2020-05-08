import React from 'react'
import { FlatList, ListRenderItem } from 'react-native'
import { Track } from 'react-native-track-player'

interface HorizontalListProps {
    data: Track[],
    renderItem: ListRenderItem<Track>
}

const JOHorizontalList = (props: HorizontalListProps) => {
    return (
        <FlatList
            horizontal={true}
            data={props.data}
            keyExtractor={(_item, index) => index.toString()}
            renderItem={props.renderItem}
        />
    )
}

export default JOHorizontalList