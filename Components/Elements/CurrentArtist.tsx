import React from 'react'
import { TextProperties } from 'react-native'
import { connect } from 'react-redux'
import { Track } from 'react-native-track-player'
import JOText from './JOText'

interface CurrentArtistProps extends TextProperties {
    track: Track
}

const CurrentArtist = (props: CurrentArtistProps) => {
    return (
        <JOText {...props}>
            {props.track !== undefined ? props.track.artist : ''}
        </JOText>
    )
}

const mapStateToProps = (state: any) => {
    return {
        track: state.playerState.currentTrack
    }
}

export default connect(mapStateToProps)(CurrentArtist)