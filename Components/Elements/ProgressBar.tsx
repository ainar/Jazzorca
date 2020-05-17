import React from 'react'
import { View, StyleSheet, ViewStyle, ImageURISource } from 'react-native'
import { connect } from 'react-redux';
import Slider from '@react-native-community/slider';
import { ProgressComponent } from 'react-native-track-player'
import { formatSeconds } from '../../helpers/utils'
import JOText from './JOText';
import { JOState } from '../../store/configureStore';
import JOTrackPlayer from '../../helpers/trackPlayerWrapper';

interface JOProgressBarProps {
    showTiming?: boolean,
    style?: ViewStyle,
    thumbImage?: ImageURISource
}

class JOProgressBar extends ProgressComponent<JOProgressBarProps> {
    _isSliding: boolean
    _slider: Slider | null
    _positionUpdating: boolean
    _isPlaying: boolean
    _progressUpdates: boolean | undefined
    _updateProgress: Function | any
    _timer: NodeJS.Timeout | undefined

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
        JOTrackPlayer.seekTo(position)
            .then(() => {
                this._positionUpdating = false;
            })
    }
    
    async _updateProgressSonos() {
        // TODO check for performance here
        // We can create a new native function to reduces these 3 native calls to only one, if needed
        try {
            const data: {
                position: number,
                duration: number,
            } = await JOTrackPlayer.getCurrentInfo();

            console.log(data);

            if(this._progressUpdates) {
                this.setState(data);
            }
        } catch(e) {
            // The player is probably not initialized yet, we'll just ignore it
        }
    }

    componentDidMount() {
        this._progressUpdates = true;
        if (global.sonos !== undefined) {
            this._updateProgressSonos();
            this._timer = setInterval(this._updateProgressSonos.bind(this), 1000);
        } else {
            this._updateProgress();
            this._timer = setInterval(this._updateProgress.bind(this), 1000) as unknown as NodeJS.Timeout;
        }
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


const mapStateToProps = (state: JOState) => ({
    playerState: state.playerState.playerState
})

export default connect(mapStateToProps)(JOProgressBar)