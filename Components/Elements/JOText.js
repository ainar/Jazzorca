import React from 'react'
import { Text, StyleSheet } from 'react-native'

class JOText extends React.Component {
    render() {
        return (
            <Text style={[styles.jo_text, this.props.style]} {...this.props}>
                {this.props.children}
            </Text>
        )
    }
}

const styles = StyleSheet.create({
    jo_text: {
        color: 'white'
    }
})

export default JOText
