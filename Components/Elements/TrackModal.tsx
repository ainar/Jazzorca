import React, { Component } from 'react'
import { Modal, StyleSheet, View, TouchableWithoutFeedback, ViewStyle, StyleProp } from 'react-native'
import JOModal from './JOModal';

interface TrackModalProps {
    autoHide?: number,
    modalStyle?: StyleProp<ViewStyle>,
    forwardRef: ((instance: JOModal | null) => void),
}

export default class TrackModal extends Component<TrackModalProps> {
    state: {
        modalVisible: boolean,
    }

    constructor(props: TrackModalProps) {
        super(props);

        this.state = {
            modalVisible: false
        }
    }

    render() {
        return (
            <JOModal
                ref={(ref) => this.props.forwardRef(ref)}
            >
                {this.props.children}
            </JOModal>
        )
    }
}

const styles = StyleSheet.create({
    modal_content: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        margin: 20
    },
    modal_screen: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center'
    },
})
