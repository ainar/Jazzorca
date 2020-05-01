import React from 'react'
import { StyleSheet } from 'react-native'
import JOText, { JOTextProps } from './JOText'

interface JOTitleProps extends JOTextProps { }

const JOTitle = (props: JOTitleProps) => {
    return (
        <JOText style={[props.style, styles.jo_title]}>
            {props.children}
        </JOText>
    )
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
