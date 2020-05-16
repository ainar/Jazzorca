import React from 'react'
import { StyleSheet } from 'react-native'
import { Input, InputProps } from 'react-native-elements'

interface JOSearchInputProps extends InputProps { }

const JOSearchInput = (props: JOSearchInputProps) => {
    return (
        <Input
            placeholder={"Rechercher"}
            placeholderTextColor={"grey"}
            inputStyle={styles.input}
            inputContainerStyle={styles.inputContainerStyle}
            returnKeyType={'search'}
            {...props}
        />
    )
}

const styles = StyleSheet.create({
    input: {
        paddingHorizontal: 15,
    },
    inputContainerStyle: {
        borderBottomWidth: 0,
        marginBottom: 10,
        marginHorizontal: 5,
        backgroundColor: 'white'
    },
})

export default JOSearchInput