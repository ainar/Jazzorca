import React from 'react'
import { Text, TextProperties, StyleSheet, StyleProp, TextStyle } from 'react-native'

export interface JOTextProps extends TextProperties {
    style?: StyleProp<TextStyle>,
    children: React.ReactNode,
}

const JOText = (props: JOTextProps) => {
    return (
        <Text style={[styles.jo_text, props.style]} {...props}>
            {props.children}
        </Text>
    )
}

const styles = StyleSheet.create({
    jo_text: {
        color: 'white'
    }
})

export default JOText
