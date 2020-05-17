import React from 'react'
import { FlatList, LayoutChangeEvent } from 'react-native'
import { connect } from 'react-redux'
import JOTitle from './Elements/JOTitle'
import TrackList from './Elements/TrackList'
import Screen from './Screen'
import JOTrackPlayer from '../helpers/trackPlayerWrapper'
import { JOTrack } from '../helpers/types'
import { JOState } from '../store/configureStore'

interface QueueProps {
    queue: JOTrack[],
    currentTrack: JOTrack | undefined
}

class Queue extends React.Component<QueueProps> {
    state: {
        tracklistHeight: number
    }
    scrollView: FlatList<JOTrack> | undefined

    constructor(props: QueueProps) {
        super(props)
        this.state = {
            tracklistHeight: 0
        }
        this.scrollView = undefined
    }
    _getBottomPadding() {
        if (this.state.tracklistHeight !== undefined) {
            const { queue, currentTrack } = this.props;
            if (currentTrack !== undefined) {
                const currentIndex = queue.findIndex(t => t.id === currentTrack.id)
                const tracksRemainingCount = queue.length - currentIndex
                return this.state.tracklistHeight - tracksRemainingCount * 80
            }
        }
    }

    componentDidMount() {
        if (this.scrollView !== undefined)
            this.scrollView.scrollToEnd({ animated: true })
    }

    componentDidUpdate() {
        const { queue, currentTrack } = this.props;
        if (currentTrack !== undefined) {
            const currentIndex = queue.findIndex(t => t.id === currentTrack.id)
            if (currentIndex >= queue.length - 2 && this.scrollView !== undefined) {
                this.scrollView.scrollToEnd({ animated: true });
            }
        }
    }

    render() {
        return (
            <Screen>
                <JOTitle>File d'attente</JOTitle>
                <TrackList
                    forwardRef={(ref: FlatList<JOTrack>) => { this.scrollView = ref }}
                    data={this.props.queue}
                    onPress={(track: JOTrack) => JOTrackPlayer.skip(track.id)}
                    keyExtractor={(track: JOTrack) => track.id}
                    ListFooterComponentStyle={{ height: this._getBottomPadding() }}
                    onLayout={({ nativeEvent }: LayoutChangeEvent) => this.setState({ tracklistHeight: nativeEvent.layout.height })}
                    currentTrackChecker={(track: JOTrack, currentTrack: JOTrack) => currentTrack !== undefined && track.id === currentTrack.id}
                />
            </Screen>
        )
    }
}

const mapStateToProps = (state: JOState) => ({
    queue: state.playerState.queue,
    currentTrack: state.playerState.currentTrack
})

export default connect(mapStateToProps)(Queue)