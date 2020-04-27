import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import JOText from './JOText'

const JOButton = (props) => {
    const icon = props.icon ? props.icon : undefined
    return (
        <TouchableOpacity {...props}>
            <View style={styles.main_content}>
                {icon}
                <JOText style={styles.label}>{props.title}</JOText>
            </View>
        </TouchableOpacity>
    )
}

export default JOButton

const styles = StyleSheet.create({
    main_content: {
        padding: 10,
        backgroundColor: 'rgba(0,0,0,0.8)',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    label: {
        fontWeight: 'bold',
        fontSize: 20,
        marginLeft: 10
    }
})
