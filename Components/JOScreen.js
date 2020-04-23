import React from 'react'
import { View, StyleSheet } from 'react-native'

class JOScreen extends React.Component {
    render() {
        return (
            <View {...this.props} style={[styles.main_component, this.props.style]}>
                {this.props.children}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_component: {
        flex: 1,
    }
})

export default JOScreen