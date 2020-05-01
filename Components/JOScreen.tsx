import React, { ReactNode } from 'react'
import { View, StyleSheet, ViewProperties } from 'react-native'

interface JOScreenProps extends ViewProperties {
    children: ReactNode
}

const JOScreen = (props: JOScreenProps) => {
    return (
        <View {...props} style={[styles.main_component, props.style]}>
            {props.children}
        </View>
    )
}

const styles = StyleSheet.create({
    main_component: {
        flex: 1,
    }
})

export default JOScreen