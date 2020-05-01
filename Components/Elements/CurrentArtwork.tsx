import React, { Component } from 'react'
import { Image, StyleProp } from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/Feather'
import { Track } from 'react-native-track-player'

interface CurrentArtworkProps {
    track: Track,
    style: StyleProp<any>,
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