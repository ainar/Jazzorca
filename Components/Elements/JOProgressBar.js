import React from 'react'

import { View, StyleSheet } from 'react-native'
import Slider from '@react-native-community/slider';
import TrackPlayer from 'react-native-track-player'
import JOText from './JOText';
import { formatSeconds } from '../../helpers/utils'
import { connect } from 'react-redux';

class JOProgressBar extends TrackPlayer.ProgressComponent {

    constructor(props) {
        super(props)
        this._isSliding = false
        this._slider = undefined
        this._positionUpdating = false
        this._isPlaying = true
    }

    _seekTo(position) {
        this._positionUpdating = true;
        TrackPlayer.seekTo(position)
            .then(() => {
                this._positionUpdating = false;
            })
    }

    componentDidMount() {
        this._progressUpdates = true;
        this._updateProgress();
        this._timer = setInterval(this._updateProgress.bind(this), 200);
    }

    _showTiming() {
        if (this.props.showTiming === undefined || this.props.showTiming) {
            return (
                <View style={styles.time_information}>
                    <JOText style={styles.position}>{formatSeconds(this.state.position)}</JOText>
                    <JOText style={styles.duration}>{formatSeconds(this.state.duration)}</JOText>
                </View>
            )
        }
    }

    render() {
        if (this._slider !== undefined &&
            !this._isSliding &&
            !this._positionUpdating) {

            this._slider.setNativeProps({ value: this.state.position })
        }

        return (
            <View style={[{ flexDirection: 'row' }, this.props.style]}>
                <View style={{ flexDirection: 'column', flex: 1 }} >
                    <Slider
                        minimumValue={0}
                        maximumValue={this.state.duration}
                        onValueChange={value => this._seekTo(value)}
                        minimumTrackTintColor="#FFFFFF"
                        maximumTrackTintColor="#9F9F9F"
                        onSlidingStart={() => {
                            this._isSliding = true;
                        }}
                        onSlidingComplete={() => {
                            this._isSliding = false;
                        }}
                        thumbImage={this.props.thumbImage}
                        ref={ref => this._slider = ref}
                    />
                    {this._showTiming()}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    time_information: {
        flexDirection: 'row'
    },
    position: {
        flex: 1,
        marginLeft: 20
    },
    duration: {
        marginRight: 20
    }
})


const mapStateToProps = (state) => ({
    playerState: state.playerState.playerState
})

export default connect(mapStateToProps)(JOProgressBar)