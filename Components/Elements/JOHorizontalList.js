import React from 'react'
import { FlatList } from 'react-native'

class JOHorizontalList extends React.Component {
    render() {
        return (
            <FlatList
                horizontal={true}
                data={this.props.data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={this.props.renderItem}
            />
        )
    }
}

export default JOHorizontalList