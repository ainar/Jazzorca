import React from 'react'
import { View, StyleSheet, ViewStyle, ImageURISource } from 'react-native'
import { connect } from 'react-redux';
import Slider from '@react-native-community/slider';
import TrackPlayer from 'react-native-track-player'
import { formatSeconds } from '../../helpers/utils'
import JOText from './JOText';
import { State } from '../../store/configureStore';

interface JOProgressBarProps {
    showTiming?: boolean,
    style?: ViewStyle,
    thumbImage?: ImageURISource
}

class JOProgressBar extends TrackPlayer.ProgressComponent<JOProgressBarProps> {
    _isSliding: boolean
    _slider: Slider | null
    _positionUpdating: boolean
    _isPlaying: boolean
    _progressUpdates: boolean | undefined
    _updateProgress: Function | any
    _timer: number | undefined

    constructor(props: JOProgressBarProps) {
        super(props)
        this._isSliding = false
        this._slider = null
        this._positionUpdating = false
        this._isPlaying = true
    }

    static defaultProps = {
        showTiming: true,
        thumbImage: undefined
    }

    _seekTo(position: number) {
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
        if (this.props.showTiming) {
            return (
                <View style={styles.time_information}>
                    <JOText style={styles.position}>{formatSeconds(this.state.position)}</JOText>
                    <JOText style={styles.duration}>{formatSeconds(this.state.duration)}</JOText>
                </View>
            )
        }
    }

    render() {
        if (this._slider !== null &&
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


const mapStateToProps = (state: State) => ({
    playerState: state.playerState.playerState
})

export default connect(mapStateToProps)(JOProgressBar)