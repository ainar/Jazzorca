import React, { Component } from 'react'
import JOTitle from './Elements/JOTitle'
import JOTrackList from './JOTrackList'
import JOScreen from './JOScreen'
import { connect } from 'react-redux'
import { skip } from '../helpers/playerControls'

class Queue extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tracklistHeight: undefined
        }
    }
    _getBottomPadding() {
        if (this.state.tracklistHeight !== undefined) {
            const { queue, currentTrack } = this.props
            const currentIndex = queue.findIndex(t => t.id === currentTrack.id)
            const tracksRemainingCount = queue.length - currentIndex
            return this.state.tracklistHeight - tracksRemainingCount * 80
        }
    }

    componentDidMount() {
        if (this.scrollView !== undefined)
            this.scrollView.scrollToEnd({ animated: true })
    }

    componentDidUpdate() {
        const { queue, currentTrack } = this.props
        const currentIndex = queue.findIndex(t => t.id === currentTrack.id)
        if (currentIndex >= queue.length - 2 && this.scrollView !== undefined)
            this.scrollView.scrollToEnd({ animated: true })
    }

    render() {
        return (
            <JOScreen>
                <JOTitle>File d'attente</JOTitle>
                <JOTrackList
                    forwardRef={ref => { this.scrollView = ref }}
                    data={this.props.queue}
                    onPress={track => skip(track.id)}
                    keyExtractor={track => track.id}
                    ListFooterComponentStyle={{ height: this._getBottomPadding() }}
                    onLayout={({ nativeEvent }) => this.setState({ tracklistHeight: nativeEvent.layout.height })}
                />
            </JOScreen>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        queue: state.playerState.queue,
        currentTrack: state.playerState.currentTrack
    }
}

export default connect(mapStateToProps)(Queue)