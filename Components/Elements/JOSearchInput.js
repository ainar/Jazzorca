import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Input } from 'react-native-elements'

class JOSearchInput extends React.Component {


    render() {
        return (
            <Input
                placeholder={"Rechercher"}
                placeholderTextColor={"grey"}
                inputStyle={styles.input}
                backgroundColor={'white'}
                inputContainerStyle={styles.inputContainerStyle}
                returnKeyType={'search'}
                onSubmitEditing={this.props.onSubmitEditing}
            />
        )
    }
}

export default JOSearchInput

const styles = StyleSheet.create({
    input: {
        paddingHorizontal: 15,
    },
    inputContainerStyle: {
        borderBottomWidth: 0,
        marginBottom: 10,
        marginHorizontal: 5,
    },
})
