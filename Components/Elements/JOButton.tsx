import React from 'react'
import { StyleSheet, TouchableOpacity, View, TouchableOpacityProperties } from 'react-native'
import JOText from './JOText'

interface JOButtonProps extends TouchableOpacityProperties {
    title: string,
    icon?: Element
}

const JOButton = (props: JOButtonProps) => {
    return (
        <TouchableOpacity {...props}>
            <View style={styles.main_content}>
                {props.icon}
                <JOText style={styles.label}>{props.title}</JOText>
            </View>
        </TouchableOpacity>
    )
}

export default JOButton

const styles = StyleSheet.create({
    main_content: {
        padding: 10,
        backgroundColor: '#e6e6e6',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    label: {
        fontSize: 20,
        marginLeft: 10,
        color: 'rgba(0,0,0,0.8)'
    }
})
