import React from 'react'
import { TextProperties } from 'react-native'
import { connect } from 'react-redux'
import { Track } from 'react-native-track-player'
import JOText from './JOText'

interface CurrentTitleProps extends TextProperties {
    track: Track
}

const CurrentTitle = (props: CurrentTitleProps) => {
    return (
        <JOText {...props}>
            {props.track !== undefined ? props.track.title : ''}
        </JOText>
    )
}

const mapStateToProps = (state: any) => ({
    track: state.playerState.currentTrack
})

export default connect(mapStateToProps)(CurrentTitle)