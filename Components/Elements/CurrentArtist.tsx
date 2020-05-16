import React from 'react'
import { TextProperties } from 'react-native'
import { connect } from 'react-redux'
import JOText from './JOText'
import { State } from '../../store/configureStore'
import { JOTrack } from '../../helpers/types'

interface CurrentArtistProps extends TextProperties {
    track: JOTrack | undefined
}

const CurrentArtist = (props: CurrentArtistProps) => {
    return (
        <JOText {...props}>
            {props.track !== undefined ? props.track.artist : ''}
        </JOText>
    )
}

const mapStateToProps = (state: State) => ({
    track: state.playerState.currentTrack
});

export default connect(mapStateToProps)(CurrentArtist)