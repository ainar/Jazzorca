import React from 'react'
import JOText from './JOText'
import { connect } from 'react-redux'

class CurrentArtist extends React.Component {
    render() {
        return (
            <JOText {...this.props}>
                {this.props.track !== undefined ? this.props.track.artist : ''}
            </JOText>
        )
    }
}

const mapStateToProps = (state) => ({
    track: state.playerState.cache[state.playerState.currentTrack]
})

export default connect(mapStateToProps)(CurrentArtist)