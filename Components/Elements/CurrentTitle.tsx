import React from 'react'
import { TextProperties } from 'react-native'
import { connect } from 'react-redux'
import JOText from './JOText'
import { JOTrack } from '../../helpers/types'
import { JOState } from '../../store/configureStore'

interface CurrentTitleProps extends TextProperties {
    track: JOTrack | undefined
}

const CurrentTitle = (props: CurrentTitleProps) => {
    return (
        <JOText {...props}>
            {props.track !== undefined ? props.track.title : ''}
        </JOText>
    )
}

const mapStateToProps = (state: JOState) => ({
    track: state.playerState.currentTrack
})

export default connect(mapStateToProps)(CurrentTitle)