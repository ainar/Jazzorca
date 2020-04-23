import React from 'react'
import { StyleSheet } from 'react-native'
import JOText from './JOText'

class JOTitle extends React.Component {
    render() {
        return (
            <JOText style={[this.props.style, styles.jo_title]}>
                {this.props.children}
            </JOText>
        )
    }
}

const styles = StyleSheet.create({
    jo_title: {
        fontSize: 40,
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: 50,
        marginBottom: 30
    }
})

export default JOTitle
