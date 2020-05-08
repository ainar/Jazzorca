import React, { Component } from 'react'
import { Modal, StyleSheet, View, TouchableWithoutFeedback, ViewStyle, StyleProp } from 'react-native'

interface TrackModalProps {
    autoHide?: number,
    modalStyle?: StyleProp<ViewStyle>
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

    _showModal() {
        this.setState({ modalVisible: true }, () => {
            if (this.props.autoHide) {
                setTimeout(() => this.setState({ modalVisible: false }), this.props.autoHide);
            }
        });
    }

    _hideModal() {
        this.setState({ modalVisible: false });
    }

    render() {
        return (
            <Modal
                visible={this.state.modalVisible}
                animationType='fade'
                onRequestClose={() => this._hideModal()}
                transparent={true}
            >
                <TouchableWithoutFeedback
                    onPress={() => this._hideModal()}
                >
                    <View style={styles.modal_screen}>
                        <View style={[styles.modal_content, this.props.modalStyle]}>
                            {this.props.children}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
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
