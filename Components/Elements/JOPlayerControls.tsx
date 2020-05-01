import React from 'react'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/AntDesign'
import { Animated, Easing } from 'react-native'
import { connect } from 'react-redux';
import { skipToPrevious } from '../../helpers/playerControls';
import { play, pause, STATE_PLAYING, State, skipToNext } from 'react-native-track-player';

interface JOPlayerControlsProps {
    playerState: State,
    loading: boolean,
    middleButtonSize?: number,
    buttonSize?: number
}

class JOPlayerControls extends React.Component<JOPlayerControlsProps> {
    state: {
        opacity: Animated.Value
    }

    constructor(props: JOPlayerControlsProps) {
        super(props)

        this.state = {
            opacity: new Animated.Value(1)
        }
    }

    // The animation functions. Initial and end values can be anything (not just 1, 10, but remember to use the same value and flip them:
    _loopAnimationUp() {
        this.state.opacity.setValue(0);
        Animated.timing(this.state.opacity, {
            toValue: 1,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: false
        }).start((o) => {
            if (o.finished) {
                this._loopAnimationDown();
            }
        });
    }

    _loopAnimationDown() {
        this.state.opacity.setValue(1);
        Animated.timing(this.state.opacity, {
            toValue: 0,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: false
        }).start((o) => {
            if (o.finished) {
                this._loopAnimationUp();
            }
        });
    }

    _isPlaying() {
        return this.props.playerState === STATE_PLAYING
    }

    _displayMiddleButton() {
        const middleButtonSize = this.props.middleButtonSize || 50
        if (this.props.loading)
            this._loopAnimationDown();
        else {
            this.state.opacity.stopAnimation()
            this.state.opacity.setValue(1)
        }

        return (
            <TouchableOpacity
                style={[styles.control_button, styles.middle_button, { width: middleButtonSize }]}
                onPress={() => { this._isPlaying() ? pause() : play() }}
            >
                <Animated.View style={{ opacity: this.state.opacity }}>
                    <Icon name={this._isPlaying() ? 'pause' : 'caretright'} color='#fff' size={middleButtonSize} />
                </Animated.View>
            </TouchableOpacity >
        )
    }

    render() {
        return (
            <View style={styles.controls}>
                <TouchableOpacity style={styles.control_button} onPress={() => skipToPrevious()} >
                    <Icon name='stepbackward' color='#fff' size={this.props.buttonSize || 40} />
                </TouchableOpacity>
                {this._displayMiddleButton()}
                <TouchableOpacity style={styles.control_button} onPress={() => skipToNext()} >
                    <Icon name='stepforward' color='#fff' size={this.props.buttonSize || 40} />
                </TouchableOpacity>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 50
    },
    control_button: {
        marginVertical: 10,
        marginHorizontal: 15
    },
    middle_button: {
        alignItems: 'center'
    },
    loading_container: {
        position: "absolute",
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loading: {

    }
})

const mapStateToProps = (state: any) => ({
    playerState: state.playerState.playerState,
    loading: state.playerState.loading
})

export default connect(mapStateToProps)(JOPlayerControls)