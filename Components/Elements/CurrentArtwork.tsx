import React from 'react'
import { Image, StyleProp, ImageStyle } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Feather'
import { JOTrack } from '../../helpers/types'

interface CurrentArtworkProps {
    track: JOTrack | undefined,
    style: StyleProp<ImageStyle>,
    size: number
}

const CurrentArtwork = (props: CurrentArtworkProps) => {
    if (props.track !== undefined)
        return (<Image source={props.track.artwork} {...props} />)
    else
        return (<Icon name={'headphones'} {...props} />)
}

const mapStateToProps = (state: any) => ({
    track: state.playerState.currentTrack
})

export default connect(mapStateToProps)(CurrentArtwork)