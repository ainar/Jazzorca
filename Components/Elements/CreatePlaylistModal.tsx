import React, { Component } from 'react'
import { StyleSheet, TextInput, Alert } from 'react-native'

import JOModal from './JOModal'
import JOSubTitle from './JOSubTitle';
import JOButton from './JOButton';
import { connect } from 'react-redux';
import { addPlaylist } from '../../store/actions';


interface CreatePlaylistModalProps {
    visible: boolean,
    forwardRef: ((instance: JOModal | null) => void),
    dispatch: Function,
}

class CreatePlaylistModal extends Component<CreatePlaylistModalProps> {
    textInput: TextInput | null
    _jomodal: JOModal | null
    state: {
        name: string
    }

    constructor(props: CreatePlaylistModalProps) {
        super(props);

        this.state = {
            name: ""
        }

        this.textInput = null;
        this._jomodal = null;
    }

    _onShow() {
        this.textInput?.focus();
        this.setState({
            name: ""
        });
    }

    _createPlaylist() {
        const { dispatch } = this.props;
        if (this.state.name.length > 0) {
            dispatch(addPlaylist(this.state.name));
            this._jomodal?.hide();
        } else {
            Alert.alert('Le nom de la liste ne peut pas être vide.')
        }
    }

    render() {
        return (
            <JOModal
                ref={(ref) => {
                    this._jomodal = ref;
                    this.props.forwardRef(ref);
                }}
                onShow={() => this._onShow()}
            >
                <JOSubTitle>Créer une nouvelle liste de lecture</JOSubTitle>
                <TextInput
                    style={styles.textInput}
                    placeholder={'Nom de la nouvelle liste'}
                    ref={ref => this.textInput = ref}
                    onSubmitEditing={() => this._createPlaylist()}
                    onChangeText={(name) => this.setState({ name })}
                />
                <JOButton
                    title={'Valider'}
                    onPress={() => this._createPlaylist()}
                />
            </JOModal>
        )
    }
}

const styles = StyleSheet.create({
    textInput: {
        marginHorizontal: 20,
        fontSize: 20,
        backgroundColor: "rgba(255,255,255,.2)"
    }
})

export default connect()(CreatePlaylistModal)