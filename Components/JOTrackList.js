import React from 'react'
import { View, FlatList, ActivityIndicator } from 'react-native'
import JOTrackListItem from './Elements/JOTrackListItem'
import TrackPlayer from 'react-native-track-player'
import { connect } from 'react-redux'

class JOTrackList extends React.Component {

    _displayLoadingNextPage() {
        if (this.props.loadingNextPage) {
            return (
                <View>
                    <ActivityIndicator size='large' />
                </View>
            )
        } else {
            return <></>
        }
    }

    render() {
        return (
            <FlatList
                style={this.props.style}
                renderItem={({ item }) =>
                    <JOTrackListItem
                        track={item}
                        nowPlaying={this.props.currentTrack}
                        onPlay={this.props.onPlay}
                        onPress={this.props.onPress}
                        loading={this.props.loading}
                    />}
                keyExtractor={data => data.videoId}
                onEndReachedThreshold={0.01}
                ListHeaderComponent={<View></View>}
                ListFooterComponent={() => this._displayLoadingNextPage()}
                ref={this.props.forwardRef}
                {...this.props}
            />
        )
    }
}

const mapStateToProps = (state) => ({
    currentTrack: state.playerState.currentTrack,
    loading: state.playerState.loading
})


export default connect(mapStateToProps)(JOTrackList)