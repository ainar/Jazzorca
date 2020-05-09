import React, { RefObject, ComponentProps } from 'react'
import { View, FlatList, ActivityIndicator } from 'react-native'
import JOTrackListItem from './TrackListItem'
import { connect } from 'react-redux'
import { Track } from 'react-native-track-player'
import TrackModal from '../TrackModal'

interface TrackListProps extends ComponentProps<any> {
    onPress: Function,
    loadingNextPage?: Function,
    onPlay: Function,
    loading: boolean,
    currentTrack: Track,
    forwardRef?: React.LegacyRef<FlatList<any>>,
    data: Track[],
    modalExtra: (t: Track) => React.ReactNode,
    modalRef: (m: TrackModal | null) => void
}

class TrackList extends React.Component<TrackListProps> {

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
                        modalExtra={this.props.modalExtra}
                        modalRef={this.props.modalRef}
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

const mapStateToProps = (state: any) => ({
    currentTrack: state.playerState.currentTrack,
    loading: state.playerState.loading
})


export default connect(mapStateToProps)(TrackList)