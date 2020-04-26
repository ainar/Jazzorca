import React from 'react'
import Player from '../Player'
import { Image } from 'react-native'
import Icon from 'react-native-vector-icons/Feather'
import { connect } from 'react-redux'

class CurrentArtwork extends React.Component {
    render() {
        if (this.props.track !== undefined)
            return (
                <Image
                    source={this.props.track.artwork}
                    {...this.props}
                />
            )
        else
            return (
                <Icon name={'headphones'} {...this.props} />
            )
    }
}

const mapStateToProps = (state) => ({
    track: state.playerState.currentTrack
})

export default connect(mapStateToProps)(CurrentArtwork)