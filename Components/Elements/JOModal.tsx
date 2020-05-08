import React, { Component } from 'react'
import { Modal as RNModal, StyleSheet, View, TouchableWithoutFeedback, ViewStyle, StyleProp, NativeSyntheticEvent } from 'react-native'

interface ModalProps {
    autoHide?: number,
    modalStyle?: StyleProp<ViewStyle>,
    onShow?: ((event: NativeSyntheticEvent<any>) => void) | undefined
}

export default class JOModal extends Component<ModalProps> {
    state: {
        modalVisible: boolean,
    }

    constructor(props: ModalProps) {
        super(props);

        this.state = {
            modalVisible: false
        }
    }

    show() {
        this.setState({ modalVisible: true }, () => {
            if (this.props.autoHide) {
                setTimeout(() => this.setState({ modalVisible: false }), this.props.autoHide);
            }
        });
    }

    hide() {
        this.setState({ modalVisible: false });
    }

    render() {
        return (
            <RNModal
                visible={this.state.modalVisible}
                animationType='fade'
                onRequestClose={() => this.hide()}
                transparent={true}
                onShow={this.props.onShow}
            >
                <TouchableWithoutFeedback
                    onPress={() => this.hide()}
                >
                    <View style={styles.modal_screen}>
                        <View style={[styles.modal_content, this.props.modalStyle]}>
                            {this.props.children}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </RNModal>
        )
    }
}

const styles = StyleSheet.create({
    modal_content: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        margin: 20
    },
    modal_screen: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent: 'center'
    },
})
