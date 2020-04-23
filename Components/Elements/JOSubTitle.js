import React from 'react'
import { StyleSheet } from 'react-native'
import JOText from './JOText'

class JOSubTitle extends React.Component {
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
        fontSize: 25,
        fontWeight: 'bold',
        marginVertical: 10,
        marginLeft: 10
    }
})

export default JOSubTitle
