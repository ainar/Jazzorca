import React from 'react'
import JOText from './JOText'
import { connect } from 'react-redux'

class CurrentTitle extends React.Component {
    render() {
        return (
            <JOText {...this.props}>
                {this.props.track !== undefined ? this.props.track.title : ''}
            </JOText>
        )
    }
}

const mapStateToProps = (state) => ({
    track: state.playerState.currentTrack
})

export default connect(mapStateToProps)(CurrentTitle)